import { useState, useEffect } from 'react';
import { getAllEvents, formatEventForDisplay } from '../eventService.js';
import './SchedulePage.css';

const SchedulePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState(0);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      const response = await getAllEvents();

      if (response.success && Array.isArray(response.data)) {
        const formatted = response.data.map(formatEventForDisplay);
        setAllEvents(formatted);
      } else if (response.success) {
        setAllEvents([]);
        setError('No events found');
      } else {
        setAllEvents([]);
        setError('Failed to fetch events: ' + response.error);
      }
      setLoading(false);
    };

    fetchEvents();
    const interval = setInterval(fetchEvents, 60000); // Refresh every 1 min
    return () => clearInterval(interval);
  }, []);

  const formatDuration = (time, duration) => `${time} (${duration})`;

  const highlight = (text, term) => {
    if (!term || !term.trim()) return text;
    const safe = String(text);
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return safe.split(regex).map((part, idx) =>
      regex.test(part) ? <span key={idx} className="highlight">{part}</span> : part
    );
  };

  const clearSearch = () => setSearchQuery('');

  const getDisplayEvents = () => {
    const getStatusOrder = (event) => {
      if (event.status === 'ongoing') return 0;
      if (event.status === 'upcoming') return 1;
      if (event.status === 'completed') return 2;
      return 3;
    };

    let filtered = allEvents.slice();

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(ev =>
        (ev.title || '').toLowerCase().includes(q) ||
        (ev.venue || '').toLowerCase().includes(q) ||
        (ev.category || '').toLowerCase().includes(q)
      );
    }

    if (filterStatus !== 'all') filtered = filtered.filter(ev => ev.status === filterStatus);
    return filtered.sort((a, b) => getStatusOrder(a) - getStatusOrder(b));
  };

  const displayEvents = getDisplayEvents();

  useEffect(() => {
    if (searchQuery.trim()) setSearchResults(displayEvents.length);
    else setSearchResults(0);
  }, [searchQuery, displayEvents.length]);

  const statusColor = (status) => {
    switch (status) {
      case 'ongoing': return "#10b981";
      case 'upcoming': return "#3b82f6";
      case 'completed': return "#6b7280";
      default: return "#6b7280";
    }
  };

  const statusText = (status) => {
    switch (status) {
      case 'ongoing': return "ONGOING";
      case 'upcoming': return "UPCOMING";
      case 'completed': return "COMPLETED";
      default: return "UNKNOWN";
    }
  };

  return (
    <div className="schedule-page">
      <div className="container">
        <div className="header">
          <h1>{searchQuery ? 'Event Search Results' : 'Events Schedule'}</h1>
          <p>Complete schedule of all events</p>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search by title, location, or category..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && <button className="clear-btn" onClick={clearSearch}>✕</button>}
          </div>

          {searchQuery && (
            <div className="search-info">
              {searchResults > 0
                ? `Found ${searchResults} event${searchResults !== 1 ? 's' : ''} matching "${searchQuery}"`
                : `No events found matching "${searchQuery}"`
              }
            </div>
          )}

          <div className="filter-buttons">
            {['all', 'ongoing', 'upcoming', 'completed'].map(s => (
              <button
                key={s}
                className={`filter-btn ${filterStatus === s ? 'active' : ''}`}
                onClick={() => setFilterStatus(s)}
              >
                {s === 'all' ? 'All Events' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="events">
          {loading ? (
            <div className="message">Loading events...</div>
          ) : error ? (
            <div className="message error">
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          ) : displayEvents.length > 0 ? (
            displayEvents.map((event, idx) => (
              <div key={event.id ?? idx} className="event-card">
                <div className="status-badge" style={{ backgroundColor: statusColor(event.status) }}>
                  {statusText(event.status)}
                </div>
                <div className="event-info">
                  <h3>{highlight(event.title || 'Untitled Event', searchQuery)}</h3>
                  <p className="duration">Duration: {highlight(formatDuration(event.time || 'TBD', event.duration || '—'), searchQuery)}</p>
                  <p className="category">Category: {highlight(event.category || 'General', searchQuery)}</p>

                  <div className="event-meta">
                    <div className="meta-item">
                      <span className="meta-label">Location</span>
                      <span className="meta-value">{highlight(event.venue || 'TBD', searchQuery)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="message">
              {searchQuery
                ? <button className="show-all-btn" onClick={clearSearch}>Show All Events</button>
                : "No events are currently scheduled. Check back later!"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
