export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  chart?: ChartConfig | null;
  map?: GeoJSONData | null;
  sql?: string | null;
}

export interface ChartConfig {
  chart_type: "bar" | "line" | "pie" | "scatter";
  title: string;
  x_key: string;
  y_key: string;
  data: Record<string, unknown>[];
  x_label: string;
  y_label: string;
}

export interface GeoJSONData {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

export interface GeoJSONFeature {
  type: "Feature";
  geometry: {
    type: "Point" | "LineString" | "Polygon";
    coordinates: number[] | number[][];
  };
  properties: Record<string, unknown>;
}

export interface SSEEvent {
  event: string;
  data: string;
}
