import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  try {
    // Read the JSON file from parent directory
    const filePath = path.join(process.cwd(), "..", "gym_capacity_data.json");
    const jsonData = await fs.readFile(filePath, "utf8");
    const data = JSON.parse(jsonData);

    return Response.json(data);
  } catch (error) {
    console.error("Error reading gym data:", error);
    // Return empty array instead of error to prevent app crashes
    return Response.json([]);
  }
}
