import React, { useEffect, useRef, useState } from 'react'
import './NotificationsPage.css';

const API_URL = 'http://localhost:3000/api/events/:id/status'; // API endpoint for fetching notifications

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]); // State to hold fetched notifications
  const [loading, setLoading] = useState(true); // State to track loading status

  useEffect(() => {
    let intervalId; // to store the polling interval

    // Function to fetch notifications from backend
    const fetchNotifications = async () => {
      try {
        setLoading(true); // show loading message
        const response = await fetch(API_URL); // call API
        const data = await response.json(); // parse response
        setNotifications(data);  // update state
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false); // hide loading after fetch (success/failure)
      }
    };

    // Fetch once immediately
    fetchNotifications();
    intervalId = setInterval(fetchNotifications, 5000); // // Set up polling every 5 seconds
    return () => clearInterval(intervalId); // Cleanup: clear interval when component unmounts
  }, []); // [] → run only once on mount

  return (
    <div className="notifications-container">
      <h2>Live Notifications</h2>
      {loading ? (
        <p>Loading...</p>
      ) : notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        <ul className="notifications-list">
          {notifications.map((note, idx) => (
            <li key={idx} className="notification-item">
              <span className="notification-time">{note.time}</span>
              <span className="notification-message">{note.message}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NotificationsPage;
