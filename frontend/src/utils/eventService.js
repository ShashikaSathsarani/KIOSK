// src/pages/kiosk/utils/eventService.js

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

    return data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}
