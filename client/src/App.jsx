import { useState, useRef, useEffect } from 'react';
import './index.css';
// It's good practice to install and use prop-types for runtime type checking in JS
import PropTypes from 'prop-types';

function App() {
  // State hooks without TypeScript generics
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState(Date.now());

  // Ref hook without the generic type
  const messagesEndRef = useRef(null);

  // useEffect remains the same
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    // Optional chaining is still useful here
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Event handlers without typed parameters
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (inputText.trim() === '' || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputText.trim(),
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // This Vite-specific environment variable access works the same in JS
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

      const response = await fetch(`${apiUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: userMessage.text,
          thread_id: threadId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.text();

      const aiMessage = {
        id: Date.now(),
        text: data,
        isUser: false,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);

      const errorMessage = {
        id: Date.now(),
        text: 'Sorry, there was an error processing your request.',
        isUser: false,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([]);
    setThreadId(Date.now());
  };

  // The JSX returned is identical
  return (
    <div className='chat-container'>
      <header className='chat-header'>
        <h1>AI Chat</h1>
        <button className='reset-button' onClick={resetChat}>
          <svg
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M8 3V1L4 5L8 9V7C10.21 7 12 8.79 12 11C12 13.21 10.21 15 8 15C5.79 15 4 13.21 4 11H2C2 14.31 4.69 17 8 17C11.31 17 14 14.31 14 11C14 7.69 11.31 5 8 5V3Z'
              fill='currentColor'
            />
          </svg>
          New Chat
        </button>
      </header>

      <div className='messages-container'>
        {messages.length === 0 ? (
          <div className='empty-state'>
            <p>Start your conversation with the AI</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`message ${
                message.isUser ? 'user-message' : 'ai-message'
              }`}
            >
              <div className='message-avatar'>
                {message.isUser ? 'You' : 'AI'}
              </div>
              <div className='message-content'>{message.text}</div>
            </div>
          ))
        )}
        {isLoading && (
          <div className='message ai-message'>
            <div className='message-avatar'>AI</div>
            <div className='message-content loading'>
              <span className='dot'></span>
              <span className='dot'></span>
              <span className='dot'></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className='input-container'>
        <textarea
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder='Type your message...'
          disabled={isLoading}
          rows={1}
        />
        <button
          className='send-button'
          onClick={sendMessage}
          disabled={inputText.trim() === '' || isLoading}
        >
          <svg
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z'
              fill='currentColor'
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default App;
