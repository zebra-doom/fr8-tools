"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import type { LatLngBoundsExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { GeoJSONData } from "@/lib/types";

function FitBounds({ data }: { data: GeoJSONData }) {
  const map = useMap();

  useEffect(() => {
    if (!data.features.length) return;

    const coords: [number, number][] = [];
    for (const feature of data.features) {
      const { geometry } = feature;
      if (geometry.type === "Point") {
        const [lng, lat] = geometry.coordinates as number[];
        coords.push([lat, lng]);
      } else if (geometry.type === "LineString") {
        for (const coord of geometry.coordinates as number[][]) {
          coords.push([coord[1], coord[0]]);
        }
      }
    }

    if (coords.length) {
      map.fitBounds(coords as LatLngBoundsExpression, { padding: [30, 30] });
    }
  }, [map, data]);

  return null;
}

export default function MapInner({ data }: { data: GeoJSONData }) {
  return (
    <MapContainer
      center={[50, 10]}
      zoom={5}
      style={{ height: 400, width: "100%" }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <GeoJSON data={data as any} />
      <FitBounds data={data} />
    </MapContainer>
  );
}
