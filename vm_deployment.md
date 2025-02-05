# Complete Deployment Guide for Chiron + Ollama on Rocky Linux

## Initial Setup and Prerequisites

### 1. Install Required Packages
```bash
# Update system
sudo dnf update -y
sudo dnf upgrade -y

# Install Node.js and npm
sudo dnf install nodejs npm -y

# Install Python and pip
sudo dnf install python3 python3-pip -y

# Install Git
sudo dnf install git -y

# Install nginx
sudo dnf install nginx -y
```

### 3. Install Ollama AI model
```bash
# Install tar package
dnf install tar -y

# Fetch Ollama model from website
curl -fsSL https://ollama.com/install.sh | sh

# Check Ollama model runs properly
ollama run llama3.2-vision:90b

# Create Modelfile to increase context window allowing for larger article
echo "# Modelfile
FROM llama3.2-vision:90b
PARAMETER num_ctx 128000" > Modelfile

# Apply Modelfile
ollama create -f Modelfile llama3.2-vision:90b
```


### 3. Clone Repository and Install Dependencies
```bash
# Navigate to home directory
cd /home

# Clone your repository
git clone <your-repo-url> chiron
cd chiron

# Install frontend dependencies
cd client
npm install

# Ensure the API call URL in pages/MainPage.js has relative route: "api/generate"
# Build frontend
npm run build

# Change permission for backend dependency install script
cd ../server
chmod +x dep_script_rocky

# Install backend dependencies
./dep_script_rocky
```

## Configure Backend (Flask)
### 1. Update Flask Code
Navigate to your server directory and ensure your Flask app has the correct host setting in app.py:
```bash
cd /home/chiron/server

# Ensure app.py has the following block:
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
```

### 2. Create Flask Service
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
User=root
WorkingDirectory=/home/chiron/server
Environment="FLASK_APP=app.py"
Environment="FLASK_ENV=production"
ExecStart=/usr/bin/python3 -c "from app import app; app.run(host='0.0.0.0', port=5000)"
Restart=always
TimeoutStartSec=20
TimeoutStopSec=20

[Install]
WantedBy=multi-user.target
```

## Configure Frontend Deploymen (Nginx)

### 1. Set Directory Permissions
```bash
# Set correct permissions for directories
sudo chmod 755 /home
sudo chmod 755 /home/chiron
sudo chmod 755 /home/chiron/client
sudo chmod 755 /home/chiron/client/build

# Change ownership of build directory
sudo chown -R nginx:nginx /home/chiron/client/build
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
        root /home/chiron/client/build;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
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
sudo semanage fcontext -a -t httpd_sys_content_t "/home/chiron/client/build(/.*)?"
sudo restorecon -Rv /home/chiron/client/build

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
# Check nginx error logs
sudo tail -f /var/log/nginx/error.log

# Check Flask app logs
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
   - Check SELinux context: `ls -lZ /home/chiron/react-app/client/build`

2. Cannot connect to server:
   - Check firewall: `sudo firewall-cmd --list-all`
   - Verify services are running: `sudo systemctl status nginx flask-app`
   - Check if ports are listening: `sudo ss -tulpn | grep '80\|5000'`

3. Flask app not starting:
   - Check logs: `sudo journalctl -u flask-app -f`
   - Verify Python dependencies
   - Check file permissions in server directory

4. Backend not responding:
   - curl -X POST -H "Content-Type: application/json" -d '{"url":"https://portal.nutanix.com/page/documents/kbs/details?targetId=kA0320000004H2NCAU"}' http://localhost:5000/api/generate

  - check AI API functions and API keys
  - check backend functions output formatting

### Quick Fixes

1. Restart services:
```bash
sudo systemctl restart nginx
sudo systemctl restart flask-app
```

2. Reset SELinux context:
```bash
sudo restorecon -Rv /home/chiron/react-app/client/build
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
cd /home/chiron
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

