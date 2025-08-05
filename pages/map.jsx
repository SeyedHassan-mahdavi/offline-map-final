// pages/map.tsx
import dynamic from 'next/dynamic';

// Dynamically import the map component with no SSR
const OfflineMapWithLocation = dynamic(() => import('../components/OfflineMap'), {
  ssr: false,
});

export default function MapPage() {
  return <OfflineMapWithLocation />;
}
