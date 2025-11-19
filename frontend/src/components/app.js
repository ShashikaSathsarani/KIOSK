import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NotificationsPage from "./NotificationsPage";
import AdminNotificationsForm from "./AdminNotificationsForm";

function App() {
  return (
    <Router>
      <Routes>
        {/* User notifications page */}
        <Route path="/" element={<NotificationsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />

        {/* Admin panel - create notifications */}
        <Route path="/admin/notifications" element={<AdminNotificationsForm />} />
      </Routes>
    </Router>
  );
}

export default App;
