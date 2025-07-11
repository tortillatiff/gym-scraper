interface GymData {
  name: string;
  percentage_full: number;
  timestamp: string;
  status: string;
}

interface DataEntry {
  timestamp: string;
  gyms: GymData[];
}

interface GymHistoryEntry {
  timestamp: string;
  gym: GymData;
}

export async function GET(
  _request: Request,
  { params }: { params: { gymName: string } }
) {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/tortillatiff/gym-scraper/main/gym_capacity_data.json",
      { next: { revalidate: 300 } }
    );
    const data: DataEntry[] = await response.json();

    // Filter data for specific gym only
    const gymHistory: GymHistoryEntry[] = data
      .map((entry: DataEntry) => ({
        timestamp: entry.timestamp,
        gym: entry.gyms.find(
          (g: GymData) => g.name === decodeURIComponent(params.gymName)
        ),
      }))
      .filter((entry): entry is GymHistoryEntry => entry.gym !== undefined);

    return Response.json(gymHistory);
  } catch (error) {
    console.error("Error fetching gym history:", error);
    return Response.json([]);
  }
}
