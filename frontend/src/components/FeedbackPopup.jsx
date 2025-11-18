import React, { useState } from "react";
import "./FeedbackPopup.css";

// User selects 1-5 stars and may add a text message.
// If user clicks Submit without selecting a star, a small message asks them to pick one.
// After successful submit it will show a thank-you box.

const FeedbackPopup = ({ showOnPages = true, currentPage }) => {
  // Open/close popup
  const [open, setOpen] = useState(false);

  // Numeric rating (0 means not selected yet)
  const [rating, setRating] = useState(0);

  // Star we're hovering over (for hover effect)
  const [hover, setHover] = useState(0);

  // Optional text message from user
  const [message, setMessage] = useState("");

  // When true we hide the form and show the thank-you box
  const [submitted, setSubmitted] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  // Show a small prompt when user tries to submit without picking a star
  const [showConfirm, setShowConfirm] = useState(false);

  // Hide on ChatBot page (index 7) or if parent asked not to show
  if (!showOnPages || currentPage === 7) return null;

  // Send feedback to backend. Kept simple and separated so it's easy to read.
  const submitFeedback = async () => {
    try {
      const res = await fetch("http://localhost:5020/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, message }),
      });
      if (!res.ok) throw new Error("Server error");

      // Show success animation: hide form then show success box
      setSubmitted(true);
      setTimeout(() => setSuccessVisible(true), 260); // matches CSS timing
    } catch (err) {
      console.error("Submit error:", err);
      // Keep message simple for kiosk users
      alert("There was an error submitting your feedback. Please try again.");
    }
  };

  // Called when user presses the Submit button in the form
  const onSubmit = (e) => {
    e.preventDefault();
    // If user didn't pick a rating, show the small prompt and do not submit
    if (rating === 0) {
      setShowConfirm(true);
      return;
    }
    // Otherwise send the feedback
    void submitFeedback();
  };

  // Close the small 'please pick a rating' prompt
  const closeConfirm = () => setShowConfirm(false);

  // Star interaction helpers (names kept simple)
  const onStarEnter = (n) => setHover(n);
  const onStarLeave = () => setHover(0);
  const onStarClick = (n) => setRating(n);

  // Close popup (used for Close button and overlay click)
  const closePopup = () => {
    setOpen(false);
    setHover(0);
  };

  // After seeing success, user can close the success box => reset form
  const closeSuccess = () => {
    setSuccessVisible(false);
    setSubmitted(false);
    setOpen(false);
    setHover(0);
    setRating(0);
    setMessage("");
  };

  return (
    <div>
      {/* Main floating button */}
      <button className="feedback-btn" onClick={() => setOpen(true)}>
        ⭐ Rate Us
      </button>

      {/* Popup overlay + content */}
      {open && (
        <div className="popup-overlay" onClick={() => { if (!successVisible) closePopup(); }}>
          {/* Form area (hidden after submit) */}
          {!submitted && (
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
              <h2>Rate the Kiosk</h2>

              {/* Stars row */}
              <div className="stars">
                {[1,2,3,4,5].map((n) => (
                  <span
                    key={n}
                    className={n <= (hover || rating) ? "star selected" : "star"}
                    onMouseEnter={() => onStarEnter(n)}
                    onMouseLeave={onStarLeave}
                    onClick={() => onStarClick(n)}
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* Free-text box */}
              <textarea
                placeholder="Give us your feedback"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              {/* Submit / Close buttons */}
              <div className="popup-buttons">
                <button onClick={onSubmit}>Submit</button>
                <button onClick={closePopup}>Close</button>
              </div>
            </div>
          )}

          {/* Small prompt shown when user tries to submit without picking a star */}
          {showConfirm && (
            <div className="confirm-overlay" onClick={(e) => e.stopPropagation()}>
              <div className="confirm-box">
                <button className="confirm-close" onClick={closeConfirm} aria-label="Close">×</button>
                <h4>No rating selected</h4>
                <p className="confirm-desc">Please select a star rating before you submit. Tap a star to choose one.</p>
              </div>
            </div>
          )}

          {/* Thank-you box (appears after submit) */}
          <div
            className={`success-box ${successVisible ? "show" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="success-close" onClick={closeSuccess} aria-label="Close">×</button>
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