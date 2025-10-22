// Event service for fetching and formatting event data

// Fetch all events from your backend API
export async function getAllEvents() {
  try {
    // API URL (fallback to localhost if VITE_API_URL not defined)
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3036';
    const response = await fetch(`${apiUrl}/api/events`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response:', data);

    // Return in the expected format
    return { 
      success: true, 
      data: Array.isArray(data) ? data : []
    };
  } catch (error) {
    console.error('Error fetching events:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

// Get events that are ongoing or will start within an hour
export async function getEventsWithinHour() {
  try {
    const allEvents = await getAllEvents();
    if (!allEvents.success) {
      return allEvents; // Forward the error
    }

    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + (60 * 60 * 1000));
    
    const filteredEvents = allEvents.data.filter(event => {
      const startTime = new Date(event.start_time);
      const endTime = new Date(event.end_time);
      return startTime <= oneHourFromNow && endTime >= now;
    });

    return { success: true, data: filteredEvents };
  } catch (error) {
    console.error('Error getting events within hour:', error);
    return { success: false, error: error.message };
  }
}

// Format event data for display
export function formatEventForDisplay(event) {
  const startTime = new Date(event.start_time);
  const endTime = new Date(event.end_time);
  const now = new Date();

  // Determine event status
  let status;
  if (startTime <= now && endTime >= now) {
    status = 'ongoing';
  } else if (startTime > now) {
    status = 'upcoming';
  } else {
    status = 'completed';
  }

  // Format duration
  const durationMs = endTime - startTime;
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  const duration = hours > 0 
    ? `${hours}h ${minutes}m`
    : `${minutes} minutes`;

  return {
    id: event.id || event.event_id,
    title: event.title || event.event_title || event.name,
    venue: event.location || event.venue,
    time: startTime.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true 
    }),
    duration,
    status,
    type: event.type || 'event'
  };
}
