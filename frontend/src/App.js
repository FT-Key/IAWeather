import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import './App.css';

const API_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_URL
    : 'http://localhost:3001/api';

function App() {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const formatMessage = (text) => {
    if (!text) return '';

    const linkRegex = /\*\*\[(.*?)\]\((.*?)\)\*\*/g;
    let formattedText = text.replace(linkRegex, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color: #007acc; text-decoration: underline;">$1</a>');

    const simpleLinkRegex = /https?:\/\/[^\s<>"]+/g;
    formattedText = formattedText.replace(simpleLinkRegex, '<a href="$&" target="_blank" rel="noopener noreferrer" style="color: #007acc; text-decoration: underline;">$&</a>');

    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formattedText = formattedText.replace(/^- (.*$)/gim, '• $1');
    formattedText = formattedText.replace(/\n/g, '<br>');

    return formattedText;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message.trim();
    const newUserMessage = {
      id: Date.now(),
      type: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    };

    setConversation(prev => [...prev, newUserMessage]);
    setMessage('');
    setLoading(true);
    setError('');

    try {
      const result = await axios.post(`${API_URL}/chat`, {
        message: userMessage,
        conversation: conversation
      });

      if (result.data.success) {
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: result.data.response,
          timestamp: result.data.timestamp,
          model: result.data.model,
        };

        setConversation(prev => [...prev, aiMessage]);
      } else {
        setError(result.data.error || 'Error desconocido del servidor');
      }
    } catch (err) {
      if (err.response) {
        const serverError = err.response.data?.error || 'Error del servidor';
        setError(`Error ${err.response.status}: ${serverError}`);
      } else if (err.request) {
        setError('No se pudo conectar con el servidor. Verifica que esté funcionando.');
      } else {
        setError('Error inesperado. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setConversation([]);
    setMessage('');
    setError('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="App">
      <Navbar onClear={clearChat} />
      <div className="chat-container">
        <div className="chat-messages">
          {conversation.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#666', fontSize: '18px', marginTop: '50px' }}>
              <p>👋 ¡Hola! Soy tu asistente IA.</p>
              <p>Escribe tu mensaje para comenzar la conversación.</p>
            </div>
          ) : (
            conversation.map((msg) => (
              <div
                key={msg.id}
                className={`message ${msg.type === 'user' ? 'message-user' : 'message-ai'}`}
              >
                <div className="message-content">
                  {msg.type === 'user' ? (
                    <>
                      <div className="message-header"><strong>Tú</strong></div>
                      <div>{msg.content}</div>
                    </>
                  ) : (
                    <>
                      <div className="message-header" style={{ color: '#007acc', fontWeight: 'bold' }}>🤖 Asistente IA</div>
                      <div dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
                    </>
                  )}
                  <div className="message-timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</div>
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="message message-ai">
              <div className="message-content" style={{ fontStyle: 'italic' }}>
                <div className="message-header" style={{ color: '#007acc', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img className='appImg' src='logoKeyAI1-nobg.png' alt='Logo Key AI' />
                  Asistente IA</div>
                <div>⏳ Escribiendo...</div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {error && (
          <div className="error">
            <strong>❌ Error:</strong> {error}
          </div>
        )}

        <div className="chat-input">
          <form onSubmit={handleSubmit}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje... (Enter para enviar, Shift+Enter para nueva línea)"
              disabled={loading}
            />
            <button type="submit" disabled={loading || !message.trim()}>
              {loading ? '⏳' : '➤'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;