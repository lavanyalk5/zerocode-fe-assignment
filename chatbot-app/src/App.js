import React, { useState, useEffect } from 'react';
import Login from './login';
import Register from './register';
import Chat from './chat';
import './index.css';import './App.css';

function App() {
  const [authenticated, setAuthenticated] = useState(!!localStorage.getItem('token'));
  const [showRegister, setShowRegister] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      {!authenticated ? (
        <div className="flex flex-col justify-center items-center h-screen">
          {showRegister ? (
            <Register />
          ) : (
            <Login onLogin={() => setAuthenticated(true)} />
          )}
          <button
            className="mt-4 text-blue-600 underline"
            onClick={() => setShowRegister(!showRegister)}
          >
            {showRegister ? 'Already have an account? Login' : 'New user? Register here'}
          </button>
        </div>
      ) : (
        <Chat />
      )}
    </div>
  );
}

export default App;
