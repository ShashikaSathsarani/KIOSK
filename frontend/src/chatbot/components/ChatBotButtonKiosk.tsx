import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot } from 'lucide-react';

const ChatBotButtonKiosk: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/chatbot');
  };

  return (
    <button
      onClick={handleClick}
      className="chatbot-button-kiosk"
      title="Open AI ChatBot"
      aria-label="Open AI ChatBot"
    >
      <Bot size={24} />
    </button>
  );
};

export default ChatBotButtonKiosk;
