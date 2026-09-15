import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { soundEffects } from '../utils/soundEffects';

export const OtpRefusalModal = () => {
  const {
    otpRefusalModalBooking,
    setOtpRefusalModalBooking,
    submitOtpRefusalClaim,
    language,
  } = useApp();

  const isHindi = language === 'hi';

  const [selectedReason, setSelectedReason] = useState('Customer demanding extra unpaid work');
  const [workerNotes, setWorkerNotes] = useState('');
  const [photos, setPhotos] = useState([
    {
      id: 'photo-1',
      title: 'Completed Work Photo',
      url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80',
      label: 'Job Done Evidence',
    },
    {
      id: 'photo-2',
      title: 'Site / Meter Reading',
      url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80',
      label: 'GPS & Time Logged',
    },
  ]);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [audioRecorded, setAudioRecorded] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [claimSubmitted, setClaimSubmitted] = useState(false);
  const [peerSosSent, setPeerSosSent] = useState(false);

  if (!otpRefusalModalBooking) return null;

  const booking = otpRefusalModalBooking;

  const handleRecordVoiceToggle = () => {
    if (!isRecordingAudio) {
      setIsRecordingAudio(true);
      setTimeout(() => {
        setIsRecordingAudio(false);
        setAudioRecorded(true);
        soundEffects.playSuccessChime();
      }, 2500);
    }
  };

  const handleSubmitClaim = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    soundEffects.playRadarBlip();

    setTimeout(() => {
      submitOtpRefusalClaim(booking.id, {
        reason: selectedReason,
        notes: workerNotes || (isHindi ? 'कार्य पूर्ण हो चुका है, फ़ोटो व जीपीएस साक्ष्य संलग्न है।' : 'Work completed thoroughly. Geo-tag & photo proof attached.'),
        photos: photos.map((p) => p.url),
        gpsStayMinutes: 46,
        audioProof: audioRecorded,
      });
      setIsSubmitting(false);
      setClaimSubmitted(true);
      soundEffects.playSuccessChime();

      setTimeout(() => {
        setClaimSubmitted(false);
        setOtpRefusalModalBooking(null);
      }, 2200);
    }, 800);
  };

  const handleTriggerPeerSos = () => {
    setPeerSosSent(true);
    soundEffects.playEmergencySiren();
    setTimeout(() => {
      setPeerSosSent(false);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border-2 border-amber-400/80 flex flex-col gap-4 my-auto relative">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5 text-amber-700">
            <span className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl text-amber-800">
                shield_with_heart
              </span>
            </span>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">
                {isHindi ? 'श्रमिक सुरक्षा व साक्ष्य दावा' : 'Worker Escrow Protection'}
              </span>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 mt-0.5">
                {isHindi ? 'ग्राहक ने OTP देने से मना किया?' : 'Customer Refused OTP / PIN?'}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setOtpRefusalModalBooking(null)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {claimSubmitted ? (
          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col items-center text-center gap-3 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg animate-bounce">
              <span className="material-symbols-outlined text-3xl">verified</span>
            </div>
            <div>
              <h4 className="font-black text-base text-emerald-950">
                {isHindi ? 'साक्ष्य सफलतापूर्वक दर्ज हुआ!' : 'Proof of Work Claim Submitted!'}
              </h4>
              <p className="text-xs text-emerald-800 mt-1 max-w-sm font-medium leading-relaxed">
                {isHindi
                  ? `ग्राहक को 2 घंटे का ऑटो-रिलीज नोटिस भेजा गया है। सहकारी रजिस्ट्रार सीधे ₹${booking.labourAmount} आपके बैंक में 100% जारी करेंगे।`
                  : `Customer alerted with a 2-Hour Auto-Release notice. Chapter Admin is authorized for 100% direct escrow bank release.`}
              </p>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-200/70 text-emerald-900 font-mono font-bold text-xs">
              Claim ID: #SHG-CLAIM-{(booking.id || '8821').replace(/\D/g, '')}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitClaim} className="flex flex-col gap-3.5 text-xs text-slate-700">
            {/* Escrow & Customer Summary Banner */}
            <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200/80 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase text-amber-900 block">
                  {isHindi ? 'सुरक्षित पारिश्रमिक राशि' : 'Locked Escrow Wage'}
                </span>
                <span className="text-lg font-black text-amber-950 font-mono">
                  ₹{booking.labourAmount || booking.totalEscrow} (100% Direct)
                </span>
                <p className="text-[11px] text-amber-800 truncate mt-0.5">
                  Order: #{booking.id} • Customer: <strong>{booking.customerName}</strong>
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300">
                  RBI Vault Safe
                </span>
              </div>
            </div>

            {/* Step 1: Automated Live GPS Geo-Fencing Badge */}
            <div className="p-3 bg-emerald-50/90 rounded-2xl border border-emerald-300 flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
              </span>
              <div className="flex-1 min-w-0">
                <span className="font-extrabold text-emerald-950 text-xs flex items-center gap-1.5">
                  <span>{isHindi ? 'जीपीएस जियो-फेंस सत्यापित (GPS Geo-Tag Verified)' : 'Live GPS Geo-Fence Verified'}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                </span>
                <p className="text-[11px] text-emerald-800 font-medium">
                  {isHindi
                    ? 'तकनीशियन ग्राहक के पते पर 46 मिनट से उपस्थित हैं (दूरी <15 मीटर)।'
                    : 'Technician logged on-site for 46 mins (Distance: 12m within coordinates).'}
                </p>
              </div>
            </div>

            {/* Step 2: Select Refusal Reason */}
            <div>
              <label className="font-extrabold text-slate-900 block mb-1 text-xs">
                {isHindi ? '1. ग्राहक द्वारा OTP न देने का कारण चुनें:' : '1. Select Reason for OTP Withholding:'}
              </label>
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Customer demanding extra unpaid work">
                  {isHindi ? 'ग्राहक बिना पैसे दिए अतिरिक्त काम की मांग कर रहे हैं' : 'Customer demanding free extra unpaid work'}
                </option>
                <option value="Customer refused to give PIN without valid reason">
                  {isHindi ? 'बिना किसी कारण के 4-अंक पिन देने से मना किया' : 'Customer refused to give 4-digit PIN without reason'}
                </option>
                <option value="Customer locked door / unreachable / phone off">
                  {isHindi ? 'ग्राहक घर पर नहीं हैं या फोन नहीं उठा रहे' : 'Customer unavailable / locked door / phone unreachable'}
                </option>
                <option value="Customer disputing pre-agreed rate">
                  {isHindi ? 'तय दर या सामान के खर्चे पर विवाद कर रहे हैं' : 'Customer disputing standard cooperative rate'}
                </option>
                <option value="Customer verbally hostile / unsafe">
                  {isHindi ? 'ग्राहक दुर्व्यवहार कर रहे हैं (असुरक्षित स्थिति)' : 'Customer verbally hostile / dispute at site'}
                </option>
              </select>
            </div>

            {/* Step 3: Before & After Proof Photos */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-extrabold text-slate-900 text-xs">
                  {isHindi ? '2. कार्य साक्ष्य फ़ोटो (Proof of Work):' : '2. Geo-Tagged Work Photos:'}
                </label>
                <span className="text-[10px] text-emerald-700 font-bold">2 Photos Attached ✓</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-4/3 group"
                  >
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-white">
                      <span className="text-[10px] font-bold block truncate">{photo.title}</span>
                      <span className="text-[9px] text-amber-300 font-mono">{photo.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 4: Audio Voice Note or Text remarks */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-extrabold text-slate-900 text-xs">
                  {isHindi ? '3. वॉइस नोट या विवरण (वैकल्पिक):' : '3. Audio Note or Remarks (Optional):'}
                </label>
                {audioRecorded && (
                  <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">mic</span>
                    <span>10s Voice Memo Attached</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={handleRecordVoiceToggle}
                  className={`flex-1 h-9 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    isRecordingAudio
                      ? 'bg-red-600 text-white border-red-700 animate-pulse'
                      : audioRecorded
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isRecordingAudio ? 'mic' : audioRecorded ? 'play_arrow' : 'mic'}
                  </span>
                  <span>
                    {isRecordingAudio
                      ? isHindi ? 'रिकॉर्डिंग जारी है...' : 'Recording Voice Proof...'
                      : audioRecorded
                      ? isHindi ? 'वॉइस साक्ष्य फिर से रिकॉर्ड करें' : 'Re-record Voice Memo'
                      : isHindi ? 'वॉइस साक्ष्य रिकॉर्ड करें (बोलकर बताएं)' : 'Record Voice Note'}
                  </span>
                </button>
              </div>

              <input
                type="text"
                value={workerNotes}
                onChange={(e) => setWorkerNotes(e.target.value)}
                placeholder={
                  isHindi
                    ? 'विवरण दर्ज करें (उदा. पूरा काम ठीक से किया, ग्राहक दरवाजा नहीं खोल रहे)'
                    : 'e.g. Completed MCB wiring replacement. Customer left home without sharing PIN.'
                }
                className="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-slate-400"
              />
            </div>

            {/* Peer SOS Helper Option */}
            {peerSosSent ? (
              <div className="p-2.5 bg-red-50 text-red-950 border border-red-300 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
                <span className="material-symbols-outlined text-red-600 text-[18px] animate-spin">
                  emergency
                </span>
                <span>
                  {isHindi
                    ? 'निकटवर्ती 2 साथी तकनीशियनों (सहयोगी) को तत्काल अलर्ट भेज दिया गया है!'
                    : 'SOS Alert dispatched to 2 nearby guild peers for immediate on-site mediation!'}
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleTriggerPeerSos}
                className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[15px] text-amber-700">group</span>
                <span>
                  {isHindi
                    ? 'साथी सहयोगी की सहायता चाहिए? (Call Nearby Peer)'
                    : 'Request Nearby Cooperative Peer Member to Visit'}
                </span>
              </button>
            )}

            {/* Submit Action */}
            <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOtpRefusalModalBooking(null)}
                className="px-4 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
              >
                {isHindi ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 h-11 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>
                  {isSubmitting
                    ? isHindi ? 'साक्ष्य जमा हो रहा है...' : 'Submitting Proof...'
                    : isHindi ? `साक्ष्य जमा करें व ₹${booking.labourAmount} का दावा करें` : `Submit Proof & Claim ₹${booking.labourAmount}`}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
