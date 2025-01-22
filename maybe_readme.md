# Getting Started with the React + Flask Application

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). The **client** folder contains your React application, and the **server** folder contains your Flask backend.

Below are instructions on how to run both the **frontend** (React) and **backend** (Flask) for development. If you only want to work on one side (frontend or backend), you can follow just the relevant section.

---

## 1. Run Your Flask Server

1. **Navigate into the `server/` folder**:
   ```bash
   cd server
   ```
2. **(Optional) Create a virtual environment** (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate   # On Windows: venv\Scripts\activate
   ```
3. **Install dependencies**:
   ```bash
   pip3 install -r requirements.txt # On Windows: pip install
   ```
4. **Start the Flask app**:
   ```bash
   python3 app.py # On Windows: python
   ```
5. **Confirm the server is running**. You should see something like:
   ```
   * Serving Flask app 'app'
   * Running on http://127.0.0.1:5000/
   ```
   Your backend is now listening on `http://localhost:5000`.

---

## 2. Run Your React App

1. **Open a separate terminal** (leave the Flask server running in its own terminal).
2. **Navigate into the `client/` folder**:
   ```bash
   cd client
   ```
3. **Install dependencies** (if you haven’t already):
   ```bash
   npm install
   ```
4. **Start the React development server**:
   ```bash
   npm start
   ```
5. **Open the app**. By default, it runs on `http://localhost:3000`.

---

## 3. Making Requests from React to Flask

Because your React app runs on port **3000**, and the Flask server runs on port **5000**, you need to enable CORS in Flask. If you already added:

```python
from flask_cors import CORS
CORS(app)
```

…then you can make requests in your React code like so:

```js
fetch("http://localhost:5000/api/extract-text", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url: "https://example.com" }),
})
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
  })
  .catch((err) => console.error(err));
```

---

## 4. Production Build

When you’re ready to deploy:

1. **Build the React app**:
   ```bash
   cd client
   npm run build
   ```
   This generates a production-optimized `build/` folder.

2. **Options** for serving your React build:
   - **Option A**: Serve the `build/` folder with a production-grade web server (like Nginx or Apache), and run your Flask app separately on a different domain or a separate sub-route.
   - **Option B**: Copy the `build/` folder into your Flask codebase (e.g., into `server/`), then configure Flask to serve these static files. This way, you can serve both the frontend and backend from a single server.

---

## 5. Other Create React App Scripts

Inside the `client/` directory, you can run additional scripts:

### `npm test`
Launches the test runner in interactive watch mode.  
See [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more details.

### `npm run eject`
**Note**: this is a one-way operation. Once you eject, you can’t go back.  
You can read more about ejecting [here](https://create-react-app.dev/docs/available-scripts/#npm-run-eject).

---

## Break-fix Documentation

- **React Documentation**: [https://reactjs.org/](https://reactjs.org/)  
- **Create React App Documentation**: [https://facebook.github.io/create-react-app/docs/getting-started](https://facebook.github.io/create-react-app/docs/getting-started)  
- **Flask Documentation**: [https://flask.palletsprojects.com/](https://flask.palletsprojects.com/)  
- **Flask-CORS Documentation**: [https://flask-cors.readthedocs.io/](https://flask-cors.readthedocs.io/)  