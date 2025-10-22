import { useState, useEffect } from 'react'
import { getAllEvents, getEventsWithinHour, formatEventForDisplay } from '../eventService.js'
import './SchedulePage.css'

const SchedulePage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [allEvents, setAllEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchResults, setSearchResults] = useState(0)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      setError(null)

      const response = await getAllEvents()

      if (response.success && Array.isArray(response.data) && response.data.length > 0) {
        setAllEvents(response.data)
      } else if (response.success && Array.isArray(response.data) && response.data.length === 0) {
        setError('No events found')
      } else {
        setError('Failed to fetch events: ' + response.error)
      }

      setLoading(false)
    }

    fetchEvents()
    const interval = setInterval(fetchEvents, 60000)
    return () => clearInterval(interval)
  }, [])

  const getEventStatus = (event) => {
    const now = new Date()
    const start = new Date(event.start_time)
    const end = new Date(event.end_time)
    if (now >= end) return 'completed'
    if (now >= start && now < end) return 'ongoing'
    return 'upcoming'
  }

  const formatTime = (dateTimeString) =>
    new Date(dateTimeString).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })

  const formatDuration = (start, end) => `${formatTime(start)} - ${formatTime(end)}`

  const highlight = (text, term) => {
    if (!term.trim()) return text
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    return text.split(regex).map((part, idx) =>
      regex.test(part) ? <span key={idx} className="highlight">{part}</span> : part
    )
  }

  const clearSearch = () => setSearchQuery('')

  const getDisplayEvents = () => {
    const getStatusOrder = (event) => {
      const status = getEventStatus(event)
      if (status === 'ongoing') return 0
      if (status === 'upcoming') return 1
      if (status === 'completed') return 2
      return 3
    }

    let filtered = allEvents

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(ev =>
        (ev.event_title || '').toLowerCase().includes(q) ||
        (ev.location || '').toLowerCase().includes(q) ||
        (ev.description || '').toLowerCase().includes(q) ||
        (ev.start_time || '').toLowerCase().includes(q) ||
        (ev.end_time || '').toLowerCase().includes(q)
      )
    }

    if (filterStatus !== 'all') filtered = filtered.filter(ev => getEventStatus(ev) === filterStatus)
    return filtered.slice().sort((a, b) => getStatusOrder(a) - getStatusOrder(b))
  }

  const displayEvents = getDisplayEvents()

  useEffect(() => {
    if (searchQuery.trim()) setSearchResults(displayEvents.length)
  }, [searchQuery, displayEvents.length])

  const statusColor = (status) => {
    switch (status) {
      case 'ongoing': return "#22c55e"  // Bright green
      case 'upcoming': return "#dc2626"  // Red
      case 'completed': return "#6b7280" // Gray
      default: return "#6b7280"
    }
  }

  const statusText = (status) => {
    switch (status) {
      case 'ongoing': return "ONGOING"
      case 'upcoming': return "UPCOMING"
      case 'completed': return "COMPLETED"
      default: return "UNKNOWN"
    }
  }

  return (
    <div className="schedule-page">
      <div className="container">
        <div className="header">
          <h1>{searchQuery ? 'Event Search Results' : 'Events Schedule'}</h1>
          <p>Complete schedule of all events</p>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search by title, location, or time..."
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
            displayEvents.map((event, idx) => {
              const status = getEventStatus(event)
              return (
                <div key={event.event_id || idx} className="event-card">
                  <div className="status-badge" style={{ backgroundColor: statusColor(status) }}>
                    {statusText(status)}
                  </div>
                  <div className="event-info">
                    <h3>{highlight(event.event_title || event.title, searchQuery)}</h3>
                    {event.description && (
                      <p className="event-description">
                        {highlight(event.description, searchQuery)}
                      </p>
                    )}
                    <p className="duration">Duration: {highlight(formatDuration(event.start_time, event.end_time), searchQuery)}</p>

                    <div className="event-meta">
                      <div className="meta-item">
                        <span className="meta-label">Location</span>
                        <span className="meta-value">{highlight(event.location || event.venue, searchQuery)}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Start Time</span>
                        <span className="meta-value">{highlight(formatTime(event.start_time), searchQuery)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
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
  )
}

export default SchedulePage
