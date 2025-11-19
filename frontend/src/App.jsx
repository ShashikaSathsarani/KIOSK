import React, { useState, useEffect, useRef, useCallback } from 'react'
import HomePage from './components/HomePage'
import AboutPage from './components/AboutPage'
import SchedulePage from './components/SchedulePage'
import NotificationsPage from './components/NotificationsPage'
import MapPage from './components/MapPage'
import HeatMapPage from './components/HeatMapPage'
import IntroVideo from './components/IntroVideo'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import ExhibitsPage from './components/ExhibitsPage'
import FeedbackPopup from './components/FeedbackPopup'
import ChatBotPage from './chatbot/ChatBotPage'
import AdminNotificationsForm from './components/AdminNotificationsForm'
import { Bot } from 'lucide-react'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState(0)
  const [showIntroVideo, setShowIntroVideo] = useState(true)
  const [isAdminMode, setIsAdminMode] = useState(false)
  const inactivityTimerRef = useRef(null)
  const pages = [HomePage, AboutPage, SchedulePage, ExhibitsPage, NotificationsPage, MapPage, HeatMapPage, ChatBotPage]

  // Check for admin mode on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('admin') === 'true') {
      setIsAdminMode(true)
      setShowIntroVideo(false)
    }
  }, [])

  // Handle user activity to reset inactivity timer
  const handleUserActivity = useCallback(() => {
    // Clear existing timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
    }

    // Set new timer for 20 seconds
    if (!showIntroVideo) {
      inactivityTimerRef.current = setTimeout(() => {
        setShowIntroVideo(true)
        setCurrentPage(0) // Reset to home page
      }, 60000) // 60 seconds
    }
  }, [showIntroVideo])

  // Handle intro video click
  const handleIntroVideoClick = () => {
    setShowIntroVideo(false)
    setCurrentPage(0) // Start with home page
    handleUserActivity() // Start inactivity timer
  }

  // Handle page navigation
  const handlePageClick = (pageIndex) => {
    setCurrentPage(pageIndex)
    handleUserActivity() // Reset inactivity timer
  }

  // Set up global activity listeners
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']

    const addEventListeners = () => {
      events.forEach(event => {
        document.addEventListener(event, handleUserActivity, true)
      })
    }

    const removeEventListeners = () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity, true)
      })
    }

    if (!showIntroVideo) {
      addEventListeners()
      handleUserActivity() // Start the timer immediately
    } else {
      removeEventListeners()
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current)
      }
    }

    return () => {
      removeEventListeners()
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current)
      }
    }
  }, [showIntroVideo, handleUserActivity])

  const CurrentComponent = pages[currentPage]
  // Contact info component (kept inside App to access currentPage)
  const ContactInfo = ({ currentPage }) => {
    // Hide on home page (0) and ChatBot page (7)
    if (currentPage === 0 || currentPage === 7) return null

    return (
      <div className="contact-container">
        <div className="contact-marquee">
          <span className="contact-item">• University Security: +94 81 239 4914</span>
          <span className="contact-item">• University Medical Center: +94 81 239 2361</span>
          <span className="contact-item">• Event Coordinator: +94 81 239 3000</span>
          <span className="contact-item">• Technical Support: +94 81 239 3001</span>
        </div>
      </div>
    )
  }

  // Show intro video if showIntroVideo is true
  if (showIntroVideo) {
    return <IntroVideo onVideoClick={handleIntroVideoClick} />
  }

  // Show admin panel if in admin mode
  if (isAdminMode) {
    return (
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>KIOSK Admin Panel</h1>
          <button
            onClick={() => {
              setIsAdminMode(false)
              window.history.pushState({}, '', '/')
            }}
            style={{ padding: '10px 20px', cursor: 'pointer' }}
          >
            Exit Admin Mode
          </button>
        </div>
        <AdminNotificationsForm />
      </div>
    )
  }

  return (
    <div className="app">
      {/* ===== NAVIGATION COMPONENT ===== */}
      <Navigation
        currentPage={currentPage}
        onPageClick={handlePageClick}
        pages={pages}
      />

      {/* ===== MAIN CONTENT AREA ===== */}
      <div className="content-wrapper">
        <div className="page-container">
          <CurrentComponent />
        </div>

        {/* Scrolling Contact Info - only show if NOT home page */}
        <ContactInfo currentPage={currentPage} />

        {/* Feedback button + popup - hide on ChatBot page */}
        <FeedbackPopup currentPage={currentPage} />

        {/* ===== FOOTER COMPONENT ===== */}
        <Footer />
      </div>

      {/* Floating ChatBot Button - Fixed position like Rate Us button */}
      {currentPage !== 7 && (
        <button
          onClick={() => handlePageClick(7)}
          className="chatbot-button-modern"
          aria-label="Open AI ChatBot"
        >
          <Bot size={28} />
          <span className="chatbot-button-tooltip">Chat with EngExAI</span>
        </button>
      )}
    </div>
  )
}

export default App
