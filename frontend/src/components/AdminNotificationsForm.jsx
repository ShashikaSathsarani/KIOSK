import React, { useState } from 'react';
import './AdminNotificationsForm.css';

const AdminNotificationsForm = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [level, setLevel] = useState('info');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { title, body, level, data: {} };
        const res = await fetch('http://localhost:4000/api/notifications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const result = await res.json();
        if (res.ok) {
            alert('Notification created successfully!');
            setTitle('');
            setBody('');
            setLevel('info');
        } else {
            alert('Error: ' + result.error);
        }
    };

    return (
        <div className="admin-container">
            <h2 className="admin-title">Create Admin Notification</h2>
            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-group">
                    <label className="form-label">Title *</label>
                    <input type="text" className="form-input" placeholder="Enter notification title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label className="form-label">Body Message *</label>
                    <textarea className="form-textarea" placeholder="Enter notification body message" value={body} onChange={(e) => setBody(e.target.value)} required rows={5}></textarea>
                </div>
                <div className="form-group">
                    <label className="form-label">Notification Level</label>
                    <select className="form-select" value={level} onChange={(e) => setLevel(e.target.value)}>
                        <option value="info">ℹ️ Info</option>
                        <option value="warning">⚠️ Warning</option>
                        <option value="error">❌ Error</option>
                    </select>
                </div>
                <button type="submit" className="submit-button">Create Notification</button>
            </form>
        </div>
    );
};

export default AdminNotificationsForm;