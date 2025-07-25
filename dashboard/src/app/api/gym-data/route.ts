export async function GET() {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/tortillatiff/gym-scraper/main/gym_capacity_data.json",
      {
        // Cache for 5 minutes since data updates hourly anyway
        next: { revalidate: 300 },
      }
    );
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("Error reading gym data:", error);
    return Response.json([]);
  }
}
