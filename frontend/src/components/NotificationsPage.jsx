import React, { useEffect, useState } from "react";
import "./NotificationsPage.css";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to fetch notifications
    const fetchNotifications = () => {
      fetch("http://localhost:4000/api/notifications")
        .then((res) => res.json())
        .then((data) => {
          setNotifications(data);
          setLoading(false);
        })
        .catch((err) => console.error(err));
    };

    // Initial fetch
    fetchNotifications();

    // Set interval to fetch every 5 seconds
    const interval = setInterval(fetchNotifications, 5000);

    // Clear interval on unmount
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="notifications-page">Loading...</div>;

  return (
    <div className="notifications-page">
      <h2>Notifications</h2>
      <ul>
        {notifications.map((n) => (
          <li key={n.id} className={`notification ${n.level}`}>
            <div className="notif-header">
              <h3>{n.title}</h3>
              <small>{new Date(n.created_at).toLocaleString()}</small>
            </div>
            <p>{n.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsPage;
