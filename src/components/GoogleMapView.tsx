"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "@/lib/leaflet";

export function GoogleMapView({ lat, lng }: { lat: number; lng: number }) {
  if (!lat || !lng) {
    return (
      <div className="flex h-56 items-center justify-center rounded-xl border border-slate-200 text-sm text-slate-500">
        Location not available
      </div>
    );
  }

  return (
    <div className="h-56 w-full overflow-hidden rounded-xl border border-slate-200">
      <MapContainer
        center={[lat, lng]}
        zoom={16}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}>
          <Popup>Issue Location</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}