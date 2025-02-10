# Complete Deployment Guide for Chiron + Ollama on Rocky Linux

## Initial Setup and Prerequisites

### 0. Set up VM on Prism Element
Create a VM on an SSD/NVMe cluster with at least 300GB of disk, 200GB of RAM and as much CPUs as possible. At least 100GHz worth of CPU is recommended for acceptable performance.

Configure your VM with a static IP address, IP gateway, Name Server and Netmask.

TODO: add ova stuff

### 1. Install Required Packages
```bash
# Update system
sudo dnf update -y
sudo dnf upgrade -y

# Install tar package
dnf install tar -y

# Install Node.js and npm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
### IMPORTANT: Then follow onscreen instruction for updating bashrc
### Finally:
nvm install 22

# Install Python and pip
sudo dnf install python3 python3-pip -y

# Install Git
sudo dnf install git -y

# Install nginx
sudo dnf install nginx -y
```

### 2. Install Ollama for running AI models locally
```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Create a directory for Ollama to download the models
mkdir /home/ollama_alt_home

# Using your favourite text editor, reconfigure Ollama to use the new home
sudo vi /etc/systemd/system/ollama.service
# Add this line:
Environment="HOME=/home/ollama_alt_home"
# Under [Environment]

# Make the directory owned by the Ollama user
sudo chown ollama /home/ollama_alt_home
sudo chgrp ollama /home/ollama_alt_home

# Restart Ollama service for changes to take effect
sudo systemctl daemon-reload && sudo systemctl restart ollama
```

### 3. Clone Repository and Install Dependencies
```bash
# Navigate to home directory
cd ~

# Personal Access Token (PAT) for Cloning the repository into a VM
PAT=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

# Clone the Chiron repository
git clone https://<PAT>@github.com/Biswas57/repo.git chiron
cd chiron

# Install frontend dependencies
cd client
npm install

# IMPORTANT: Ensure the API call URL in App.js have your VM's ip address with port 4242!
vi src/App.js
# Build frontend for deployment later
# You will see some warnings, this is OK.
npm run build

# Change permission for backend dependency install script
cd ../server
# For Rocky Linux
chmod +x dep_script_rocky
# For Windows/Mac OS
chmod +x dep_script

# Install backend dependencies
# This will take a a few minutes.
sudo ./dep_script_rocky
# OR
sudo ./dep_script
```

### 4. Download AI Models
Although not strictly necessary, it is recommended you do this step to be able to monitor the download progress easily as once the backend is deployed as a service, viewing the download progress will be more difficult.
```bash
# Run the backend manually, this will trigger download of the AI models automatically
python app.py

# You will see something like this:
[chiron@localhost server]$ python app.py 
>> BOOTING UP
>> *** Downloaded models:
>> []
>> *** Needed models:
>> ['llama3.1:8b-instruct-fp16', 'llama3.3:70b-instruct-fp16']
>> Checking status of llama3.1:8b-instruct-fp16...haven\'t been downloaded...downloading:
>> executing shell command: ollama pull llama3.1:8b-instruct-fp16
...

# Wait for the downloads and checksum validation to finish. It is about 160GB. Press Ctrl+C to exit once you see "ALL MODELS OK...CONTINUING BOOT"
```

## Configure Backend (Flask)

### 1. Update Flask Code
Navigate to your server directory and ensure your Flask app has the correct host setting in app.py:
```bash
cd ~/chiron/server

# Ensure main in app.py looks like this:
if __name__ == "__main__":
    socketio.run(app, debug=True, host='0.0.0.0', port=4242, allow_unsafe_werkzeug=True)
```

### 2. Create Flask Service for Backend
```bash
# Create systemd service file
sudo vi /etc/systemd/system/flask-app.service
```

Add the following content:
```ini
[Unit]
Description=Flask Application
After=network.target

[Service]
User=chiron
WorkingDirectory=/home/chiron/chiron/server
Environment="FLASK_APP=app.py"
Environment="FLASK_ENV=production"
ExecStart=/usr/bin/python3 app.py
Restart=always
TimeoutStartSec=20
TimeoutStopSec=20

[Install]
WantedBy=multi-user.target
```

## Configure Frontend Deployment (Nginx)

