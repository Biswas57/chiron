# **Chiron: Production Setup**
See `vm_deployment.md`

# **Chiron: Local Development Setup**

## **🚀 Overview**
This guide provides step-by-step instructions to set up and run the Chiron application locally. **Ensure that Python and Node.js are already installed** on your system before proceeding.

---

## **📌 Prerequisites**
Before running the application, install the required dependencies.

### **1️⃣ Install Required Dependencies**
Run the following commands to install necessary dependencies:

```bash
# Install pip3 if not already installed
python3 -m ensurepip --default-pip

# Upgrade pip3 to the latest version
pip3 install --upgrade pip

# Install virtualenv (recommended for Python dependency management)
pip3 install virtualenv

# Install npm (if not already installed)
npm install -g npm@latest
```

Verify the installations:
```bash
python3 --version  # Should output Python 3 version
pip3 --version     # Should output pip version
node -v            # Should output Node.js version
npm -v             # Should output npm version
```

---

## **📂 Clone the Repository and Install Dependencies**

```bash
# Clone the Chiron repository
git clone <your-repo-url> chiron
cd chiron
```

### **2️⃣ Install Frontend Dependencies**
```bash
cd client
npm install
```

### **3️⃣ Install Backend Dependencies**
```bash
cd ../server

# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate  # Use 'venv\Scripts\activate' on Windows

# Install required Python dependencies
pip3 install -r requirements.txt
```

---

## **🚀 Running the Application Locally**

### **4️⃣ Start the Backend (Flask API)**
```bash
cd server
source venv/bin/activate  # Use 'venv\Scripts\activate' on Windows
python3 app.py
```
The Flask backend should now be running on **http://localhost:5000**

### **5️⃣ Start the Frontend (React App)**
```bash
cd ../client
npm start
```
The frontend should now be running on **http://localhost:3000**

---

## **✅ Verifying the Setup**
- **Check Flask API:** Open a browser and visit **http://localhost:5000/api/health** (or use Postman/curl).
- **Check React App:** Open **http://localhost:3000** in a browser.
- If the frontend and backend are connected properly, API calls should return valid responses.

---

## **🛠 Troubleshooting**
### **Common Issues & Fixes**
| Issue | Solution |
|--------|----------|
| `ModuleNotFoundError` when running Flask | Ensure virtualenv is activated before running `python3 app.py`, especially if you are on windows |
| Frontend shows API connection errors | Check if backend is running on `localhost:5000` |
| Frontend shows HTTP status 500 errors | Check what specific error is being printed on the backend terminal |
| `npm install` fails | Run `npm cache clean --force` and try again |

---

## **🎯 Additional Notes**
- Always activate the virtual environment (`source venv/bin/activate`) before running backend commands, especially on windows devices.
- Use `CTRL+C` to stop the server in the terminal.
- To exit the virtual environment, run `deactivate`.

Now you’re all set to develop with Chiron locally! 🚀