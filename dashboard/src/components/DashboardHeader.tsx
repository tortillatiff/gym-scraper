import { Button } from "@/components/ui/button";
import { Settings, Clock } from "lucide-react";
import { DataEntry } from "@/app/page";

interface DashboardHeaderProps {
  gymData: DataEntry[];
  onSettingsClick: () => void;
}

export function DashboardHeader({
  gymData,
  onSettingsClick,
}: DashboardHeaderProps) {
  const getLastUpdated = () => {
    if (gymData.length === 0) return "No data";

    // Parse timestamp directly (already in SGT)
    const latest = new Date(gymData[gymData.length - 1].timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - latest.getTime()) / 60000);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hr ago`;
    return `${Math.floor(diffMinutes / 1440)} days ago`;
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Gym Capacity</h1>
        <p className="text-sm text-gray-600 flex items-center gap-1">
          <Clock className="w-4 h-4" />
          Updated {getLastUpdated()}
        </p>
      </div>
      <Button variant="ghost" size="icon" onClick={onSettingsClick}>
        <Settings className="w-5 h-5" />
      </Button>
    </div>
  );
}
