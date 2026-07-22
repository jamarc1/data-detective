"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import IntroCinematic from "@/components/IntroCinematic";
import DetectiveOffice from "@/components/DetectiveOffice";
import GameShell from "@/components/GameShell";
import AchievementPopup from "@/components/AchievementPopup";

export default function Home() {
  const screen = useGameStore((s) => s.screen);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until client-side state is ready
  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-1 flex-col">
      <AchievementPopup />
      {screen === "intro" && <IntroCinematic />}
      {screen === "office" && <DetectiveOffice />}
      {(screen === "mission" || screen === "caseClosed") && <GameShell />}
    </div>
  );
}
