// Adapted from The Chronicle of Light. MIT notice: docs/LICENSE-upstream.
import { useMemo } from 'react';
import { Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import type { Destination } from '../../types/catalog';

interface MapMarkerProps {
  destination: Destination;
  count: number;
  selected: boolean;
  onClick: (destination: Destination) => void;
}
export function MapMarker({
  destination,
  count,
  selected,
  onClick,
}: MapMarkerProps) {
  const icon = useMemo(
    () =>
      L.divIcon({
        className: `destination-marker${selected ? ' selected' : ''}${
          count === 0 ? ' muted' : ''
        }`,
        html: '<span class="marker-core"></span>',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      }),
    [selected, count]
  );
  return (
    <Marker
      position={[destination.latitude, destination.longitude]}
      icon={icon}
      title={`探索${destination.name}，${count} 部匹配影片`}
      alt={`探索${destination.name}`}
      keyboard
      eventHandlers={{ click: () => onClick(destination) }}
    >
      <Tooltip
        direction="top"
        offset={[0, -12]}
        opacity={1}
        className="destination-tooltip"
      >
        <strong>{destination.name}</strong>
        <span>{count} 部影片</span>
      </Tooltip>
    </Marker>
  );
}
