export async function GET() {
  try {
    // Fetch directly from GitHub raw content
    const response = await fetch(
      "https://raw.githubusercontent.com/tortillatiff/gym-scraper/main/gym_capacity_data.json"
    );
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("Error reading gym data:", error);
    return Response.json([]);
  }
}
