// ChatBot Route Configuration
// Add this to your main routing file (e.g., App.jsx or main router)

import ChatBotPage from './pages/kiosk/ChatBotPage';

// Add this route to your Routes component:
/*
<Route path="/chatbot" element={<ChatBotPage />} />
*/

// Example full routing setup:
/*
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatBotPage from './pages/kiosk/ChatBotPage';
// ... other imports

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chatbot" element={<ChatBotPage />} />
        // ... other routes
      </Routes>
    </Router>
  );
}
*/

// If you want to add the floating ChatBot button to specific pages:
/*
import ChatBotButtonKiosk from './pages/kiosk/components/ChatBotButtonKiosk';

// In your component JSX:
function YourPage() {
  return (
    <div>
      // Your page content
      <ChatBotButtonKiosk />
    </div>
  );
}
*/

// CSS for the ChatBot floating button (add to your global CSS or component CSS):
/*
.chatbot-button-kiosk {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.chatbot-button-kiosk:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.chatbot-button-kiosk:active {
  transform: translateY(-2px);
}
*/
