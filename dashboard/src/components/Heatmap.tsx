import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataEntry } from "@/app/page";
import { LoadingSpinner } from "./LoadingSpinner";

interface HeatmapProps {
  gymData: DataEntry[];
  selectedGym: string;
  onBack: () => void;
  isLoading: boolean;
}

export function Heatmap({
  gymData,
  selectedGym,
  onBack,
  isLoading,
}: HeatmapProps) {
  const generateHeatmapData = (gymName: string) => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const hours = Array.from({ length: 16 }, (_, i) => i + 7); // 7 AM to 10 PM (16 hours)

    // Map day names to JavaScript getDay() values
    const dayMapping: { [key: string]: number } = {
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
      Sun: 0,
    };

    const heatmapData = days.map((day) =>
      hours.map((hour) => {
        // Calculate average capacity for this day/hour for the specific gym
        const relevantEntries = gymData.filter((entry) => {
          // Parse timestamp directly (already in SGT)
          const date = new Date(entry.timestamp);
          const dayOfWeek = date.getDay();
          const hourOfDay = date.getHours();

          return dayOfWeek === dayMapping[day] && hourOfDay === hour;
        });

        if (relevantEntries.length === 0) return null; // Use null for no data

        const avgCapacity =
          relevantEntries.reduce((sum, entry) => {
            const gym = entry.gyms.find((g) => g.name === gymName);
            return sum + (gym ? gym.percentage_full : 0);
          }, 0) / relevantEntries.length;

        return Math.round(avgCapacity);
      })
    );

    return { days, hours, data: heatmapData };
  };

  const formatGymName = (gymName: string) => {
    return gymName.replace("ActiveSG Gym @ ", "").replace(" ActiveSG Gym", "");
  };

  const getCellClassName = (capacity: number | null) => {
    if (capacity === null) {
      return "bg-gray-200 text-gray-400"; // No data
    }
    if (capacity < 30) {
      return "bg-green-500 text-white";
    }
    if (capacity < 70) {
      return "bg-yellow-500 text-white";
    }
    return "bg-red-500 text-white";
  };

  const getCellContent = (capacity: number | null) => {
    return capacity === null ? "—" : capacity.toString();
  };

  const getCellTitle = (day: string, hour: number, capacity: number | null) => {
    const timeStr = `${day} ${hour}:00`;
    return capacity === null
      ? `${timeStr} - No data`
      : `${timeStr} - ${capacity}% avg`;
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading heatmap data..." />;
  }

  const heatmap = generateHeatmapData(selectedGym);
  const gymShortName = formatGymName(selectedGym);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack}>
            ← Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">Capacity Heatmap</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Patterns - {gymShortName}</CardTitle>
            <p className="text-sm text-gray-600">Gym hours: 7 AM - 10 PM SGT</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div
                className="grid gap-1 min-w-max"
                style={{
                  gridTemplateColumns: `auto repeat(${heatmap.hours.length}, 1fr)`,
                }}
              >
                {/* Header row */}
                <div></div>
                {heatmap.hours.map((hour) => (
                  <div
                    key={hour}
                    className="text-xs p-2 text-center font-medium min-w-[40px]"
                  >
                    {hour}:00
                  </div>
                ))}

                {/* Data rows */}
                {heatmap.days.map((day, dayIndex) => (
                  <React.Fragment key={day}>
                    <div className="text-xs p-2 font-medium flex items-center min-w-[50px]">
                      {day}
                    </div>
                    {heatmap.data[dayIndex].map((capacity, hourIndex) => (
                      <div
                        key={`${day}-${hourIndex}`}
                        className={`aspect-square rounded text-xs flex items-center justify-center font-medium min-w-[40px] min-h-[40px] ${getCellClassName(
                          capacity
                        )}`}
                        title={getCellTitle(
                          day,
                          heatmap.hours[hourIndex],
                          capacity
                        )}
                      >
                        {getCellContent(capacity)}
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4 text-xs">
              <span>Less busy</span>
              <div className="flex gap-1">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
              </div>
              <span>More busy / No data</span>
            </div>

            {/* Debug info */}
            <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
              <strong>Debug:</strong> Total data points: {gymData.length},
              Latest timestamp: {gymData[gymData.length - 1]?.timestamp}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
