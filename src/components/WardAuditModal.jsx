import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { soundEffects } from '../utils/soundEffects';

export const WardAuditModal = () => {
  const {
    wardAuditModalBooking,
    setWardAuditModalBooking,
    resolveWardAudit,
    language,
  } = useApp();

  const isHindi = language === 'hi';

  const [auditMode, setAuditMode] = useState('menu'); // 'menu' | 'video_call' | 'physical_visit' | 'resolved'
  const [isVideoConnected, setIsVideoConnected] = useState(false);
  const [callTimer, setCallTimer] = useState(120); // 2 minutes countdown
  const [isMuted, setIsMuted] = useState(false);
  const [cameraFlipped, setCameraFlipped] = useState(false);
  const [snapshotTaken, setSnapshotTaken] = useState(false);
  const [wardenMessage, setWardenMessage] = useState(
    isHindi
      ? 'नमस्ते! मैं वार्ड 112 कोऑपरेटिव वार्डन राजेंद्र शुक्ला बोल रहा हूँ। कृपया कैमरा उस जगह दिखाएं जहाँ काम होना था।'
      : 'Namaste! I am Rajendra Shukla, Ward 112 Cooperative Warden. Please point your camera at the work site so I can inspect.'
  );
  const [resolutionResult, setResolutionResult] = useState(null);

  useEffect(() => {
    let interval;
    if (auditMode === 'video_call' && isVideoConnected && callTimer > 0) {
      interval = setInterval(() => {
        setCallTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [auditMode, isVideoConnected, callTimer]);

  if (!wardAuditModalBooking) return null;

  const booking = wardAuditModalBooking;

  const startVideoCall = () => {
    setAuditMode('video_call');
    soundEffects.playRadarBlip();
    setTimeout(() => {
      setIsVideoConnected(true);
      soundEffects.playSuccessChime();
    }, 1500);
  };

  const handleTakeSnapshot = () => {
    setSnapshotTaken(true);
    soundEffects.playSuccessChime();
    setWardenMessage(
      isHindi
        ? '✓ फोटो साक्ष्य रिकॉर्ड हो गया! मैंने देखा कि काम अधूरा है और वायर खुले पड़े हैं। मैं तुरंत आपका 100% रिफंड जारी कर रहा हूँ।'
        : '✓ Site snapshot recorded! I clearly see incomplete work. Authorizing your 100% escrow refund right now.'
    );
  };

  const handleConfirmRefund = () => {
    resolveWardAudit(booking.id, 'refund_customer');
    soundEffects.playCashPayoutChime();
    setResolutionResult({
      type: 'refund',
      title: isHindi ? '₹450 का 100% तुरंत रिफंड जारी!' : '100% Instant Refund of ₹450 Issued!',
      message: isHindi
        ? 'सहकारी वार्डन द्वारा निरीक्षण पूर्ण। एस्क्रो राशि आपके मूल UPI/बैंक में वापस भेज दी गई है। वर्कर के कोऑपरेटिव शेयर से पेनल्टी काटी गई है।'
        : 'Ward inspection confirmed incomplete work. Escrow deposit reversed 100% to your UPI. Disciplinary penalty logged on worker.',
    });
    setAuditMode('resolved');
  };

  const handleDispatchReplacement = () => {
    resolveWardAudit(booking.id, 'dispatch_peer');
    soundEffects.playSuccessChime();
    setResolutionResult({
      type: 'replacement',
      title: isHindi ? 'नया सत्यापित तकनीशियन रवाना!' : 'Senior Replacement Technician Dispatched!',
      message: isHindi
        ? 'सीनियर तकनीशियन आरिफ खान को कार्य पूर्ण करने हेतु भेजा गया है। बिना किसी अतिरिक्त शुल्क के काम पूरा होगा।'
        : 'Senior Technician Arif Khan assigned to complete work at zero extra charge.',
    });
    setAuditMode('resolved');
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border-2 border-red-500/80 flex flex-col gap-4 my-auto relative">
        {/* Top Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-2xl bg-red-100 text-red-700 border border-red-300 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl animate-pulse">
                video_camera_front
              </span>
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-800 px-2 py-0.5 rounded-md border border-red-200">
                  {isHindi ? 'वार्ड कोऑर्डिनेटर त्वरित जांच' : 'Ward Coordinator Anti-Fraud Audit'}
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-500">
                  Ward 112
                </span>
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 mt-0.5">
                {isHindi ? 'फर्जी क्लेम व कार्य निरीक्षण डेस्क' : 'Live Site Audit & Dispute Verification'}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setWardAuditModalBooking(null)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* MODE 1: RESOLVED STATE */}
        {auditMode === 'resolved' && resolutionResult && (
          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col items-center text-center gap-3 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg animate-bounce">
              <span className="material-symbols-outlined text-3xl">verified</span>
            </div>
            <div>
              <h4 className="font-black text-base text-emerald-950">
                {resolutionResult.title}
              </h4>
              <p className="text-xs text-emerald-800 mt-1 max-w-sm font-medium leading-relaxed">
                {resolutionResult.message}
              </p>
            </div>
            <div className="p-2 bg-white rounded-xl border border-emerald-300 text-[11px] text-emerald-900 font-mono">
              Audit UTR Proof: #WARD-AUDIT-{Math.floor(100000 + Math.random() * 900000)}
            </div>
            <button
              type="button"
              onClick={() => {
                setWardAuditModalBooking(null);
                setAuditMode('menu');
              }}
              className="mt-2 px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              {isHindi ? 'डैशबोर्ड पर वापस जाएं' : 'Return to Bookings'}
            </button>
          </div>
        )}

        {/* MODE 2: MENU SELECTION (Video Call vs Physical Visit) */}
        {auditMode === 'menu' && (
          <div className="flex flex-col gap-3.5 text-xs text-slate-700">
            {/* Escrow Frozen Badge */}
            <div className="p-3 bg-red-50 rounded-2xl border border-red-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-600 text-[22px]">lock</span>
                <div>
                  <span className="font-extrabold text-red-950 text-xs block">
                    {isHindi ? 'एस्क्रो सुरक्षित फ्रीज: ₹' + (booking.totalEscrow || 450) : 'Escrow Deposit Frozen: ₹' + (booking.totalEscrow || 450)}
                  </span>
                  <span className="text-[11px] text-red-800 font-medium">
                    {isHindi
                      ? 'ऑटो-रिलीज टाइमर तत्काल रोक दिया गया है। आपकी अनुमति के बिना भुगतान नहीं होगा।'
                      : 'Auto-release timer immediately stopped. Funds cannot be released to worker.'}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase text-red-700 bg-red-200/80 px-2 py-0.5 rounded-md border border-red-300 shrink-0">
                Frozen
              </span>
            </div>

            {/* Assigned Ward Coordinator Profile Card */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80"
                  alt="Ward Coordinator"
                  className="w-12 h-12 rounded-xl object-cover border-2 border-primary/40 shadow-xs"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">
                      Rajendra Shukla
                    </span>
                    <span className="text-[10px] bg-primary/10 text-primary font-bold px-1.5 py-0.2 rounded-md">
                      Ward Warden
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">
                    Senior Electrician (14 Yrs) • Phone: <strong>94151 88201</strong>
                  </p>
                  <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[12px]">near_me</span>
                    <span>Located 0.6 km away (Available Now)</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Audit Options */}
            <div className="space-y-2.5">
              <span className="font-extrabold text-slate-900 block text-xs">
                {isHindi ? 'निरीक्षण का माध्यम चुनें (Choose Verification Method):' : 'Choose Verification Method:'}
              </span>

              {/* Option 1: 2-Minute Live Video Audit */}
              <button
                type="button"
                onClick={startVideoCall}
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-left shadow-md flex items-center justify-between gap-3 active:scale-98 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">
                      videocam
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-black block">
                      {isHindi ? '1. तुरंत 2-मिनट लाइव वीडियो कॉल करें' : '1. Start 2-Minute Live Video Call Audit'}
                    </span>
                    <span className="text-[11px] text-red-100 font-normal">
                      {isHindi
                        ? 'वार्डन को कैमरा दिखाकर तुरंत 100% रिफंड प्राप्त करें।'
                        : 'Show site via in-app camera for instant 100% refund verdict.'}
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </button>

              {/* Option 2: Physical Site Visit */}
              <button
                type="button"
                onClick={() => setAuditMode('physical_visit')}
                className="w-full p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 font-bold text-left flex items-center justify-between gap-3 active:scale-98 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-2xl">person_pin_circle</span>
                  </div>
                  <div>
                    <span className="text-xs font-black block">
                      {isHindi ? '2. कोऑर्डिनेटर को भौतिक निरीक्षण के लिए बुलाएं' : '2. Request On-Site Physical Inspection Visit'}
                    </span>
                    <span className="text-[11px] text-slate-500 font-normal">
                      {isHindi
                        ? 'वार्ड वार्डन 12 मिनट में आपके घर पहुँचकर स्पॉट जांच करेंगे।'
                        : 'Warden will arrive at your door in ~12 mins for physical spot check.'}
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-xl text-slate-400">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* MODE 3: LIVE VIDEO AUDIT CALL SCREEN */}
        {auditMode === 'video_call' && (
          <div className="flex flex-col gap-3 text-xs animate-fade-in">
            {/* Live Camera Viewport Simulation */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-16/10 border-2 border-red-500 shadow-inner flex flex-col justify-between p-3">
              {/* Top Viewport Bar */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-xl border border-white/20 text-white">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                  <span className="font-mono font-black text-xs text-red-400">
                    LIVE REC • {formatTimer(callTimer)}
                  </span>
                </div>

                <div className="bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-xl border border-white/20 text-white text-[10px] font-mono">
                  GPS: 26.2648° N, 82.0727° E
                </div>
              </div>

              {/* Center Work Site Simulation Frame */}
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80"
                  alt="Live Camera Site Feed"
                  className={`w-full h-full object-cover opacity-70 ${cameraFlipped ? 'scale-x-[-1]' : ''}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40"></div>
              </div>

              {/* Picture-in-Picture Ward Coordinator Avatar */}
              <div className="absolute top-12 right-3 w-24 h-32 rounded-xl overflow-hidden border-2 border-emerald-400 shadow-xl bg-slate-900 z-10">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80"
                  alt="Warden Pip"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-black/80 px-1 py-0.5 text-center text-[9px] text-emerald-300 font-bold truncate">
                  Rajendra (Warden)
                </div>
              </div>

              {/* Bottom Live Speech Bubble & Snapshot CTA */}
              <div className="z-10 flex flex-col gap-2">
                <div className="p-2.5 bg-slate-900/90 backdrop-blur-md rounded-xl border border-white/20 text-white text-[11px] leading-snug flex items-start gap-2">
                  <span className="material-symbols-outlined text-amber-300 text-[18px] shrink-0">
                    record_voice_over
                  </span>
                  <p className="flex-1 font-medium">{wardenMessage}</p>
                </div>

                {/* Call Controls Bar */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsMuted(!isMuted)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-white transition-colors ${
                        isMuted ? 'bg-red-600' : 'bg-white/20 hover:bg-white/30'
                      }`}
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {isMuted ? 'mic_off' : 'mic'}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCameraFlipped(!cameraFlipped)}
                      className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                      title="Flip Camera"
                    >
                      <span className="material-symbols-outlined text-[18px]">flip_camera_ios</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleTakeSnapshot}
                    className="px-3.5 h-9 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-1 shadow-md active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                    <span>{snapshotTaken ? '✓ Snapshot Saved' : 'Capture Site Evidence'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Verdict Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleConfirmRefund}
                className="py-3 px-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">currency_exchange</span>
                <span>{isHindi ? 'पुष्टि: फर्जी क्लेम • 100% रिफंड करें' : 'Confirm Fake Claim • 100% Refund'}</span>
              </button>
              <button
                type="button"
                onClick={handleDispatchReplacement}
                className="py-3 px-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
                <span>{isHindi ? 'नया तकनीशियन भेजें' : 'Send New Technician'}</span>
              </button>
            </div>
          </div>
        )}

        {/* MODE 4: PHYSICAL VISIT DISPATCH VIEW */}
        {auditMode === 'physical_visit' && (
          <div className="flex flex-col gap-3 text-xs animate-fade-in">
            <div className="p-4 bg-slate-950 text-white rounded-2xl border border-emerald-500/40 flex flex-col gap-3 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="font-black text-xs text-amber-300 uppercase tracking-wider">
                    Warden En Route on Bike
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-white bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-700">
                  ETA ~11 mins
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80"
                  alt="Warden"
                  className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-400"
                />
                <div>
                  <h4 className="font-black text-sm text-white">Rajendra Shukla (Warden)</h4>
                  <p className="text-xs text-slate-300">
                    Electric Scooter #UP-64-E-1011 • Carrying physical multimeter kit
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
              <strong>Cooperative Bylaw Guarantee:</strong> Escrow is 100% frozen. The Warden will conduct a physical inspection and submit an official report.
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setAuditMode('video_call')}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">videocam</span>
                <span>Switch to 2-Min Live Video Call</span>
              </button>
              <button
                type="button"
                onClick={() => setAuditMode('menu')}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