### 1. Set Directory Permissions
```bash
# Set correct permissions for directories
sudo chmod 755 /home /home/chiron /home/chiron/chiron/client /home/chiron/chiron/client/build

# Change ownership of build directory
sudo chown -R nginx:nginx /home/chiron/chiron/client/build
```

### 2. Configure Nginx
```bash
# Create nginx configuration
sudo vi /etc/nginx/conf.d/app.conf
```

Add the following content:
```nginx
server {
    listen 80;
    
    location / {
        root /home/chiron/chiron/client/build;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:4242;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 3. Configure SELinux
```bash
# Install SELinux management tools
sudo dnf install policycoreutils-python-utils -y

# Set SELinux context for build directory
sudo semanage fcontext -a -t httpd_sys_content_t "/home/chiron/chiron/client/build(/.*)?"
sudo restorecon -Rv /home/chiron/chiron/client/build

# Allow nginx to connect to Flask backend
sudo setsebool -P httpd_can_network_connect 1

# Allow nginx to read home directories
sudo setsebool -P httpd_enable_homedirs 1
```

## Start Web Application
### 1. Enable and Start Nginx
```bash
# Test nginx configuration
sudo nginx -t

# Enable and start nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 2. Enable and Start Flask App
```bash
# Enable and start Flask service
sudo systemctl enable flask-app
sudo systemctl start flask-app
```

### 3. Configure Firewall
```bash
# Allow HTTP traffic
sudo firewall-cmd --permanent --add-service=http

# Allow TCP traffic on port 4242 for clients' frontend to talk to backend
sudo firewall-cmd --permanent --add-port=4242/tcp

# Refresh firewall
sudo firewall-cmd --reload

# Verify firewall configuration
sudo firewall-cmd --list-all
```

## Verify Web App Deployment
### 1. Check Service Status
```bash
# Check nginx status
sudo systemctl status nginx

# Check Flask app status
sudo systemctl status flask-app
```

### 2. Check Logs
```bash
# Check nginx error logs, should be empty
sudo tail -f /var/log/nginx/error.log

# Check Flask app logs, you should see "* Running on http://a.b.c.d:4242"
sudo journalctl -u flask-app -f
```

### 3. Test Access
1. Get your VM's IP address:
```bash
ip addr show
```

2. Test local connectivity:
```bash
# Test nginx
curl http://localhost
```

3. Test from external machine:
```bash
# From your local machine
ping <vm-ip>
telnet <vm-ip> 80
```

4. Access in browser:
```
http://<vm-ip>/
```

## Troubleshooting
### Common Issues and Solutions

1. 500 Internal Server Error:
   - Check nginx error logs: `sudo tail -f /var/log/nginx/error.log`
   - Verify file permissions
   - Check SELinux context: `ls -lZ /home/chiron/chiron`

2. Cannot connect to server:
   - Check firewall: `sudo firewall-cmd --list-all`
   - Verify services are running: `sudo systemctl status nginx flask-app`
   - Check if ports are listening: `sudo ss -tulpn | grep '80\|4242'`

3. Flask app not starting:
   - Check logs: `sudo journalctl -u flask-app -f`
   - Verify Python dependencies
   - Check file permissions in server directory

4. Backend not responding:
   - Use the [backend_troubleshoot script]() to test if websocket connection is existing
   - check AI API functions and correct variable are being parsed
   - check backend functions output formatting

### Quick Fixes

1. Restart services:
```bash
sudo systemctl restart nginx
sudo systemctl restart flask-app
```

2. Reset SELinux context:
```bash
sudo restorecon -Rv /home/chiron/chiron/client/build
```

3. Clear nginx cache:
```bash
sudo rm -rf /var/cache/nginx/*
sudo systemctl restart nginx
```

## Maintenance
### Updating the Application

1. Pull new code:
```bash
cd ~/chiron
git pull
```

2. Update frontend:
```bash
cd client
npm install
npm run build
sudo chown -R nginx:nginx build/
sudo systemctl restart nginx
```

3. Update backend:
```bash
cd ../server
sudo systemctl restart flask-app
```

### Monitoring
1. Check Ollama is performing inference:
```bash
btop
```

2. Check service health:
```bash
sudo systemctl status nginx flask-app
```

3. Monitor logs:
```bash
# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Flask app logs
sudo journalctl -u flask-app -f
```

