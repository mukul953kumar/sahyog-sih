import React from 'react';
import { useApp } from '../context/AppContext';

export const BookingSuccessModal = () => {
  const { successBookingModal, setSuccessBookingModal, navigateTo, openLiveTracking } = useApp();

  if (!successBookingModal) return null;

  const handleTrackLive = () => {
    const booking = successBookingModal;
    setSuccessBookingModal(null);
    openLiveTracking(booking);
  };

  const handleViewBookings = () => {
    setSuccessBookingModal(null);
    navigateTo('bookings');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-sm bg-surface-container-lowest rounded-2xl p-space-md shadow-2xl flex flex-col gap-space-md border border-primary/20">
        <div className="w-14 h-14 mx-auto rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-inner">
          <span className="material-symbols-outlined text-[32px] material-symbols-fill text-secondary">
            lock
          </span>
        </div>

        <div className="text-center flex flex-col gap-1">
          <span className="inline-flex items-center gap-1 self-center px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold">
            <span className="material-symbols-outlined text-[13px]">verified</span>
            Escrow Locked Successfully
          </span>
          <h3 className="font-headline-sm text-headline-sm font-extrabold text-on-surface">
            Booking Confirmed!
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            {successBookingModal.serviceTitle} with{' '}
            <strong className="text-on-surface">{successBookingModal.workerName}</strong>.
          </p>
        </div>

        {/* Secret OTP Display */}
        <div className="bg-surface-container-low rounded-xl p-space-sm border border-surface-variant flex flex-col items-center gap-1 text-center">
          <span className="font-label-sm text-label-sm text-primary font-extrabold uppercase tracking-wider">
            Your Secret 4-Digit Escrow Release PIN
          </span>
          <div className="font-headline-xl text-headline-xl tracking-widest text-primary font-black py-1">
            {successBookingModal.releaseOtp}
          </div>
          <p className="font-body-sm text-[12px] text-on-surface-variant leading-tight">
            Share this PIN with {successBookingModal.workerName.split(' ')[0]} <strong>only after</strong> the job has been completed and verified by you.
          </p>
        </div>

        {/* Escrow Guarantee Box */}
        <div className="flex items-center gap-2 p-2 bg-primary-fixed/20 rounded-lg text-primary text-body-sm font-semibold">
          <span className="material-symbols-outlined text-[18px]">security</span>
          <span>100% Refundable if technician doesn't show up.</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={handleTrackLive}
            className="w-full h-12 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px] text-amber-300 material-symbols-fill">
              location_on
            </span>
            <span>Live Track Technician (Map)</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>

          <button
            type="button"
            onClick={handleViewBookings}
            className="w-full h-10 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-semibold text-xs flex items-center justify-center border border-surface-variant/40 active:scale-95 transition-all"
          >
            View My Bookings & Timeline
          </button>
        </div>
      </div>
    </div>
  );
};
