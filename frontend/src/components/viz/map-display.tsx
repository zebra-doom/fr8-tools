"use client";

import dynamic from "next/dynamic";
import type { GeoJSONData } from "@/lib/types";

// Lazy-load Leaflet (it accesses `window` and is not SSR-safe)
const LazyMap = dynamic(() => import("./map-inner"), { ssr: false });

interface MapDisplayProps {
  data: GeoJSONData;
}

export function MapDisplay({ data }: MapDisplayProps) {
  return (
    <div className="mt-2 w-full overflow-hidden rounded-xl border border-[var(--border)]">
      <LazyMap data={data} />
    </div>
  );
}
