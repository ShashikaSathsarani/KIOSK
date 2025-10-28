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
              <small>{new Date(n.created_at).toLocaleString()}</small>
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
