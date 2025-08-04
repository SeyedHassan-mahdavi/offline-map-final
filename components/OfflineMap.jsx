
'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { Protocol } from 'pmtiles';
import 'maplibre-gl/dist/maplibre-gl.css';
import MapMarker from '../components/MapMarker'; // مسیر را بر اساس پروژه تنظیم کن
import { motion, AnimatePresence } from 'framer-motion';


export default function OfflineMapWithLocation() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  const [userCoords, setUserCoords] = useState(null);
  const [clickedMarkers, setClickedMarkers] = useState([]);
  const [isRouting, setIsRouting] = useState(false);     // فعال بودن انتخاب مسیر
  const [routePoints, setRoutePoints] = useState([]);     // [مبدا، مقصد]
  const [isMarkingEnabled, setIsMarkingEnabled] = useState(false);
  const isMarkingRef = useRef(false);
  const isRoutingRef = useRef(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmCoords, setConfirmCoords] = useState(null);



  const locateUser = () => {
    if (!navigator.geolocation) {
      alert('دستگاه شما از موقعیت‌یاب پشتیبانی نمی‌کند.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lng = position.coords.longitude;
        const lat = position.coords.latitude;

        setUserCoords([lng, lat]);

        if (mapRef.current) {
          mapRef.current.flyTo({ center: [lng, lat], zoom: 14 });
        }
      },
      (err) => {
        console.error('خطا در دریافت موقعیت:', err.message);
        alert('خطا در دریافت موقعیت. لطفاً GPS را فعال کنید.');
      },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    if (
      !maplibregl.getRTLTextPluginStatus ||
      maplibregl.getRTLTextPluginStatus() === 'unavailable'
    ) {
      maplibregl.setRTLTextPlugin(
        '/mapbox-gl-rtl-text.js',
        () => console.log('✅ RTL Plugin Loaded'),
        true
      );
    }

    const protocol = new Protocol();
    maplibregl.addProtocol('pmtiles', protocol.tile);

    const init = async () => {
      const res = await fetch('/style.json');
      const style = await res.json();

      if (style.sources?.openmaptiles) {
        style.sources.openmaptiles.url = 'pmtiles://iraq.pmtiles';
      }

      const map = new maplibregl.Map({
        container: mapContainer.current,
        style,
        center: [44.3, 32.5],
        zoom: 8,
        minZoom: 5,
        maxZoom: 16,
        pitch: 0,
        bearing: 0,
        maxBounds: [
          [38.5, 28.0],
          [49.5, 38.0]
        ],
        dragRotate: false,
        touchZoomRotate: false
      });

      map.on('click', (e) => {
        const { lng, lat } = e.lngLat;

        if (isRoutingRef.current) {
          setRoutePoints((prev) => {
            const updated = [...prev, [lng, lat]];
            if (updated.length === 2) {
              setIsRouting(false);
            }
            return updated;
          });
        } else if (isMarkingRef.current) {
          setClickedMarkers((prev) => [...prev, [lng, lat]]);
        }
      });



      map.addControl(new maplibregl.NavigationControl(), 'top-right');
      map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }));

      mapRef.current = map;
    };

    init();
  }, []);

  useEffect(() => {
    isMarkingRef.current = isMarkingEnabled;
  }, [isMarkingEnabled]);

  useEffect(() => {
    isRoutingRef.current = isRouting;
  }, [isRouting]);




  return (
    <div style={{ position: 'relative' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100vh' }} />
      <button
        onClick={() => {
          setRoutePoints([]);
          setIsRouting(true);
          alert('لطفاً ابتدا نقطه مبدا و سپس مقصد را روی نقشه انتخاب کنید.');
        }}
        style={{
          position: 'absolute',
          bottom: '140px',
          left: '15px',
          zIndex: 1000,
          padding: '10px 12px',
          backgroundColor: '#fff',
          borderRadius: '6px',
          border: '1px solid #ccc',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
          cursor: 'pointer'
        }}
      >
        🧭 مسیریابی
      </button>


      <button
        onClick={locateUser}
        style={{
          position: 'absolute',
          bottom: '80px',
          left: '15px',
          zIndex: 1000,
          padding: '10px 12px',
          backgroundColor: '#fff',
          borderRadius: '6px',
          border: '1px solid #ccc',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
          cursor: 'pointer'
        }}
      >
        📍 مکان من
      </button>

      {/* نمایش مارکر موقعیت کاربر */}
      {userCoords && (
        <MapMarker
          map={mapRef.current}
          coordinates={userCoords}
          color="blue"
          label="موقعیت من"
          onClick={(e, info) => {
            console.log("🔔 مارکر کلیک شد:", info);
            alert(`مختصات شما:\n📍 ${info.coordinates[1].toFixed(5)}, ${info.coordinates[0].toFixed(5)}\nبرچسب: ${info.label}`);
          }}
        />
      )}

      {clickedMarkers.map((coords, index) => (
        <MapMarker
          key={`clicked-${index}`}
          map={mapRef.current}
          coordinates={coords}
          color="red"
          label={`نقطه ${index + 1}`}
          onClick={(e, info) => {
            console.log('🔴 مارکر کاربر:', info);
            alert(`📍 ${info.coordinates[1].toFixed(5)}, ${info.coordinates[0].toFixed(5)}\nبرچسب: ${info.label}`);
          }}
        />
      ))}

      <button
        onClick={() => {
          setIsMarkingEnabled((prev) => !prev);
          setIsRouting(false); // اگه مسیریابی فعاله، غیرفعال بشه
        }}
        style={{
          position: 'absolute',
          bottom: '200px',
          left: '15px',
          zIndex: 1000,
          padding: '10px 12px',
          backgroundColor: isMarkingEnabled ? '#ffeb3b' : '#fff',
          borderRadius: '6px',
          border: '1px solid #ccc',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
          cursor: 'pointer'
        }}
      >
        📌 {isMarkingEnabled ? 'در حال ثبت نقطه' : 'ثبت نقطه'}
      </button>

      <button
        onClick={() => {
          if (!navigator.geolocation) {
            alert('موقعیت‌یاب در دستگاه شما فعال نیست.');
            return;
          }

          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const lat = pos.coords.latitude.toFixed(6);
              const lng = pos.coords.longitude.toFixed(6);
              const coords = [lng, lat];

              setUserCoords(coords);
              setConfirmCoords([lat, lng]);

              if (mapRef.current) {
                mapRef.current.flyTo({ center: coords, zoom: 14 });
              }

              // به‌جای alert، نمایش modal
              setTimeout(() => setShowConfirmModal(true), 1000); // تاخیر 1 ثانیه برای زوم
            },
            (err) => {
              alert(`❌ خطا در دریافت موقعیت:\n${err.message}`);
            },
            { enableHighAccuracy: true }
          );
        }}
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '15px',
          zIndex: 1000,
          padding: '10px 12px',
          backgroundColor: '#e1f5fe',
          borderRadius: '6px',
          border: '1px solid #ccc',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
          cursor: 'pointer'
        }}
      >
        📤 اعلام موقعیت
      </button>


      <AnimatePresence>
        {showConfirmModal && confirmCoords && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.2)',
              zIndex: 2000
            }}
            onClick={() => setShowConfirmModal(false)}
          >
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              onDragEnd={(event, info) => {
                if (info.offset.y > 100) setShowConfirmModal(false); // بستن با کشیدن پایین
              }}
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{
                background: 'rgba(255, 255, 255, 0.7)',
                borderRadius: '20px 20px 0 0',
                padding: '20px',
                maxWidth: '500px',
                margin: '0 auto',
                bottom: 0,
                left: 0,
                right: 0,
                position: 'absolute',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 -4px 16px rgba(0,0,0,0.3)',
                textAlign: 'center'
              }}
              onClick={(e) => e.stopPropagation()} // جلوگیری از بستن با کلیک داخل
            >
              <div style={{ width: '50px', height: '5px', background: '#999', borderRadius: '5px', margin: '0 auto 12px' }} />
              <h3 style={{ marginBottom: '10px' }}>📍 تأیید موقعیت</h3>
              <p style={{ fontSize: '14px' }}>Lat: {confirmCoords[0]}</p>
              <p style={{ fontSize: '14px' }}>Lng: {confirmCoords[1]}</p>
              <p style={{ fontFamily: 'monospace', direction: 'ltr', marginTop: '8px' }}>
                *123*{confirmCoords[0]}*{confirmCoords[1]}#
              </p>
              <div style={{ marginTop: '16px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button
                  onClick={() => {
                    const encoded = encodeURIComponent(`*123*${confirmCoords[0]}*${confirmCoords[1]}#`);
                    window.location.href = `tel:${encoded}`;
                    setShowConfirmModal(false);
                  }}
                  style={{
                    padding: '10px 16px',
                    background: '#2196f3',
                    color: '#fff',
                    borderRadius: '8px',
                    border: 'none'
                  }}
                >
                  ☎️ شماره‌گیری
                </button>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  style={{
                    padding: '10px 16px',
                    background: '#eee',
                    borderRadius: '8px',
                    border: '1px solid #aaa'
                  }}
                >
                  ❌ انصراف
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>







    </div>
  );
}
