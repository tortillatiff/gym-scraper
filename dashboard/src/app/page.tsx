"use client";

import { useState, useEffect } from "react";
import { loadGymData } from "@/lib/data";
import { DashboardHeader } from "../components/DashboardHeader";
import { GymList } from "../components/GymList";
import { Heatmap } from "../components/Heatmap";
import { SettingsPanel } from "../components/SettingsPanel";
import { LoadingSpinner } from "../components/LoadingSpinner";

// Types
export interface GymData {
  name: string;
  percentage_full: number;
  timestamp: string;
  status: string;
}

export interface DataEntry {
  timestamp: string;
  gyms: GymData[];
}

// Default pinned gyms
const DEFAULT_PINNED_GYMS = [
  "ActiveSG Gym @ Ang Mo Kio CC",
  "Yio Chu Kang ActiveSG Gym",
];

export default function GymDashboard() {
  const [gymData, setGymData] = useState<DataEntry[]>([]);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedGymForHeatmap, setSelectedGymForHeatmap] = useState<
    string | null
  >(null);
  const [pinnedGyms, setPinnedGyms] = useState<string[]>(DEFAULT_PINNED_GYMS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await loadGymData();
      setGymData(data);
    } catch (error) {
      console.error("Failed to load gym data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGymClick = (gymName: string) => {
    setSelectedGymForHeatmap(gymName);
    setShowHeatmap(true);
  };

  const handleBackToDashboard = () => {
    setShowHeatmap(false);
    setSelectedGymForHeatmap(null);
  };

  const handleBackFromSettings = () => {
    setShowSettings(false);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading gym data..." />;
  }

  if (showSettings) {
    return (
      <SettingsPanel
        gymData={gymData}
        pinnedGyms={pinnedGyms}
        setPinnedGyms={setPinnedGyms}
        onBack={handleBackFromSettings}
      />
    );
  }

  if (showHeatmap && selectedGymForHeatmap) {
    return (
      <Heatmap
        gymData={gymData}
        selectedGym={selectedGymForHeatmap}
        onBack={handleBackToDashboard}
        isLoading={isLoading}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto space-y-4">
        <DashboardHeader
          gymData={gymData}
          onSettingsClick={() => setShowSettings(true)}
        />

        <GymList
          gymData={gymData}
          pinnedGyms={pinnedGyms}
          onGymClick={handleGymClick}
        />
      </div>
    </div>
  );
}
