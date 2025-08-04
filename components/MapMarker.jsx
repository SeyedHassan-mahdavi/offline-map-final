// components/map/MapMarker.jsx
import { useEffect } from 'react';
import maplibregl from 'maplibre-gl';

export default function MapMarker({ map, coordinates, color = 'blue', label, onClick }) {
  useEffect(() => {
    if (!map || !coordinates) return;

    const el = document.createElement('div');
    el.style.width = '16px';
    el.style.height = '16px';
    el.style.borderRadius = '50%';
    el.style.backgroundColor = color;
    el.style.border = '2px solid white';
    el.style.boxShadow = '0 0 4px rgba(0,0,0,0.4)';
    el.style.cursor = 'pointer';
    if (label) el.title = label;

    if (onClick) {
      el.addEventListener('click', (e) => onClick(e, { coordinates, label }));
    }

    const marker = new maplibregl.Marker(el).setLngLat(coordinates).addTo(map);

    return () => marker.remove();
  }, [map, coordinates, color, label, onClick]);

  return null;
}
