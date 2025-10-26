import React, { useState, useEffect, useRef } from 'react'
import './ExhibitsPage.css'

// Predefined tags - moved outside component to avoid re-renders
const PREDEFINED_TAGS = [
    'Electronics and Embedded Systems',
    'Artificial Intelligence Machine Learning and Data Science',
    'Biomedical Engineering and Mechatronics',
    'Information Technology and Computing',
    'Science, Entertainment and Mathematics of Engineering',
    'Materials and Nanotechnology',
    'Energy Environment and Sustainability & Nature Based Technologies',
    'Road Safety, Transportation Planning and Engineering Survey',
    'Pilot Plant',
    'Renewable energy and sustainability',
    'Automobile',
    'Additive Manufacturing and 3D Printing',
    'Computer Numerical Control (CNC)',
    'Robotics and Automation',
    'Power Systems and Smart Grids'
]

const ExhibitsPage = () => {
  // State management
  const [allExhibits, setAllExhibits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedTag, setSelectedTag] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Color mapping for different tag categories
  const getTagColor = (tag) => {
    const colors = {
      'Electronics and Embedded Systems': { bg: '#001aff', text: '#FFFFFF', border: '#001affff' },
      'Artificial Intelligence Machine Learning and Data Science': { bg: '#098bee', text: '#FFFFFF', border: '#098beeff' },
      'Biomedical Engineering and Mechatronics': { bg: '#eea933', text: '#FFFFFF', border: '#eea933' },
      'Information Technology and Computing': { bg: '#a5a74d', text: '#FFFFFF', border: '#a5a74d' },
      'Science, Entertainment and Mathematics of Engineering': { bg: '#EC4899', text: '#FFFFFF', border: '#EC4899' },
      'Materials and Nanotechnology': { bg: '#8b9894', text: '#FFFFFF', border: '#8b9894' },
      'Energy Environment and Sustainability & Nature Based Technologies': { bg: '#06B6D4', text: '#FFFFFF', border: '#06B6D4' },
      'Road Safety, Transportation Planning and Engineering Survey': { bg: '#9658b6', text: '#FFFFFF', border: '#9658b6ff' },
      'Pilot Plant': { bg: '#c57b70', text: '#FFFFFF', border: '#c57b70' },
      'Renewable energy and sustainability': { bg: '#37795d', text: '#FFFFFF', border: '#37795d' },
      'Automobile': { bg: '#02102b', text: '#FFFFFF', border: '#02102b' },
      'Additive Manufacturing and 3D Printing': { bg: '#4d2040', text: '#FFFFFF', border: '#4d2040' },
      'Computer Numerical Control (CNC)': { bg: '#585c19', text: '#FFFFFF', border: '#585c19' },
      'Robotics and Automation': { bg: '#6a3c3f', text: '#FFFFFF', border: '#6a3c3f' },
      'Power Systems and Smart Grids': { bg: '#323073', text: '#FFFFFF', border: '#323073' }
    }
    return colors[tag] || { bg: '#6B7280', text: '#FFFFFF', border: '#9CA3AF' }
  }

  // Fetch exhibits from the exhibits service once on mount.
  // We always fetch the full list and perform tag filtering client-side
  // so exhibits that contain multiple tags will be shown when any
  // selected tag matches one of their tags.
  useEffect(() => {
    const EXHIBITS_API_BASE = import.meta.env.VITE_EXHIBITS_API || 'http://localhost:5020/exhibits'

    const fetchExhibits = async () => {
      try {
        setLoading(true)
        setError(null)

        // Always fetch the full exhibits list from the base endpoint.
        const url = EXHIBITS_API_BASE

        const response = await fetch(url)
        if (!response.ok) {
          if (response.status === 404) {
            console.log(`No exhibits found for tag or endpoint: ${url}`)
            setAllExhibits([])
            return
          }
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        // The tag route might return a single object while the root returns an array.
        const rows = Array.isArray(data) ? data : (data ? [data] : [])

        const mapped = rows.map((e, idx) => {
          const tags = Array.isArray(e.tags)
            ? e.tags
            : (typeof e.tags === 'string' ? e.tags.split(',').map(t => t.trim()).filter(Boolean) : ['Other'])

          return {
            exhibit_id: e.exhibit_ID ?? e.exhibit_id ?? String(e.id ?? idx),
            exhibit_name: e.exhibit_name ?? e.name ?? `Exhibit ${idx}`,
            building_name: e.building_name ?? e.building ?? 'Unknown',
            location: e.location ?? 'Unknown',
            zone_name: e.zone_name ?? 'Unknown',
            tag: tags[0] ?? 'Other',
            tags
          }
        })

        setAllExhibits(mapped)
      } catch (err) {
        console.error('Error fetching exhibits (exhibits service):', err)
        setError(err.message || 'Failed to fetch exhibits from exhibits service')
      } finally {
        setLoading(false)
      }
    }

    fetchExhibits()
  }, [selectedTag])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const target = event.target
      if (!target.closest || !target.closest('.dropdown-container')) {
        setIsDropdownOpen(false)
      } else {
        if (!target.closest('.dropdown-container')) setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isDropdownOpen])

  // Filter function based on selected tag and search query
  const getDisplayExhibits = () => {
    let filtered = allExhibits
    // Normalization helper to make tag matching robust
    const normalize = (s) => (s || '').toString().toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim()

    if (selectedTag) {
      const normSelected = normalize(selectedTag)
      filtered = filtered.filter(exhibit => exhibit.tags.some(tag => {
        const n = normalize(tag)
        return n === normSelected || n.includes(normSelected) || normSelected.includes(n)
      }))
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(exhibit => 
        exhibit.exhibit_name.toLowerCase().includes(query) ||
        exhibit.location.toLowerCase().includes(query) ||
        exhibit.building_name.toLowerCase().includes(query) ||
        exhibit.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }
    return filtered
  }

  const displayExhibits = getDisplayExhibits()

  return (
    <div className="exhibits-wrap">
      <div className="container">
        <div className="header">
          <h1 className="title">{selectedTag ? `${selectedTag} Exhibits` : 'All Exhibits'}</h1>
          <p className="subtitle">Browse exhibits by category or search by name, location, or category</p>

          <div className="controls">
            <div className="search">
              <input
                type="text"
                placeholder="Search exhibits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <div className="search-icon">🔍</div>
            </div>

            <div className="dropdown-container">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="dropdown-toggle"
              >
                <span>{selectedTag || 'All Categories'}</span>
                <span className={`caret ${isDropdownOpen ? 'open' : ''}`}>▾</span>
              </button>

              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <button
                    onClick={() => { setSelectedTag(''); setIsDropdownOpen(false) }}
                    className={`dropdown-item ${selectedTag === '' ? 'active' : ''}`}
                  >
                    All Categories
                  </button>
                  {PREDEFINED_TAGS.map((tag) => {
                    const tagColors = getTagColor(tag)
                    const isActive = selectedTag === tag
                    return (
                      <button
                        key={tag}
                        onClick={() => { setSelectedTag(tag); setIsDropdownOpen(false) }}
                        className={`dropdown-item ${isActive ? 'active' : ''}`}
                        style={{
                          backgroundColor: isActive ? `${tagColors.bg}40` : 'transparent',
                          borderLeftColor: isActive ? tagColors.border : 'transparent'
                        }}
                      >
                        <span className="tag-dot" style={{ backgroundColor: tagColors.bg }}></span>
                        {tag}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="exhibits-grid">
          {loading ? (
            <div className="loading">Loading exhibits...</div>
          ) : error ? (
            <div className="error">
              <p>Error: {error}</p>
              <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          ) : displayExhibits.length > 0 ? (
            displayExhibits.map((exhibit, index) => (
              <div key={exhibit.exhibit_id || index} className="exhibit-card" style={{ animationDelay: `${index * 0.1}s` }}>
                
                <div className="tag-badges">
                  <div className="scrolling-tags">
                    {/* Duplicate only when there are multiple tags to create seamless scroll */}
                    {((exhibit.tags && exhibit.tags.length > 1) ? [...exhibit.tags] : exhibit.tags).map((tagName, tagIndex) => (
                      <div key={tagIndex} className="tag-badge" style={{
                        backgroundColor: getTagColor(tagName).bg,
                        borderColor: getTagColor(tagName).border,
                        color: getTagColor(tagName).text
                      }}>{tagName.toUpperCase()}</div>
                    ))}
                  </div>
                </div>

                <div className="exhibit-info">
                  <div>
                    <h3 className="exhibit-name">{exhibit.exhibit_name}</h3>
                    <p className="building-name">Building: {exhibit.building_name}</p>
                  </div>

                  <div className="location">
                    <span className="loc-label">Location:</span>
                    <span className="loc-value">{exhibit.location}</span>
                    
                    <span className="zone-label">Zone:</span>
                    <span className="zone-value">{exhibit.zone_name}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-illustration"><span className="empty-icon" aria-hidden>🔍</span></div>
              <h3>Oops! No exhibits here yet</h3>
              <p>{selectedTag ? `We couldn't find any exhibits in the "${selectedTag}" category.` : 'No exhibits are currently available.'}</p>
              <div className="empty-actions">
                {selectedTag && (
                  <button onClick={() => { setSelectedTag(''); setSearchQuery('') }} className="btn-primary">View All Categories</button>
                )}
                <button onClick={() => window.location.reload()} className="btn-secondary">Refresh</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ExhibitsPage
