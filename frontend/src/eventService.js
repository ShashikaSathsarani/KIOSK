// Event service for fetching and formatting event data

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3036';

// Fetch all events from backend API
export async function getAllEvents() {
  try {
    const response = await fetch(`${API_URL}/api/events`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response:', data);

    // Return in expected format
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

// Get events ongoing or starting within an hour (works on raw API objects)
export async function getEventsWithinHour() {
  try {
    const allEvents = await getAllEvents();
    if (!allEvents.success) return allEvents;

    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + (60 * 60 * 1000));

    const filteredEvents = allEvents.data.filter(event => {
      // make sure start_time/end_time exist and are valid
      const startTime = new Date(event.start_time);
      const endTime = new Date(event.end_time);
      if (isNaN(startTime) || isNaN(endTime)) return false;
      return startTime <= oneHourFromNow && endTime >= now;
    });

    return { success: true, data: filteredEvents };
  } catch (error) {
    console.error('Error getting events within hour:', error);
    return { success: false, error: error.message };
  }
}

// Format event data for display in the UI
export function formatEventForDisplay(event) {
  // Accept either event.id or event.event_id (backend aliasing)
  const rawId = event.event_id ?? event.id;
  const rawTitle = event.event_name ?? event.event_title ?? event.title ?? '';
  const rawVenue = event.location ?? event.venue ?? '';
  const rawCategory = event.category_name ?? event.category ?? 'General';

  const startTime = new Date(event.start_time);
  const endTime = new Date(event.end_time);
  const now = new Date();

  // Determine event status
  let status;
  if (!isNaN(startTime) && !isNaN(endTime)) {
    if (startTime <= now && endTime >= now) status = 'ongoing';
    else if (startTime > now) status = 'upcoming';
    else status = 'completed';
  } else {
    status = 'unknown';
  }

  // Format duration (human friendly)
  let duration = '—';
  if (!isNaN(startTime) && !isNaN(endTime)) {
    const durationMs = endTime - startTime;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    duration = hours > 0 ? `${hours}h ${minutes}m` : `${minutes} minutes`;
  }

  // Format display time (start)
  const displayTime = !isNaN(startTime)
    ? startTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    : 'TBD';

  return {
    id: rawId,
    title: rawTitle,
    venue: rawVenue,
    category: rawCategory,
    time: displayTime,
    duration,
    status,
    // keep original raw fields if you need them later
    _raw: event
  };
}
