"use client";

import { useSyncExternalStore } from "react";
import { DbStatus, getDbStatus, onDbStatus } from "@/lib/duckdb";

const getServerSnapshot = (): DbStatus => "idle";

export function useDbStatus(): DbStatus {
  return useSyncExternalStore(onDbStatus, getDbStatus, getServerSnapshot);
}
