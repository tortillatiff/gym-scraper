import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataEntry } from "@/app/page";

interface SettingsPanelProps {
  gymData: DataEntry[];
  pinnedGyms: string[];
  setPinnedGyms: (gyms: string[]) => void;
  onBack: () => void;
}

export function SettingsPanel({
  gymData,
  pinnedGyms,
  setPinnedGyms,
  onBack,
}: SettingsPanelProps) {
  // Get all available gyms from the data
  const availableGyms = [
    ...new Set(gymData.flatMap((entry) => entry.gyms.map((g) => g.name))),
  ].sort();

  const formatGymName = (gymName: string) => {
    return gymName.replace("ActiveSG Gym @ ", "").replace(" ActiveSG Gym", "");
  };

  const toggleGymSelection = (gymName: string) => {
    const isSelected = pinnedGyms.includes(gymName);
    if (isSelected) {
      setPinnedGyms(pinnedGyms.filter((g) => g !== gymName));
    } else {
      setPinnedGyms([...pinnedGyms, gymName]);
    }
  };

  const getSelectionCheckbox = (isSelected: boolean) => {
    return (
      <div
        className={`w-4 h-4 rounded border-2 ${
          isSelected ? "bg-blue-500 border-blue-500" : "border-gray-300"
        }`}
      >
        {isSelected && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack}>
            ← Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Favorite Gyms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Select your favorite gyms to pin to your dashboard:
            </p>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {availableGyms.map((gymName) => {
                const isSelected = pinnedGyms.includes(gymName);
                const shortName = formatGymName(gymName);

                return (
                  <div
                    key={gymName}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-blue-50 border-blue-200"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => toggleGymSelection(gymName)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{shortName}</span>
                      {getSelectionCheckbox(isSelected)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t">
              <p className="text-xs text-gray-500">
                {pinnedGyms.length} gym{pinnedGyms.length !== 1 ? "s" : ""}{" "}
                selected
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
