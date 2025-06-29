import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:3001/api';

function App() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      const result = await axios.post(`${API_URL}/chat`, {
        message: message.trim()
      });
      
      setResponse(result.data.response);
      setMessage('');
      
    } catch (err) {
      setError('Error al comunicarse con la IA');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🤖 Mi Asistente IA</h1>
        
        <form onSubmit={handleSubmit} className="chat-form">
          <div className="input-group">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe tu mensaje aquí..."
              rows={4}
              disabled={loading}
            />
            <button 
              type="submit" 
              disabled={loading || !message.trim()}
            >
              {loading ? '⏳ Enviando...' : '📤 Enviar'}
            </button>
          </div>
        </form>

        {error && (
          <div className="error">
            ❌ {error}
          </div>
        )}

        {response && (
          <div className="response">
            <h3>🤖 Respuesta:</h3>
            <p>{response}</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;