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

export async function loadLatestGymData() {
  const response = await fetch("/api/gym-data/latest");
  return await response.json();
}

export async function loadGymHistory(gymName: string) {
  const response = await fetch(
    `/api/gym-data/history/${encodeURIComponent(gymName)}`
  );
  return await response.json();
}
