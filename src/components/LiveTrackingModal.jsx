import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import { soundEffects } from '../utils/soundEffects';

export const LiveTrackingModal = () => {
  const {
    liveTrackingModalOpen,
    closeLiveTracking,
    liveTrackingBooking,
    cityLiveRoutes,
    selectedCity,
    setCancelModalBooking,
    setReassignModalBooking,
    userRole,
    t,
    language,
  } = useApp();

  const isHindi = language === 'hi';

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const workerMarkerRef = useRef(null);
  const destMarkerRef = useRef(null);
  const traveledPolylineRef = useRef(null);
  const fullPolylineRef = useRef(null);
  const animationIntervalRef = useRef(null);
  const hasPlayedArrivalRef = useRef(false);

  // Simulation State
  const [isPlaying, setIsPlaying] = useState(true);
  const [simulationSpeed, setSimulationSpeed] = useState(1); // 1x, 2x, 5x
  const [progress, setProgress] = useState(0.15); // 0 to 1
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'worker', text: 'Namaste! I am on my way with the tool kit and ISI replacement switches.', time: 'Just now' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [copiedPin, setCopiedPin] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [voiceSpeaking, setVoiceSpeaking] = useState(false);

  // Active City Route
  const routeCityKey = liveTrackingBooking?.city || selectedCity || 'sultanpur';
  const routeData = cityLiveRoutes[routeCityKey] || cityLiveRoutes.sultanpur;
  const waypoints = routeData.waypoints;

  // Active Worker & Booking info
  const workerName = liveTrackingBooking?.workerName || 'Awadhesh Sharma';
  const workerTrade = liveTrackingBooking?.workerTrade || 'Master Electrician • Co-Owner #SLN-101';
  const workerAvatar = liveTrackingBooking?.workerAvatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80';
  const workerPhone = liveTrackingBooking?.workerPhone || '98123 45678';
  const releaseOtp = liveTrackingBooking?.releaseOtp || '7429';
  const serviceTitle = liveTrackingBooking?.serviceTitle || 'Electrical Service & Repair';
  const address = liveTrackingBooking?.address || routeData.customerLocation.name;
  const vehicle = liveTrackingBooking?.vehicle || {
    type: 'Electric Scooter',
    model: 'Hero Electric NYX',
    regNumber: 'UP-64-E-4921',
    speedKmH: 28,
    batteryPercent: 90,
    helmetVerified: true,
  };

  // Interpolate coordinate along waypoints
  const getPositionAtProgress = (pct) => {
    const clamped = Math.max(0, Math.min(1, pct));
    const totalSegments = waypoints.length - 1;
    const exactIndex = clamped * totalSegments;
    const segmentIndex = Math.min(Math.floor(exactIndex), totalSegments - 1);
    const segmentProgress = exactIndex - segmentIndex;

    const p1 = waypoints[segmentIndex];
    const p2 = waypoints[segmentIndex + 1];

    const lat = p1[0] + (p2[0] - p1[0]) * segmentProgress;
    const lng = p1[1] + (p2[1] - p1[1]) * segmentProgress;

    // Calculate bearing angle (degrees)
    const y = Math.sin((p2[1] - p1[1]) * (Math.PI / 180)) * Math.cos(p2[0] * (Math.PI / 180));
    const x =
      Math.cos(p1[0] * (Math.PI / 180)) * Math.sin(p2[0] * (Math.PI / 180)) -
      Math.sin(p1[0] * (Math.PI / 180)) * Math.cos(p2[0] * (Math.PI / 180)) * Math.cos((p2[1] - p1[1]) * (Math.PI / 180));
    const bearing = (Math.atan2(y, x) * 180) / Math.PI;

    return { lat, lng, bearing, currentSegment: segmentIndex };
  };

  const currentPos = getPositionAtProgress(progress);
  const isArrived = progress >= 0.98;
  const remainingDistKm = isArrived ? 0 : Math.max(0.05, ((1 - progress) * routeData.initialDistanceKm)).toFixed(1);
  const remainingEtaMins = isArrived ? 0 : Math.max(1, Math.round((1 - progress) * routeData.initialEtaMins));
  const currentSpeed = isArrived ? 0 : Math.round(routeData.vehicleSpeed * (progress > 0.85 ? 0.6 : 1) + (Math.sin(progress * 10) * 3));

  // Initialize Map
  useEffect(() => {
    if (!liveTrackingModalOpen || !mapContainerRef.current) return;

    // Destroy existing instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const startPos = waypoints[0];
    const destPos = waypoints[waypoints.length - 1];

    // Create Leaflet Map
    const map = L.map(mapContainerRef.current, {
      center: routeData.center,
      zoom: routeData.zoom,
      zoomControl: false,
      attributionControl: true,
    });

    // Add CartoDB Voyager Tile Layer (Modern, crisp, vector-like aesthetic)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // Full Route Line (Grey/Blue dashed background path)
    fullPolylineRef.current = L.polyline(waypoints, {
      color: '#94a3b8',
      weight: 6,
      opacity: 0.6,
      dashArray: '8, 8',
      lineCap: 'round',
    }).addTo(map);

    // Traveled Route Line (Solid Vibrant Emerald path)
    const initialTraveled = [startPos, [currentPos.lat, currentPos.lng]];
    traveledPolylineRef.current = L.polyline(initialTraveled, {
      color: '#059669',
      weight: 6,
      opacity: 0.9,
      lineCap: 'round',
    }).addTo(map);

    // Destination Custom Marker (Customer Home)
    const destIconHtml = `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-10 h-10 rounded-full bg-emerald-500/30 animate-ping"></div>
        <div class="w-9 h-9 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-lg border-2 border-white">
          <span class="material-symbols-outlined text-[20px]">home_pin</span>
        </div>
      </div>
    `;

    const destIcon = L.divIcon({
      className: 'custom-dest-marker',
      html: destIconHtml,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    destMarkerRef.current = L.marker(destPos, { icon: destIcon })
      .addTo(map)
      .bindPopup(`<strong>Your Location</strong><br/>${address}`, { closeButton: false });

    // Worker Vehicle Marker
    const createWorkerIcon = (bearing) => {
      return L.divIcon({
        className: 'custom-worker-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <!-- Pulsing radar halo -->
            <div class="absolute w-12 h-12 rounded-full bg-primary/30 animate-radar-ping"></div>
            
            <!-- Vehicle Badge with direction indicator -->
            <div class="relative w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center shadow-xl border-2 border-white" style="transform: rotate(${bearing}deg); transition: transform 0.3s ease;">
              <span class="material-symbols-outlined text-[22px]">two_wheeler</span>
              <div class="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-400 text-slate-900 text-[9px] font-black flex items-center justify-center border border-white">
                ⚡
              </div>
            </div>

            <!-- Worker Avatar Bubble Tooltip -->
            <div class="absolute -bottom-6 bg-slate-900/90 backdrop-blur-xs text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md whitespace-nowrap shadow-md flex items-center gap-1 border border-white/20">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>${workerName.split(' ')[0]}</span>
            </div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });
    };

    workerMarkerRef.current = L.marker([currentPos.lat, currentPos.lng], {
      icon: createWorkerIcon(currentPos.bearing),
    }).addTo(map);

    mapInstanceRef.current = map;

    // Fit bounds to show both worker and destination
    const bounds = L.latLngBounds([[currentPos.lat, currentPos.lng], destPos]);
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [liveTrackingModalOpen, routeCityKey]);

  // Movement Simulation Engine (Looping or stepping along waypoints)
  useEffect(() => {
    if (!liveTrackingModalOpen || !isPlaying || isArrived) {
      if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
      return;
    }

    const step = 0.008 * simulationSpeed;
    animationIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 1) {
          clearInterval(animationIntervalRef.current);
          return 1;
        }
        return next;
      });
    }, 400);

    return () => {
      if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
    };
  }, [liveTrackingModalOpen, isPlaying, simulationSpeed, isArrived]);

  // Update Marker and Traveled Polyline on Position Change
  useEffect(() => {
    if (!mapInstanceRef.current || !workerMarkerRef.current) return;

    const pos = getPositionAtProgress(progress);
    workerMarkerRef.current.setLatLng([pos.lat, pos.lng]);

    // Update marker bearing rotation
    const iconEl = workerMarkerRef.current.getElement();
    if (iconEl) {
      const vehicleBox = iconEl.querySelector('div[style*="rotate"]');
      if (vehicleBox) {
        vehicleBox.style.transform = `rotate(${pos.bearing}deg)`;
      }
    }

    // Update traveled polyline
    const segmentIdx = pos.currentSegment;
    const completedWaypoints = waypoints.slice(0, segmentIdx + 1);
    completedWaypoints.push([pos.lat, pos.lng]);

    if (traveledPolylineRef.current) {
      traveledPolylineRef.current.setLatLngs(completedWaypoints);
    }

    // Play doorbell sound when arriving for the first time
    if (progress >= 0.98 && !hasPlayedArrivalRef.current) {
      hasPlayedArrivalRef.current = true;
      soundEffects.playDoorbellChime();
    } else if (progress < 0.9) {
      hasPlayedArrivalRef.current = false;
    }
  }, [progress]);

  // Call timer simulation
  useEffect(() => {
    let timer;
    if (callModalOpen) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [callModalOpen]);

  // Re-Center Map Button
  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    soundEffects.playRadarBlip();
    const pos = getPositionAtProgress(progress);
    const destPos = waypoints[waypoints.length - 1];
    const bounds = L.latLngBounds([[pos.lat, pos.lng], destPos]);
    mapInstanceRef.current.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 });
  };

  // Instant Simulate Arrival
  const handleInstantArrival = () => {
    setProgress(1);
    setIsPlaying(false);
    soundEffects.playDoorbellChime();
  };

  // Voice Announcement
  const handleSpeakStatus = () => {
    setVoiceSpeaking(true);
    if ('speechSynthesis' in window) {
      const text = isHindi
        ? (isArrived
            ? `आपके तकनीशियन ${workerName} आपके पते पर पहुँच चुके हैं। कृपया 4 अंकों का गुप्त पिन काम पूरा होने के बाद ही साझा करें।`
            : `आपके तकनीशियन ${workerName} रास्ते में हैं। वे लगभग ${remainingEtaMins} मिनट और ${remainingDistKm} किलोमीटर की दूरी पर हैं।`)
        : (isArrived
            ? `Your technician ${workerName} has arrived at your address. Please share the 4-digit secret PIN only after service is completed.`
            : `Your technician ${workerName} is on the way. ETA is approximately ${remainingEtaMins} minutes (${remainingDistKm} km away).`);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = isHindi ? 'hi-IN' : 'en-US';
      utterance.rate = 0.95;
      utterance.onend = () => setVoiceSpeaking(false);
      utterance.onerror = () => setVoiceSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setVoiceSpeaking(false), 2000);
    }
  };

  // Copy PIN
  const handleCopyPin = () => {
    navigator.clipboard?.writeText(releaseOtp);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
  };

  // Share Live Trip
  const handleShareTrip = () => {
    const shareText = `Track ${workerName} live on SAHYOG: ETA ${remainingEtaMins} mins. Location: ${address}`;
    navigator.clipboard?.writeText(shareText);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  // Send Chat message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMsg = { sender: 'customer', text: chatInput.trim(), time: 'Just now' };
    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput('');

    // Simulated quick worker reply
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'worker',
          text: `Got it! Just reaching ${address.split(',')[0]} in ${remainingEtaMins} minutes.`,
          time: 'Just now',
        },
      ]);
    }, 1200);
  };

  if (!liveTrackingModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="relative w-full h-full sm:h-[94vh] max-w-4xl bg-surface-container-lowest sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-surface-variant/30">
        
        {/* ================= TOP FLOATING HEADER OVERLAY ================= */}
        <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between gap-2 pointer-events-none">
          {/* Live ETA Pill */}
          <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md text-white px-3.5 py-2 rounded-2xl shadow-lg border border-white/15 flex items-center gap-2.5">
            <span className={`w-3 h-3 rounded-full ${isArrived ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-ping'}`}></span>
            <div>
              <div className="text-xs font-black tracking-wide flex items-center gap-1.5">
                <span>{isArrived ? (isHindi ? '🎉 तकनीशियन आ चुके हैं' : '🎉 TECHNICIAN ARRIVED') : `ETA ${remainingEtaMins} MINS`}</span>
                <span className="text-slate-400">•</span>
                <span className="text-amber-300 font-bold">{isArrived ? (isHindi ? 'गेट पर' : 'At Gate') : `${remainingDistKm} km`}</span>
              </div>
              <p className="text-[10px] text-slate-300 font-medium truncate max-w-[200px] sm:max-w-xs">
                {isArrived ? (isHindi ? 'तकनीशियन आपके द्वार पर हैं' : 'Technician is outside your door') : (isHindi ? `${address} के रास्ते में हैं` : `En route to ${address}`)}
              </p>
            </div>
          </div>

          {/* Quick Close & Audio Voice Buttons */}
          <div className="pointer-events-auto flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleSpeakStatus}
              className={`p-2.5 rounded-2xl shadow-lg border transition-all active:scale-95 ${
                voiceSpeaking
                  ? 'bg-amber-400 text-slate-900 border-amber-300 font-bold animate-pulse'
                  : 'bg-slate-900/90 text-white border-white/15 hover:bg-slate-800'
              }`}
              title={isHindi ? "आवाज में स्थिति सुनें" : "Voice Announcement"}
            >
              <span className="material-symbols-outlined text-[20px] material-symbols-fill">
                volume_up
              </span>
            </button>

            <button
              type="button"
              onClick={closeLiveTracking}
              className="p-2.5 bg-slate-900/90 text-white hover:bg-slate-800 rounded-2xl shadow-lg border border-white/15 transition-all active:scale-95"
              title="Close Map View"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* ================= LEAFLET MAP CONTAINER ================= */}
        <div className="relative flex-1 w-full bg-slate-100 overflow-hidden min-h-[340px]">
          <div ref={mapContainerRef} className="w-full h-full" />

          {/* Map Controls (Re-Center & Zoom) */}
          <div className="absolute right-3.5 bottom-4 z-20 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleRecenter}
              className="w-10 h-10 bg-white/95 hover:bg-white text-slate-800 rounded-2xl shadow-lg border border-slate-200 flex items-center justify-center transition-all active:scale-90"
              title="Re-Center Map"
            >
              <span className="material-symbols-outlined text-[20px] text-primary material-symbols-fill">
                my_location
              </span>
            </button>
            <button
              type="button"
              onClick={() => mapInstanceRef.current?.zoomIn()}
              className="w-10 h-10 bg-white/95 hover:bg-white text-slate-800 rounded-2xl shadow-lg border border-slate-200 flex items-center justify-center font-bold text-lg active:scale-90"
            >
              +
            </button>
            <button
              type="button"
              onClick={() => mapInstanceRef.current?.zoomOut()}
              className="w-10 h-10 bg-white/95 hover:bg-white text-slate-800 rounded-2xl shadow-lg border border-slate-200 flex items-center justify-center font-bold text-lg active:scale-90"
            >
              −
            </button>
          </div>

          {/* Floating Speed & Telemetry Pill (Bottom Left of Map) */}
          <div className="absolute left-3.5 bottom-4 z-20 bg-slate-900/85 backdrop-blur-md text-white px-3 py-1.5 rounded-xl shadow-lg border border-white/15 flex items-center gap-2 text-xs">
            <span className="material-symbols-outlined text-amber-400 text-[16px]">speed</span>
            <span className="font-bold">{currentSpeed} km/h</span>
            <span className="text-slate-400">|</span>
            <span className="text-emerald-300 font-medium">⚡ {vehicle.model}</span>
          </div>
        </div>

        {/* ================= UBER-STYLE BOTTOM DRAWER / INFO CARD ================= */}
        <div className="bg-surface-container-lowest p-4 sm:p-5 border-t border-surface-variant/30 flex flex-col gap-3.5 max-h-[50vh] sm:max-h-none overflow-y-auto z-30 shadow-2xl">
          {/* 1. Worker Profile + Contact Action Buttons */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={workerAvatar}
                  alt={workerName}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-primary/30 shadow-xs"
                />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-secondary text-white text-[11px] flex items-center justify-center font-black shadow-xs">
                  ✓
                </span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="font-extrabold text-sm sm:text-base text-on-surface truncate">
                    {workerName}
                  </h3>
                  <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                    Co-Owner #SLN-101
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant font-medium truncate mt-0.5">
                  {serviceTitle}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-on-surface-variant mt-1">
                  <span className="font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                    ★ 4.9 (84 reviews)
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-secondary">99% On-Time</span>
                </div>
              </div>
            </div>

            {/* Quick Action Circle Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setCallModalOpen(true)}
                className="w-11 h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-md active:scale-95 transition-all"
                title="Call Worker"
              >
                <span className="material-symbols-outlined text-[22px]">call</span>
              </button>
              <button
                type="button"
                onClick={() => setChatModalOpen(true)}
                className="w-11 h-11 rounded-2xl bg-primary hover:bg-primary-container text-white flex items-center justify-center shadow-md active:scale-95 transition-all relative"
                title="Live Chat"
              >
                <span className="material-symbols-outlined text-[22px]">chat</span>
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-white"></span>
              </button>
              <button
                type="button"
                onClick={handleShareTrip}
                className="w-11 h-11 rounded-2xl bg-surface-container-low hover:bg-surface-container text-on-surface flex items-center justify-center border border-surface-variant/40 shadow-xs active:scale-95 transition-all"
                title="Share Live Trip Link"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {copiedShare ? 'check' : 'share'}
                </span>
              </button>
            </div>
          </div>



          {/* 3. Escrow Secret 4-Digit Release PIN Card */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-start gap-2.5 min-w-0">
              <span className="material-symbols-outlined text-amber-700 text-[22px] shrink-0 mt-0.5">
                lock_clock
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-amber-900 uppercase tracking-wider">
                    Your Secret Escrow Release PIN
                  </span>
                  <span className="text-[10px] bg-amber-200 text-amber-950 font-bold px-1.5 py-0.2 rounded">
                    Safe Escrow
                  </span>
                </div>
                <p className="text-[11px] text-amber-800 font-medium leading-tight mt-0.5">
                  Share this 4-digit code with {workerName.split(' ')[0]} <strong>only after</strong> service is completed & inspected.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <div className="font-mono text-xl sm:text-2xl font-black text-primary bg-white px-3.5 py-1 rounded-xl border border-amber-300 shadow-2xs tracking-widest">
                {releaseOtp}
              </div>
              <button
                type="button"
                onClick={handleCopyPin}
                className="p-2 bg-white hover:bg-amber-100 rounded-xl border border-amber-300 text-amber-900 transition-colors shadow-2xs"
                title="Copy PIN"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {copiedPin ? 'check' : 'content_copy'}
                </span>
              </button>
            </div>
          </div>

          {/* 4. Simulation & Demo Controls (Play/Pause, 1x/2x/5x, Instant Arrive) */}
          <div className="flex items-center justify-between bg-surface-container-low p-2.5 rounded-xl border border-surface-variant/30 flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-on-surface-variant">Live Simulation:</span>
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-2.5 py-1 rounded-lg bg-primary text-white font-bold flex items-center gap-1 shadow-2xs active:scale-95"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
                <span>{isPlaying ? 'Pause' : 'Resume'}</span>
              </button>
              
              <div className="flex gap-1 ml-1">
                {[1, 2, 5].map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => setSimulationSpeed(spd)}
                    className={`px-2 py-0.5 rounded-md font-black text-[10px] ${
                      simulationSpeed === spd
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleInstantArrival}
                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 shadow-2xs active:scale-95 text-xs"
              >
                <span className="material-symbols-outlined text-[14px]">flag</span>
                <span>Simulate Arrival</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setProgress(0.05);
                  setIsPlaying(true);
                }}
                className="p-1 text-on-surface-variant hover:text-on-surface"
                title="Restart Trip"
              >
                <span className="material-symbols-outlined text-[18px]">replay</span>
              </button>
            </div>
          </div>

          {/* 5. Role-Specific Cooperative Actions */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-surface-variant/30 text-xs">
            {userRole === 'worker' ? (
              <>
                <button
                  type="button"
                  onClick={() => setReassignModalBooking(liveTrackingBooking)}
                  className="py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 font-bold text-amber-950 flex items-center justify-center gap-1.5 transition-colors active:scale-95 shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[16px] text-amber-800">swap_horiz</span>
                  <span>Handover to Peer</span>
                </button>
                <button
                  type="button"
                  onClick={closeLiveTracking}
                  className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center justify-center gap-1.5 transition-colors active:scale-95 shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                  <span>Close Route Map</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setCallModalOpen(true)}
                  className="py-2.5 px-3 rounded-xl bg-primary hover:bg-primary-container text-white font-bold flex items-center justify-center gap-1.5 transition-colors active:scale-95 shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[16px]">call</span>
                  <span>Call Technician</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCancelModalBooking(liveTrackingBooking);
                    closeLiveTracking();
                  }}
                  className="py-2.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 font-bold text-red-700 flex items-center justify-center gap-1.5 transition-colors active:scale-95 shadow-2xs"
                >
                  <span className="material-symbols-outlined text-[16px]">cancel</span>
                  <span>Cancel & Refund</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* ================= SIMULATED CALL MODAL ================= */}
        {callModalOpen && (
          <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-between p-6 animate-scale-up text-white">
            <div className="text-center mt-8">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <img
                  src={workerAvatar}
                  alt={workerName}
                  className="w-full h-full rounded-full object-cover border-4 border-emerald-500 shadow-2xl"
                />
                <div className="absolute inset-0 rounded-full border-4 border-emerald-400 animate-ping opacity-40"></div>
              </div>
              <h3 className="text-xl font-black">{workerName}</h3>
              <p className="text-slate-300 text-xs mt-1">{workerTrade}</p>
              <div className="mt-3 inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-full text-emerald-300 text-xs font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Call in Progress: 00:{callDuration < 10 ? `0${callDuration}` : callDuration}</span>
              </div>
            </div>

            <div className="text-center text-xs text-slate-400 max-w-xs">
              <p>Direct encrypted cooperative call. Zero recording. Free over data/VoIP.</p>
            </div>

            <div className="flex items-center gap-6 mb-8">
              <button
                type="button"
                className="w-14 h-14 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-lg active:scale-90"
              >
                <span className="material-symbols-outlined text-[24px]">mic_off</span>
              </button>
              <button
                type="button"
                onClick={() => setCallModalOpen(false)}
                className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-2xl active:scale-90 transition-all"
                title="End Call"
              >
                <span className="material-symbols-outlined text-[30px]">call_end</span>
              </button>
              <button
                type="button"
                className="w-14 h-14 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-lg active:scale-90"
              >
                <span className="material-symbols-outlined text-[24px]">volume_up</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= SIMULATED LIVE CHAT MODAL ================= */}
        {chatModalOpen && (
          <div className="absolute inset-0 z-50 bg-surface-container-lowest flex flex-col animate-scale-up">
            <div className="p-4 border-b border-surface-variant/30 flex items-center justify-between bg-surface-container-low">
              <div className="flex items-center gap-3">
                <img
                  src={workerAvatar}
                  alt={workerName}
                  className="w-10 h-10 rounded-xl object-cover border border-surface-variant/40"
                />
                <div>
                  <h4 className="font-bold text-sm text-on-surface">{workerName}</h4>
                  <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>En Route ({remainingEtaMins} mins away)</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setChatModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Message thread */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-surface-container-low/40">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === 'customer' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs ${
                      msg.sender === 'customer'
                        ? 'bg-primary text-white rounded-br-xs'
                        : 'bg-surface-container-lowest text-on-surface border border-surface-variant/30 rounded-bl-xs shadow-2xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-on-surface-variant mt-0.5 px-1">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Quick Chips */}
            <div className="p-2 border-t border-surface-variant/20 flex gap-1.5 overflow-x-auto no-scrollbar bg-surface-container-lowest">
              {[
                "I'm at the main gate",
                'Please call when you reach',
                'Near the water tank',
                'Take the stairs to 2nd floor',
              ].map((chip, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setChatMessages((prev) => [
                      ...prev,
                      { sender: 'customer', text: chip, time: 'Just now' },
                    ]);
                  }}
                  className="px-2.5 py-1 rounded-full text-[11px] bg-surface-container-low text-on-surface border border-surface-variant/40 hover:bg-surface-container whitespace-nowrap active:scale-95"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input bar */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 border-t border-surface-variant/30 flex items-center gap-2 bg-surface-container-lowest"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a message to technician..."
                className="flex-1 bg-surface-container-low border border-surface-variant/40 rounded-xl px-3.5 py-2 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:bg-surface-container-lowest"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow-xs active:scale-95"
              >
                Send
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
