// Adapted from The Chronicle of Light. MIT notice: docs/LICENSE-upstream.
import { useEffect, useState } from 'react';
import {
  GeoJSON,
  MapContainer,
  Polyline,
  useMap,
  ZoomControl,
} from 'react-leaflet';
import type { GeoJsonObject } from 'geojson';
import 'leaflet/dist/leaflet.css';
import type { Destination } from '../../types/catalog';
import { MapMarker } from './MapMarker';

interface MapViewProps {
  destinations: Destination[];
  selected?: Destination;
  counts: Record<string, number>;
  onSelect: (destination: Destination) => void;
}

function MapPosition({ selected }: { selected?: Destination }) {
  const map = useMap();
  useEffect(() => {
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);
  useEffect(() => {
    const animate = !window.matchMedia('(prefers-reduced-motion: reduce)')
      .matches;
    if (selected)
      map.flyTo([selected.latitude, selected.longitude], 4, {
        animate,
        duration: 0.8,
      });
    else
      map.fitBounds(
        [
          [-50, -130],
          [65, 160],
        ],
        { animate, padding: [20, 20] }
      );
  }, [map, selected]);
  return null;
}

export function MapView({
  destinations,
  selected,
  counts,
  onSelect,
}: MapViewProps) {
  const [land, setLand] = useState<GeoJsonObject | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${import.meta.env.BASE_URL}land.geojson`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error('Land map unavailable');
        return response.json();
      })
      .then((data) => {
        setLand(data);
        setError(false);
      })
      .catch((reason: Error) => {
        if (reason.name !== 'AbortError') setError(true);
      });
    return () => controller.abort();
  }, [attempt]);
  return (
    <div className="map-canvas" role="region" aria-label="电影文化世界地图">
      <MapContainer
        center={[25, 20]}
        zoom={2}
        minZoom={0.5}
        maxZoom={6}
        zoomSnap={0.25}
        maxBounds={[
          [-85, -200],
          [85, 200],
        ]}
        maxBoundsViscosity={0.8}
        zoomControl={false}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <MapPosition selected={selected} />
        <ZoomControl
          position="bottomright"
          zoomInTitle="放大地图"
          zoomOutTitle="缩小地图"
        />
        {[-60, -30, 0, 30, 60].map((latitude) => (
          <Polyline
            key={`lat-${latitude}`}
            positions={[
              [latitude, -180],
              [latitude, 180],
            ]}
            pathOptions={{
              color: '#22393f',
              weight: 1,
              opacity: 0.55,
              interactive: false,
            }}
          />
        ))}
        {[-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].map(
          (longitude) => (
            <Polyline
              key={`lng-${longitude}`}
              positions={[
                [-80, longitude],
                [80, longitude],
              ]}
              pathOptions={{
                color: '#22393f',
                weight: 1,
                opacity: 0.55,
                interactive: false,
              }}
            />
          )
        )}
        {land && (
          <GeoJSON
            data={land}
            style={{
              color: '#48605d',
              weight: 0.8,
              fillColor: '#203934',
              fillOpacity: 1,
            }}
            interactive={false}
            attribution='Made with <a href="https://www.naturalearthdata.com/">Natural Earth</a>'
          />
        )}
        {destinations.map((place) => (
          <MapMarker
            key={place.id}
            destination={place}
            count={counts[place.id] ?? 0}
            selected={place.id === selected?.id}
            onClick={onSelect}
          />
        ))}
      </MapContainer>
      <div className="map-caption">
        <span className="map-dot" />
        {selected
          ? `${selected.name} · 地区入口`
          : `${destinations.length} 个目的地 · 点击光点探索`}
      </div>
      {!selected && (
        <div className="map-ocean" aria-hidden="true">
          AN ATLAS OF HUMAN STORIES
        </div>
      )}
      {error && (
        <div className="map-error" role="status">
          地图轮廓暂时无法加载，仍可从下方选择目的地。
          <button onClick={() => setAttempt((value) => value + 1)}>
            重试底图
          </button>
        </div>
      )}
    </div>
  );
}
