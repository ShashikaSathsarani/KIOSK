//Import React and required hooks
import React, { useEffect, useState } from "react"; //useState: to manage component state
// useEffect: to run side effects(like fetching data) after render

//Import CSS styles for this component
import "./NotificationsPage.css";

//Define the NotificationsPage component
const NotificationsPage = () => {
  //Creates state to store the list of notifications(initially an empty array)
  const [notifications, setNotifications] = useState([]);

  //show a loading state until data arrives
  const [loading, setLoading] = useState(true);

  // Ticker to re-render every second for live countdowns
  const [nowTs, setNowTs] = useState(Date.now());

  //Runs a side effect after the first render
  useEffect(() => {
    //Function to fetch notifications from backend API
    const fetchNotifications = () => {
      fetch("http://localhost:4000/api/notifications") //API endpoint of backend
        .then((res) => res.json())                     //Convert response to JSON
        .then((data) => {
          setNotifications(data); // Save fetched notifications to state
          setLoading(false);      // Turn off loading state
        })
        .catch((err) => console.error(err)); //Log any errors
    };

    //Call the fetch function immediately when the page loads
    fetchNotifications();

    //Starts polling the API every 5 seconds to keep the list updated
    const interval = setInterval(fetchNotifications, 5000);

    //When leave the page, stops the polling to prevent memory leaks
    return () => clearInterval(interval);
  }, []); // Empty dependency array => runs only once on mount

  // Set up a 1-second ticker for live countdown rendering
  useEffect(() => {
    const t = setInterval(() => setNowTs(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // Helper: render remaining time until notification expiry (event start)
  const renderCountdown = (n) => {
    if (!n?.expires_at) return null; // Only show for event-based notifications
    const end = new Date(n.expires_at).getTime();
    if (Number.isNaN(end)) return null;

    const diff = end - nowTs;
    if (diff <= 0) return <small className="countdown">Starting now</small>;

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    const label = minutes > 0
      ? `Starts in ${minutes}m ${String(seconds).padStart(2, "0")}s`
      : `Starts in ${seconds}s`;
    return <small className="countdown">{label}</small>;
  };

  // If still loading, display a simple "Loading..." message
  if (loading) return <div className="notifications-page">Loading...</div>;

  // When data is loaded, render the notifications list
  return (
    <div className="notifications-page">
      <h2>Notifications</h2>
      <ul>
        {/* Map through all notifications and display each one */}
        {notifications.map((n) => (
          <li key={n.id} className={`notification ${n.level}`}>
            {/* Notification header with title and timestamp */}
            <div className="notif-header">
              <h3>{n.title}</h3>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <small>{new Date(n.created_at).toLocaleString()}</small>
                {renderCountdown(n)}
              </div>
            </div>

            {/* Notification body text */}
            <p>{n.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

//Export component for use in other parts of the app
export default NotificationsPage;
