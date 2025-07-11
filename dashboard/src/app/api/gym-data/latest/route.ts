export async function GET() {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/tortillatiff/gym-scraper/main/gym_capacity_data.json",
      { next: { revalidate: 300 } }
    );
    const data = await response.json();

    // Return only the latest entry (for current capacity)
    const latest = data[data.length - 1];
    return Response.json(latest);
  } catch (error) {
    return Response.json(error);
  }
}
