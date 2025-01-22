import React from 'react';
import Navbar from './components/Navbar';
import URLInput from './components/URLInput';
import './App.css';

function App() {
  const handleURLSubmit = (url) => {
    console.log('Submitted URL:', url);
    // API call logic can go here.
  };

  return (
    <div className="App">
      <Navbar />
      <URLInput onSubmit={handleURLSubmit} />
    </div>
  );
}

export default App;
