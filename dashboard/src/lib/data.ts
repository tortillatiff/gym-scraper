export async function loadGymData() {
  try {
    // This reads from your scraped data via API route
    const response = await fetch("/api/gym-data");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to load gym data:", error);
    return [];
  }
}
