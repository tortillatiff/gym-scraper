import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataEntry } from "@/app/page";

interface GymListProps {
  gymData: DataEntry[];
  pinnedGyms: string[];
  onGymClick: (gymName: string) => void;
}

export function GymList({ gymData, pinnedGyms, onGymClick }: GymListProps) {
  const getLatestCapacity = (gymName: string): number => {
    const latest = gymData[gymData.length - 1];
    const gym = latest?.gyms.find((g) => g.name === gymName);
    return gym?.percentage_full || 0;
  };

  const getCapacityStatus = (
    percentage: number
  ): "good" | "moderate" | "busy" => {
    if (percentage < 30) return "good";
    if (percentage < 70) return "moderate";
    return "busy";
  };

  const getStatusEmoji = (status: "good" | "moderate" | "busy") => {
    switch (status) {
      case "good":
        return "🟢";
      case "moderate":
        return "🟡";
      case "busy":
        return "🔴";
    }
  };

  const getStatusMessage = (status: "good" | "moderate" | "busy") => {
    switch (status) {
      case "good":
        return "Good to go!";
      case "moderate":
        return "Moderate crowd";
      case "busy":
        return "Pretty busy";
    }
  };

  const formatGymName = (gymName: string) => {
    return gymName.replace("ActiveSG Gym @ ", "").replace(" ActiveSG Gym", "");
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">🚦 Your Gyms</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {pinnedGyms.map((gymName) => {
          const capacity = getLatestCapacity(gymName);
          const status = getCapacityStatus(capacity);
          const shortName = formatGymName(gymName);

          return (
            <div
              key={gymName}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => onGymClick(gymName)}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{getStatusEmoji(status)}</span>
                <div>
                  <p className="font-medium">{shortName}</p>
                  <p className="text-xs text-gray-500">
                    {getStatusMessage(status)}
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="font-bold">
                {capacity}%
              </Badge>
            </div>
          );
        })}

        {pinnedGyms.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No gyms pinned yet.</p>
            <p className="text-xs">Go to Settings to pin your favorite gyms!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
