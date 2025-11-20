// src/pages/kiosk/utils/eventCategoryService.js

export async function getAllCategories() {
  try {
    const apiUrl = 'http://localhost:3036';
    const response = await fetch(`${apiUrl}/api/eventCategories`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    console.log('Fetched categories:', data);
    return data;
  } catch (error) {
    console.error('Error fetching event categories:', error);
    throw error;
  }
}
