// export default function HomePage() {
//   const goToMap = () => {
//     try {
//       console.log("🚀 در حال رفتن به صفحه /map/");
//       window.location.href = './map/';
//     } catch (err) {
//       console.error("❌ خطا در رفتن به صفحه نقشه:", err);
//       alert('خطا در تغییر صفحه به /map/. لطفاً بررسی کنید.');
//     }
//   };

//   return (
//     <div style={{
//       display: 'flex',
//       flexDirection: 'column',
//       justifyContent: 'center',
//       alignItems: 'center',
//       height: '100vh',
//       background: '#f0f4f8',
//       padding: '16px',
//       textAlign: 'center',
//     }}>
//       <h1 style={{ fontSize: '24px', marginBottom: '12px', color: '#333' }}>📍 نقشه آفلاین</h1>
//       <p style={{ fontSize: '16px', color: '#666', marginBottom: '24px', maxWidth: '300px' }}>
//         برای مشاهده نقشه آفلاین عراق، روی دکمه زیر بزنید.
//       </p>

//       <button
//         onClick={goToMap}
//         style={{
//           display: 'inline-block',
//           backgroundColor: '#2196f3',
//           color: '#fff',
//           border: 'none',
//           borderRadius: '8px',
//           padding: '14px 28px',
//           fontSize: '16px',
//           cursor: 'pointer',
//           width: '80%',
//           maxWidth: '300px',
//           boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
//           textDecoration: 'none',
//           textAlign: 'center',
//         }}
//       >
//         نمایش نقشه
//       </button>

//       <p style={{ marginTop: '20px', fontSize: '12px', color: '#999' }}>
//         <code>window.location.href = './map/'</code>
//       </p>
//     </div>
//   );
// }
// pages/map.tsx
import dynamic from 'next/dynamic';

// Dynamically import the map component with no SSR
const OfflineMapWithLocation = dynamic(() => import('../components/OfflineMap'), {
  ssr: false,
});

export default function MapPage() {
  return <OfflineMapWithLocation />;
}
