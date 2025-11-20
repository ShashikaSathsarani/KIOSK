import { useState, useEffect, useMemo } from 'react'
// @ts-ignore
import { getAllEvents } from '../utils/eventService'
// @ts-ignore
import { getAllCategories } from '../utils/eventCategoryService'
import './SchedulePage.css'

const SchedulePage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [allEvents, setAllEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchResults, setSearchResults] = useState(0)
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [categories, setCategories] = useState([])

  // NEW: store fetched average ratings per event_id
  const [avgRatings, setAvgRatings] = useState({}) // { [event_id]: avg_rating }
  // NEW: store user's submitted rating in current session (so UI shows selection)
  const [sessionRatings, setSessionRatings] = useState({}) // { [event_id]: number }

  // Fetch events and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const eventsData = await getAllEvents()        // expects events with `.categories` array
        const categoryData = await getAllCategories() // id, category_name, description
        setAllEvents(eventsData)
        setCategories(categoryData)

        // After we get events, fetch average ratings for completed events (non-blocking)
        try {
          const apiUrl = 'http://localhost:3036'
          const completedEvents = (eventsData || []).filter(ev => {
            const now = new Date()
            const end = new Date(ev.end_time)
            return now >= end
          })
          // fetch ratings in parallel
          const promises = completedEvents.map(ev =>
            fetch(`${apiUrl}/api/ratings/${ev.event_id}`).then(r => {
              if (!r.ok) return { event_id: ev.event_id, avg_rating: 0 }
              return r.json().then(data => ({ event_id: ev.event_id, avg_rating: data.avg_rating ?? 0 }))
            }).catch(() => ({ event_id: ev.event_id, avg_rating: 0 }))
          )
          const ratingsArr = await Promise.all(promises)
          const ratingsMap = {}
          ratingsArr.forEach(r => { ratingsMap[r.event_id] = r.avg_rating })
          setAvgRatings(prev => ({ ...prev, ...ratingsMap }))
        } catch (err) {
          console.warn("Failed to fetch ratings for events:", err)
          // non-fatal — we still show events
        }
      } catch (err) {
        setError('Failed to fetch data: ' + err.message)
      } finally {
        setLoading(false)
      }

      
    }

    fetchData()
    const interval = setInterval(fetchData, 60000) // Refresh every 1 min
    return () => clearInterval(interval)
  }, [])

  const getCategoryDescription = (categoryName) => {
    if (!categoryName || categoryName === 'all') return ''
    const cat = categories.find(c => c.category_name === categoryName)
    return cat ? cat.description : ''
  }

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

  //Highlighting matches in the display
  const highlight = (text, term) => {
    if (!term || !term.trim()) return text
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    return String(text).split(regex).map((part, idx) =>
      regex.test(part) ? <span key={idx} className="highlight">{part}</span> : part
    )
  }

  // Derive unique categories from either categories table or events' category arrays
  const getUniqueCategories = () => {
    const catSet = new Set()
    // prefer category API list if available
    if (Array.isArray(categories) && categories.length > 0) {
      categories.forEach(c => { if (c && c.category_name) catSet.add(c.category_name) })
    } else {
      allEvents.forEach(ev => {
        if (Array.isArray(ev.categories)) ev.categories.forEach(c => { if (c) catSet.add(c) })
        else if (ev.category_name) catSet.add(ev.category_name) // fallback
      })
    }
    return Array.from(catSet).sort()
  }

  //when u click X serchQuery becomes empty
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

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(ev =>
        (ev.event_title && ev.event_title.toLowerCase().includes(q)) ||
        (ev.location && ev.location.toLowerCase().includes(q)) ||
        (ev.start_time && String(ev.start_time).toLowerCase().includes(q)) ||
        (ev.end_time && String(ev.end_time).toLowerCase().includes(q))
      )
    }

    // Category filter (works with ev.categories array or fallback ev.category_name)
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(ev => {
        if (Array.isArray(ev.categories)) {
          return ev.categories.includes(selectedCategory)
        }
        return ev.category_name === selectedCategory
      })
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(ev => getEventStatus(ev) === filterStatus)
    }

    // Sort by status
    return filtered.slice().sort((a, b) => getStatusOrder(a) - getStatusOrder(b))
  }

  //filtering recalculated only when needed
  const displayEvents = useMemo(() => getDisplayEvents(), [allEvents, searchQuery, selectedCategory, filterStatus])

  //Compute the numbers
  useEffect(() => {
    if (searchQuery.trim()) setSearchResults(displayEvents.length)
    else setSearchResults(0)
  }, [searchQuery, displayEvents.length])

  const statusColor = (status) => {
    switch (status) {
      case 'ongoing': return "green"
      case 'upcoming': return "red"
      case 'completed': return "gray"
      default: return "gray"
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

  // NEW: submit numeric rating (1-5)
  const handleRating = async (eventId, rating) => {
    try {
      if (!eventId) return
      const numeric = Number(rating)
      if (Number.isNaN(numeric) || numeric < 1 || numeric > 5) {
        alert("Please select a rating between 1 and 5")
        return
      }
      const apiUrl = 'http://localhost:3036'
      const res = await fetch(`${apiUrl}/api/ratings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event_id: eventId, rating: numeric })
      })
      if (!res.ok) {
        const err = await res.json().catch(()=>null)
        throw new Error(err?.error || "Failed to submit rating")
      }
      // update session rating so UI reflects user's click
      setSessionRatings(prev => ({ ...prev, [eventId]: numeric }))
      // refresh avg rating for that event
      try {
        const r = await fetch(`${apiUrl}/api/ratings/${eventId}`)
        if (r.ok) {
          const data = await r.json()
          setAvgRatings(prev => ({ ...prev, [eventId]: data.avg_rating ?? 0 }))
        }
      } catch (e) {
        // ignore — non-critical
      }
      alert("Thanks for rating!")
    } catch (err) {
      console.error(err)
      alert("Failed to submit rating")
    }
  }

  return (
    <div className="schedule-page">
      <div className="container">
        <div className="header">
          <h1>{searchQuery ? 'Event Search Results' : 'Events Schedule'}</h1>
          <p>Complete schedule of all events</p>

          <div className="search-and-filter">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by title or location ..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && <button className="clear-btn" onClick={clearSearch}>✕</button>}
            </div>

            <div className="category-filter">
              <label>Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All</option>
                {getUniqueCategories().map((cat, index) => (
                  <option key={index} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/*Shows found X events or No found events*/}
          {searchQuery && (
            <div className="search-info">
              {searchResults > 0
                ? `Found ${searchResults} event${searchResults !== 1 ? 's' : ''} matching "${searchQuery}"`
                : `No events found matching "${searchQuery}"`}
            </div>
          )}

          {/* Status Filter Buttons */}
          <div className="filter-buttons">
            {['all', 'ongoing', 'upcoming', 'completed'].map(s => (
              <button
                key={s}
                className={filterStatus === s ? 'active' : ''}
                onClick={() => setFilterStatus(s)}
                aria-pressed={filterStatus === s}  //tells whether a button is currently "pressed"
              >
                {s === 'all' ? 'All Events' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          {/* Left-aligned descriptions (below the filter buttons) */}
          <div className="descriptions-row">
            {selectedCategory !== 'all' && (
              <div className="category-description left">
                <strong>{selectedCategory}</strong>
                <div className="desc-text">{getCategoryDescription(selectedCategory) || 'No description available'}</div>
              </div>
            )}

            {filterStatus !== 'all' && (
              <div className="status-description left">
                <strong>{filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}</strong>
                <div className="desc-text">
                  {{
                    ongoing: 'Events currently in progress.',
                    upcoming: 'Events scheduled to start in the future.',
                    completed: 'Events that have ended.'
                  }[filterStatus] || ''}
                </div>
              </div>
            )}
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
              const cats = Array.isArray(event.categories) ? event.categories.join(', ') : (event.category_name || 'N/A')
              return (
                <div key={event.event_id || idx} className="event-card">
                  <div className="status-badge" style={{ backgroundColor: statusColor(status) }}>
                    {statusText(status)}
                  </div>
                  <div className="event-info">
                    <h3>{highlight(event.event_title, searchQuery)}</h3>
                    <p>Category: {highlight(cats, searchQuery)}</p>
                    <p>Duration: {highlight(formatDuration(event.start_time, event.end_time), searchQuery)}</p>

                    <div className="event-meta">
                      <div>
                        <span>Location</span>
                        <span>{highlight(event.location, searchQuery)}</span>
                      </div>
                      <div>
                        <span>Start Time</span>
                        <span>{highlight(formatTime(event.start_time), searchQuery)}</span>
                      </div>
                    </div>

                    {/* NEW: show rating UI for completed events only, preserving everything else */}
                    {status === 'completed' && (
                      <div className="rating-section">
                        <div className="category-tag">Rate this event : </div>
                        <div className="rating-inputs">
                          {[1,2,3,4,5].map(n => (
                            <button
                              key={n}
                              onClick={() => handleRating(event.event_id, n)}
                              className={sessionRatings[event.event_id] === n ? 'active-rating' : ''}
                              aria-label={`Rate ${n} for ${event.event_title}`}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              )
            })
          ) : (
            <div className="message">
              {searchQuery
                ? <button onClick={clearSearch}>Show All Events</button>
                : "No events are currently scheduled. Check back later!"}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SchedulePage
