/*useState - to store changing values (like messages and input)
useRef - to reference DOM elements (like for scrolling)
useEffect - to run code automatically when something changes*/
import { useState, useRef, useEffect } from 'react'

//Imports icons from the lucide-react library - These are SVG icons used for buttons and avatars
import { Send, Bot, User, Sparkles, HelpCircle, MapPin, Calendar, Building } from 'lucide-react'

//Imports our custom Gemini AI service that handles getting AI responses
import { geminiService } from './utils/geminiService'

//mports your CSS styling file for animations, colors
import './ChatBot.css'

//Imports an image of the campus map so it can be displayed in chat
import mapImage from './ChatbotAssets/map.jpg'

//Starts the ChatBotPage component - a React function that displays the chatbot
const ChatBotPage = () => {

  //Creates a state variable called messages that stores all chat messages
  //It starts with one message - the bot's welcome message
  const [messages, setMessages] = useState([
    {

      /*Checks if Gemini API key exists
      If yes - shows "I'm Gemini, your AI assistant..."
      If no - shows a simpler message */
      id: '1',
      text: 'Hello! 👋 Welcome to EngEx! I\'m your AI assistant for this amazing engineering exhibition. I\'m here to help you navigate the campus, find events, and discover all the incredible projects on display. What would you like to explore first?',
      sender: 'bot',
      timestamp: new Date() //Marks the sender as bot and adds current time
    }
  ])

  //Stores what the user is typing in the chat box
  const [inputText, setInputText] = useState('')

  //Tells whether the bot is currently typing (to show the typing dots)
  const [isTyping, setIsTyping] = useState(false)

  //A reference to the bottom of the chat window, used for auto-scrolling
  const messagesEndRef = useRef(null)

  // Predefined quick questions
  // Updated icons and categories for clearer intent and downstream handling
  const quickQuestions = [
    { icon: HelpCircle, text: 'When did the faculty start?', category: 'about' },
    { icon: Calendar, text: 'What events are happening Day 1?', category: 'events' },
    { icon: Building, text: 'What are the departments?', category: 'departments' },
    { icon: MapPin, text: 'Where is the canteen?', category: 'facilities' }
  ]

  /*Sends user's question to the Gemini AI
  Waits for a reply using await
  If there's an error, logs it and returns a friendly apology */
  const getBotResponse = async (userMessage) => {
    try {
      return await geminiService.generateResponse(userMessage)
    } catch (error) {
      console.error('Error getting bot response:', error)
      return 'I apologize, but I\'m having trouble processing your request right now. Please try again or contact our event coordinators at +94 81 239 3000 for assistance.'
    }
  }

  //Scrolls the chat to the very bottom smoothly- Uses the reference (messagesEndRef) created earlier
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  //Every time the messages list changes (new message added), this function runs
  //It calls scrollToBottom() to keep the latest chat visible
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  //If input is empty - stop
  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    //Creates a new message object for the user
    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    }

    /*Adds the user's message to the chat
    Clears the input field
    Turns on typing animation (isTyping = true) */
    const currentInput = inputText
    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)

    try {
      // Gets the bot's reply from Gemini AI
      const responseText = await getBotResponse(currentInput)
      
      // Check if the response should include the faculty map
      //If yes, we'll display the map image
      const shouldShowMap = currentInput.toLowerCase().includes('map') || 
                           currentInput.toLowerCase().includes('show') && currentInput.toLowerCase().includes('campus') ||
                           currentInput.toLowerCase().includes('where is')
      
      
      //Creates the bot's reply message
      //Includes the map image if needed
      const botResponse = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date(),
        imageUrl: shouldShowMap ? mapImage : undefined
      }

      //Adds bot's reply to the chat
      setMessages(prev => [...prev, botResponse])

      //If something goes wrong, shows an apology. Finally, stops typing dots
    } catch (error) {
      console.error('Error sending message:', error)
      const errorResponse = {
        id: (Date.now() + 1).toString(),
        text: 'I apologize, but I\'m having trouble processing your request right now. Please try again or contact our event coordinators for assistance.',
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsTyping(false)
    }
  }

  //Fills input with the question text
  //Sends it automatically after 0.1 second
  const handleQuickQuestion = (questionText) => {
    setInputText(questionText)
    setTimeout(() => handleSendMessage(), 100)
  }

  //If we press Enter (without Shift), it sends the message
  //Shift + Enter = new line
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }


  /*________________________________________________________________________________________________________
  Everything below is HTML-like JSX that builds the chatbot window
  */
  return (
    <div className="chatbot-container">
      {/* Header */}

      {/* Top bar with bot icon and name*/}
      {/*Shows Gemini API status (green = active, yellow = basic mode)*/}
      <div className="chatbot-header">
        <div className="chatbot-header-content">
          <div className="chatbot-icon-container">
            <Sparkles className="chatbot-icon" />
          </div>
          <div>
            <h1 className="chatbot-title">SmartTalk EngEx AI Assistant</h1>
            <p className="chatbot-subtitle">Ask me anything about the exhibition</p>
          </div>
        </div>
        
        {/* API Status Indicator */}
        <div className="chatbot-status">
          <div className={`chatbot-status-indicator ${geminiService.isApiKeyConfigured() ? 'active' : 'basic'}`}></div>
          <span className="chatbot-status-text">
            {geminiService.isApiKeyConfigured() ? 'AI Active' : 'Basic Mode'}
          </span>
        </div>
      </div>

      {/* Quick Questions
      Shown only at the beginning (when you haven't chatted yet)
      Displays clickable buttons for common questions
      */}
      {messages.length <= 1 && (
        <div className="quick-questions-container">
          <h3 className="quick-questions-title">Quick Questions</h3>
          <div className="quick-questions-grid">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question.text)}
                className="quick-question-btn"
              >
                <div className="quick-question-content">
                  <div className="quick-question-icon-wrapper">
                    <question.icon className="quick-question-icon" />
                  </div>
                  <span className="quick-question-text">{question.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages
      Main chat area

      Loops through messages:
            If sender = "bot", message appears on left
            If sender = "user", message appears on right
            Shows message text, optional image, and time
      */}
      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message-wrapper ${message.sender === 'user' ? 'user' : 'bot'}`}
          >
            {message.sender === 'bot' && (
              <div className="message-avatar bot">
                <Bot className="message-avatar-icon" />
              </div>
            )}
            
            <div className={`message-bubble ${message.sender === 'user' ? 'user' : 'bot'}`}>
              <p className="message-text">{message.text}</p>
              
              {/* Display map image if included in the message */}
              {message.imageUrl && (
                <div className="message-image-container">
                  <img 
                    src={message.imageUrl} 
                    alt="Campus Map" 
                    className="message-image"
                  />
                  <div className="message-image-caption">
                    <p className="message-image-caption-text">
                      🗺️ Faculty of Engineering Campus Map 
                    </p>
                  </div>
                </div>
              )}
              
              <span className="message-timestamp">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {message.sender === 'user' && (
              <div className="message-avatar user">
                <User className="message-avatar-icon" />
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator
        Shows bot's typing animation when waiting for AI reply
        Uses three dots with animation-delay classes
        */}
        {isTyping && (
          <div className="typing-indicator-wrapper">
            <div className="message-avatar bot">
              <Bot className="message-avatar-icon" />
            </div>
            <div className="typing-indicator-bubble">
              <div className="typing-dots">
                <div className="typing-dot"></div>
                <div className="typing-dot animation-delay-200"></div>
                <div className="typing-dot animation-delay-400"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area
      Textbox for typing messages
      Send button beside it
      Disabled if empty or bot is typing
      Below it: small text "Press Enter to send • Shift + Enter for new line"
      */}
      <div className="input-container">
        <div className="input-wrapper">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about events, directions, facilities..."
            className="input-textarea"
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="input-send-btn"
            title="Send message"
            aria-label="Send message"
          >
            <Send className="input-send-icon" />
          </button>
        </div>
        <p className="input-hint">
          Press Enter to send • Shift + Enter for new line
        </p>
      </div>
    </div>
  )
}

{/*Exports this component so you can use <ChatBotPage /> elsewhere*/}
export default ChatBotPage
