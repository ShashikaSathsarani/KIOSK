import React, { useState } from "react";
import "./FeedbackPopup.css";

const FeedbackPopup = ({ showOnPages = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Don't render the button if showOnPages is false
  if (!showOnPages) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5020/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, message }),
      });
      if (!response.ok) throw new Error('Server error');

      // Trigger hide animation for form, then show success box after animation
      setSubmitted(true);
      // Wait for the form to animate out (matches CSS .popup-content.hide transition 250ms)
      setTimeout(() => setShowSuccess(true), 260);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("There was an error submitting your feedback. Please try again.");
    }
  };

  const handleStarHover = (num) => {
    setHoverRating(num);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleStarClick = (num) => {
    setRating(num);
  };

  const handleClose = () => {
    setIsOpen(false);
    setHoverRating(0);
  };

  const handleSuccessClose = () => {
    // Hide success, reset and close popup
    setShowSuccess(false);
    setSubmitted(false);
    setIsOpen(false);
    setHoverRating(0);
    setRating(0);
    setMessage("");
  };

  return (
    <div>
      <button className="feedback-btn" onClick={() => setIsOpen(true)}>
        ⭐ Rate Us
      </button>

      {isOpen && (
  <div className="popup-overlay" onClick={() => { if (!showSuccess) handleClose(); }}>
          {/* Feedback form: render only when not submitted */}
          {!submitted && (
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h2>Rate the Kiosk</h2>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((num) => (
                <span
                  key={num}
                  className={
                    num <= (hoverRating || rating) ? "star selected" : "star"
                  }
                  onMouseEnter={() => handleStarHover(num)}
                  onMouseLeave={handleStarLeave}
                  onClick={() => handleStarClick(num)}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              placeholder="Give us your feedback"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="popup-buttons">
              <button onClick={handleSubmit}>Submit</button>
              <button onClick={handleClose}>Close</button>
            </div>
            </div>
          )}

          {/* Separate success box that appears when submitted */}
          <div
            className={`success-box ${showSuccess ? "show" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="success-close" onClick={handleSuccessClose} aria-label="Close">×</button>
            <div className="success-icon">✓</div>
            <h3>Thank you for your feedback!</h3>
            <p>Your response helps us improve the kiosk experience.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackPopup;