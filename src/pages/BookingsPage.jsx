import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { LiveTripBanner } from '../components/LiveTripBanner';
import { soundEffects } from '../utils/soundEffects';

export const BookingsPage = () => {
  const {
    bookings,
    resetBookingsToSample,
    releaseEscrow,
    claimEscrowWithPin,
    navigateTo,
    setDisputeModalBooking,
    openLiveTracking,
    setInvoiceModalBooking,
    setCancelModalBooking,
    setReassignModalBooking,
    setOtpRefusalModalBooking,
    adminApproveOtpRefusal,
    wardAuditModalBooking,
    setWardAuditModalBooking,
    setReviewModalBooking,
    triggerCustomerFakeClaimDispute,
    resolveWardAudit,
    t,
    userRole,
    currentWorker,
    language,
  } = useApp();

  const isHindi = language === 'hi';
  const isWorker = userRole === 'worker';

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'locked' | 'completed' | 'refunded' | 'disputed'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [pinInputs, setPinInputs] = useState({});
  const [pinFeedback, setPinFeedback] = useState({});

  // Filter bookings for active role
  const roleBookings = useMemo(() => {
    return isWorker
      ? (bookings || []).filter(
          (b) =>
            b.workerId === currentWorker?.id ||
            b.workerName === currentWorker?.name ||
            !b.workerId
        )
      : bookings || [];
  }, [bookings, isWorker, currentWorker]);

  // Tab and search filter
  const filteredBookings = useMemo(() => {
    return roleBookings.filter((b) => {
      // Tab filter
      if (activeTab === 'locked' && b.status !== 'escrow_locked') return false;
      if (activeTab === 'otp_refused' && b.status !== 'otp_refused') return false;
      if (activeTab === 'completed' && b.status !== 'released') return false;
      if (activeTab === 'refunded' && b.status !== 'refunded') return false;
      if (activeTab === 'disputed' && b.status !== 'disputed') return false;

      // Category filter
      if (selectedCategory !== 'all' && b.category !== selectedCategory) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = b.id?.toLowerCase().includes(q);
        const matchTitle = b.serviceTitle?.toLowerCase().includes(q);
        const matchCustomer = b.customerName?.toLowerCase().includes(q);
        const matchWorker = b.workerName?.toLowerCase().includes(q);
        const matchAddress = b.address?.toLowerCase().includes(q);
        if (!matchId && !matchTitle && !matchCustomer && !matchWorker && !matchAddress) {
          return false;
        }
      }

      return true;
    });
  }, [roleBookings, activeTab, selectedCategory, searchQuery]);

  // Financial Metrics Calculation
  const totalEarned = useMemo(() => {
    return roleBookings
      .filter((b) => b.status === 'released')
      .reduce((sum, b) => sum + (b.labourAmount || 0), 0);
  }, [roleBookings]);

  const totalEscrowLocked = useMemo(() => {
    return roleBookings
      .filter((b) => b.status === 'escrow_locked')
      .reduce((sum, b) => sum + (b.labourAmount || b.totalEscrow || 0), 0);
  }, [roleBookings]);

  const commercialCutSaved = useMemo(() => {
    // 20% typical cut in commercial apps like UC
    return Math.round(totalEarned * 0.2);
  }, [totalEarned]);

  const handleWorkerPinClaim = (bookingId, actualPin) => {
    const entered = pinInputs[bookingId] || '';
    if (!entered || entered.length !== 4) {
      setPinFeedback((prev) => ({
        ...prev,
        [bookingId]: { type: 'error', text: 'Please enter a valid 4-digit PIN' },
      }));
      return;
    }

    const res = claimEscrowWithPin(entered);
    if (res.success) {
      soundEffects.playCashPayoutChime();
      setPinFeedback((prev) => ({
        ...prev,
        [bookingId]: { type: 'success', text: res.message },
      }));
    } else {
      setPinFeedback((prev) => ({
        ...prev,
        [bookingId]: { type: 'error', text: res.message },
      }));
    }
  };

  const getInitials = (name) => {
    if (!name) return 'CU';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6 pb-28 md:pb-16 animate-fade-in">
      {/* 1. Header Command Bar with Cooperative Badges */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold mb-2">
            <span className="material-symbols-outlined text-[15px] text-emerald-600">verified_user</span>
            <span>
              {isWorker
                ? isHindi
                  ? '100% सीधा मेहनताना • 0% कमीशन कटौती'
                  : '100% Direct Remuneration • Zero Fee Cut'
                : isHindi
                ? 'आरबीआई एस्क्रो सुरक्षा • 100% रिफंडेबल'
                : 'RBI Escrow Protected Vault • 100% Refundable'}
            </span>
          </div>
          <h1 className="font-black text-2xl sm:text-3xl text-on-surface tracking-tight">
            {isWorker
              ? isHindi
                ? 'कार्य ऑर्डर व एस्क्रो सेटलमेंट'
                : 'Job Orders & Escrow Settlements'
              : isHindi
              ? 'मेरी बुकिंग व एस्क्रो तिजोरी'
              : 'My Bookings & Escrow Vault'}
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant font-medium mt-1 max-w-2xl">
            {isWorker
              ? isHindi
                ? 'ग्राहक द्वारा 4-अंकीय पिन सत्यापित होते ही तय पारिश्रमिक तुरंत आपके बैंक खाते में क्रेडिट हो जाता है।'
                : 'Every rupee of agreed labour is credited directly to your registered bank account with instant UTR proof upon customer 4-digit PIN verification.'
              : isHindi
                ? 'आपकी बुकिंग राशि सहकारी एस्क्रो में सुरक्षित रहती है और कार्य निरीक्षण के बाद पिन साझा करने पर ही रिलीज होती है।'
                : 'Your booking amount stays securely vaulted in cooperative escrow and is only released after you inspect and share your completion PIN.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-center shrink-0">
          <button
            type="button"
            onClick={() => {
              resetBookingsToSample();
              soundEffects.playSuccessChime();
            }}
            title={isHindi ? "सैंपल डेटा रीसेट करें" : "Reset to clean sample orders"}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200 text-slate-800 text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px] text-primary">sync</span>
            <span>{isHindi ? 'डेमो डेटा रीसेट' : 'Reset Demo Data'}</span>
          </button>

          {!isWorker && (
            <button
              type="button"
              onClick={() => navigateTo('workers')}
              className="px-4 py-2.5 rounded-2xl bg-primary text-white font-bold text-xs shrink-0 active:scale-95 transition-all shadow-sm flex items-center gap-1.5 hover:bg-primary-container"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>{isHindi ? 'नई सेवा बुक करें' : 'Book New Service'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Executive Financial KPI Summary Cards (Worker/Customer perspective) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-xs font-bold uppercase tracking-wider">
              {isWorker
                ? isHindi ? 'कुल सीधी कमाई' : 'Total Direct Earnings'
                : isHindi ? 'कुल खर्च (0% मार्कअप)' : 'Total Spent (0% Markup)'}
            </span>
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">payments</span>
            </span>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-on-surface tracking-tight">
              ₹{totalEarned.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-emerald-700 font-bold block mt-0.5">
              {isHindi ? '✓ 100% बैंक में क्रेडिट' : '✓ 100% credited to bank'}
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-xs font-bold uppercase tracking-wider">
              {isWorker
                ? isHindi ? '20% बिचौलिया कटौती बचत' : 'Saved vs 20% UC Cut'
                : isHindi ? 'बचाया गया बिचौलिया शुल्क' : 'Middleman Fee Saved'}
            </span>
            <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">savings</span>
            </span>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
              +₹{commercialCutSaved.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-primary font-bold block mt-0.5">
              {isHindi ? '0% प्लेटफॉर्म कमीशन' : '0% Platform Commission'}
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-xs font-bold uppercase tracking-wider">
              {isHindi ? 'सक्रिय एस्क्रो तिजोरी' : 'Active Escrow Pool'}
            </span>
            <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">lock_clock</span>
            </span>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-900 tracking-tight">
              ₹{totalEscrowLocked.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-amber-800 font-bold block mt-0.5">
              {isHindi ? 'आरबीआई एस्क्रो में सुरक्षित' : 'Vaulted in RBI Escrow'}
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-xs font-bold uppercase tracking-wider">
              {isHindi ? 'भुगतान गति' : 'Settlement Speed'}
            </span>
            <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">bolt</span>
            </span>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-blue-950 tracking-tight">
              &lt; 5 {isHindi ? 'सेकंड' : 'Secs'}
            </span>
            <span className="text-[11px] text-blue-700 font-bold block mt-0.5">
              {isHindi ? 'तुरंत बैंक IMPS / UPI' : 'Instant Bank IMPS / UPI'}
            </span>
          </div>
        </div>
      </div>

      {/* Live Trip Active Banner (if customer has en-route booking) */}
      {!isWorker && <LiveTripBanner />}

      {/* 3. Search & Category / Status Filters Bar */}
      <div className="flex flex-col gap-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
        {/* Search Bar + Category Pills */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isWorker
                  ? isHindi
                    ? "ऑर्डर आईडी, ग्राहक नाम, पता या सेवा खोजें..."
                    : "Search by Order ID, customer name, locality, or service..."
                  : isHindi
                  ? "ऑर्डर आईडी, तकनीशियन या सेवा द्वारा खोजें..."
                  : "Search your bookings by order ID, technician, or service..."
              }
              className="w-full h-10 pl-10 pr-9 rounded-xl bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {[
              { id: 'all', label: isHindi ? 'सभी व्यवसाय' : 'All Trades', icon: 'apps' },
              { id: 'electrical', label: isHindi ? 'इलेक्ट्रिकल' : 'Electrical', icon: 'electric_bolt' },
              { id: 'plumbing', label: isHindi ? 'प्लंबिंग' : 'Plumbing', icon: 'plumbing' },
              { id: 'appliance', label: isHindi ? 'उपकरण' : 'Appliances', icon: 'mode_fan' },
              { id: 'cleaning', label: isHindi ? 'सफाई' : 'Cleaning', icon: 'cleaning_services' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 active:scale-95 flex items-center gap-1 ${
                  selectedCategory === cat.id
                    ? 'bg-secondary-container text-on-secondary-container font-black shadow-2xs'
                    : 'bg-slate-100/80 text-slate-700 hover:bg-slate-200/80 border border-slate-200'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-slate-100 text-xs">
          {[
            { id: 'all', label: isHindi ? 'सभी ऑर्डर' : 'All Orders', count: roleBookings.length, icon: 'receipt_long' },
            {
              id: 'locked',
              label: isWorker
                ? isHindi ? 'सक्रिय / एस्क्रो में' : 'Active / Escrow Held'
                : isHindi ? 'एस्क्रो में सुरक्षित' : 'Held in Escrow',
              count: roleBookings.filter((b) => b.status === 'escrow_locked').length,
              icon: 'lock_clock',
            },
            {
              id: 'otp_refused',
              label: isHindi ? 'साक्ष्य / OTP विवाद' : 'Proof / OTP Refusal',
              count: roleBookings.filter((b) => b.status === 'otp_refused').length,
              icon: 'shield_with_heart',
            },
            {
              id: 'completed',
              label: isHindi ? 'बैंक में 100% भुगतान' : '100% Paid to Bank',
              count: roleBookings.filter((b) => b.status === 'released').length,
              icon: 'verified',
            },
            {
              id: 'refunded',
              label: isHindi ? '100% धनवापसी' : '100% Refunded',
              count: roleBookings.filter((b) => b.status === 'refunded').length,
              icon: 'currency_exchange',
            },
            {
              id: 'disputed',
              label: isHindi ? 'मध्यस्थता में' : 'In Mediation',
              count: roleBookings.filter((b) => b.status === 'disputed').length,
              icon: 'gavel',
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all shrink-0 active:scale-95 flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-slate-100/80 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">{tab.icon}</span>
              <span>{tab.label}</span>
              <span
                className={`text-[10px] font-mono font-black px-1.5 py-0.2 rounded-full ${
                  activeTab === tab.id ? 'bg-white text-primary' : 'bg-slate-200 text-slate-800'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Modern Responsive Order Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredBookings.length === 0 ? (
          <div className="col-span-full text-center py-14 bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm flex flex-col items-center">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <span className="material-symbols-outlined text-3xl">receipt_long</span>
            </div>
            <h3 className="font-bold text-slate-900 text-lg">
              {isHindi ? 'आपके फिल्टर से कोई ऑर्डर मेल नहीं खाया' : 'No job orders match your filter'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mt-1">
              {searchQuery
                ? isHindi
                  ? `"${searchQuery}" से मेल खाता कोई ऑर्डर नहीं मिला।`
                  : `No orders matching "${searchQuery}". Try clearing your search term or tab filters.`
                : isWorker
                ? isHindi
                  ? 'नए कार्य प्राप्त करने के लिए वर्कर हब में ऑन-ड्यूटी टॉगल ऑन रखें।'
                  : 'Keep your On-Duty toggle active in Worker Hub to receive instant localized job dispatches.'
                : isHindi
                  ? 'सत्यापित सहकारी तकनीशियन 100% एस्क्रो सुरक्षा और 0% कमीशन पर बुक करें।'
                  : 'Book a certified cooperative technician with 100% escrow protection and 0% platform surcharge.'}
            </p>
            <div className="flex items-center gap-2 mt-4">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveTab('all');
                    setSelectedCategory('all');
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all border border-slate-200"
                >
                  {isHindi ? 'फ़िल्टर हटाएं' : 'Clear Filters'}
                </button>
              )}
              <button
                type="button"
                onClick={() => resetBookingsToSample()}
                className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all"
              >
                {isHindi ? 'सैंपल ऑर्डर लोड करें' : 'Load Sample Orders'}
              </button>
            </div>
          </div>
        ) : (
          filteredBookings.map((b) => {
            const isLocked = b.status === 'escrow_locked';
            const isOtpRefused = b.status === 'otp_refused';
            const isDisputed = b.status === 'disputed';
            const isRefunded = b.status === 'refunded';
            const isReleased = b.status === 'released';

            const categoryIcon =
              b.category === 'plumbing'
                ? 'plumbing'
                : b.category === 'appliance'
                ? 'mode_fan'
                : b.category === 'cleaning'
                ? 'cleaning_services'
                : 'electric_bolt';

            return (
              <article
                key={b.id}
                className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/90 flex flex-col justify-between gap-4 hover:border-primary/40 hover:shadow-md transition-all duration-200"
              >
                {/* Header Row: Category Badge + Order Number + Status Pill */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2.5">
                    <span className="w-9 h-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">{categoryIcon}</span>
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-on-surface">
                          {isHindi ? `ऑर्डर #${b.id}` : `Order #${b.id}`}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant">
                          {b.category || (isHindi ? 'सेवा' : 'Service')}
                        </span>
                      </div>
                      <span className="text-[11px] text-on-surface-variant block mt-0.5">
                        {b.bookingDate} • {b.timeSlot}
                      </span>
                    </div>
                  </div>

                  {/* Clean Status Pill */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black ${
                      isDisputed
                        ? 'bg-rose-100 text-rose-900 border border-rose-200'
                        : isRefunded
                        ? 'bg-blue-100 text-blue-900 border border-blue-200'
                        : isLocked
                        ? 'bg-amber-100 text-amber-950 border border-amber-300 animate-pulse'
                        : 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {isDisputed
                        ? 'gavel'
                        : isRefunded
                        ? 'currency_exchange'
                        : isLocked
                        ? 'lock_clock'
                        : 'task_alt'}
                    </span>
                    <span>
                      {isDisputed
                        ? (isHindi ? 'मध्यस्थता में' : 'In Mediation')
                        : isRefunded
                        ? (isHindi ? '100% धनवापसी' : '100% Refunded')
                        : isLocked
                        ? (isHindi ? 'एस्क्रो में सुरक्षित' : 'Escrow Held')
                        : (isHindi ? 'बैंक में 100% भुगतान' : '100% Paid to Bank')}
                    </span>
                  </span>
                </div>

                {/* Service Title, Counterparty Profile & Price */}
                <div className="flex flex-col gap-2.5 pt-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h2 className="font-extrabold text-base text-on-surface leading-snug">
                        {b.serviceTitle}
                      </h2>

                      {/* Counterparty Identity Block */}
                      <div className="flex items-center gap-2 mt-2">
                        {isWorker ? (
                          // Customer representation for worker view
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-full bg-surface-container-high text-primary font-black text-[11px] flex items-center justify-center shrink-0 border border-surface-variant/40">
                              {b.customerInitials || getInitials(b.customerName)}
                            </span>
                            <div className="text-xs">
                              <span className="font-bold text-on-surface block">
                                {b.customerName || 'Priya Sharma'}
                              </span>
                              {b.customerPhone && (
                                <span className="text-[10px] text-on-surface-variant font-mono">
                                  {b.customerPhone}
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          // Technician representation for customer view
                          <div className="flex items-center gap-2">
                            <img
                              src={b.workerAvatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80'}
                              alt={b.workerName}
                              className="w-7 h-7 rounded-full object-cover border border-surface-variant/40 shrink-0"
                            />
                            <div className="text-xs">
                              <span className="font-bold text-on-surface block">
                                {b.workerName}
                              </span>
                              <span className="text-[10px] text-emerald-800 font-bold block">
                                {b.workerTrade}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Pricing Box */}
                    <div className="text-right shrink-0">
                      <div className="text-2xl font-black text-primary tracking-tight">
                        ₹{b.labourAmount || b.totalEscrow}
                      </div>
                      <span className="inline-block text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 mt-0.5">
                        {isHindi ? '0% कमीशन कट' : '0% Fee Cut'}
                      </span>
                    </div>
                  </div>

                  {/* Location Pin */}
                  <div className="flex items-center gap-1.5 text-xs text-on-surface-variant pt-1">
                    <span className="material-symbols-outlined text-primary text-[16px] shrink-0">
                      location_on
                    </span>
                    <span className="truncate">{b.address}</span>
                  </div>

                  {/* Customer Review Quote (if completed) */}
                  {b.feedback && (
                    <div className="bg-surface-container-low p-2.5 rounded-xl border border-surface-variant/30 text-xs text-on-surface-variant italic flex items-start gap-1.5">
                      <span className="material-symbols-outlined text-[15px] text-amber-500 shrink-0">
                        star
                      </span>
                      <span>"{b.feedback}"</span>
                    </div>
                  )}
                </div>

                {/* Status-Specific Interactive Action Strip */}

                {/* 1. If Escrow Locked (Active Job) */}
                {isLocked && (
                  <div className="bg-amber-500/10 p-3.5 sm:p-4 rounded-2xl border border-amber-500/30 flex flex-col gap-3">
                    {!isWorker ? (
                      // Customer Active Job View
                      <>
                        {/* Live GPS Track Button */}
                        <button
                          type="button"
                          onClick={() => openLiveTracking(b)}
                          className="w-full h-11 bg-slate-950 hover:bg-slate-900 text-white rounded-xl font-bold text-xs flex items-center justify-between px-3.5 shadow-xs active:scale-95 transition-all border border-slate-700 group"
                        >
                          <div className="flex items-center gap-2">
                            <span className="flex h-2.5 w-2.5 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                            </span>
                            <span className="text-amber-300 font-extrabold">{isHindi ? 'लाइव जीपीएस रूट' : 'LIVE GPS ROUTE'}</span>
                            <span className="text-slate-300 font-normal">| {isHindi ? 'आगमन ~11 मिनट' : 'ETA ~11 mins'}</span>
                          </div>
                          <div className="flex items-center gap-1 text-white group-hover:translate-x-1 transition-transform">
                            <span>{isHindi ? 'नक्शा खोलें' : 'Open Map'}</span>
                            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                          </div>
                        </button>

                        {/* PIN Strip */}
                        <div className="flex items-center justify-between pt-1 border-t border-amber-500/20">
                          <div>
                            <span className="text-[10px] font-black uppercase text-amber-950 block">
                              {isHindi ? '4-अंकीय गुप्त एस्क्रो रिलीज पिन' : '4-Digit Escrow Release PIN'}
                            </span>
                            <span className="text-xs text-amber-900/90">
                              {isHindi ? 'काम पूरा होने व संतुष्ट होने के बाद ही तकनीशियन को दें।' : 'Share with technician only after service is completed.'}
                            </span>
                          </div>
                          <span className="text-xl font-black text-amber-950 tracking-widest bg-white px-3.5 py-1 rounded-xl border border-amber-400 shadow-2xs font-mono">
                            {b.releaseOtp}
                          </span>
                        </div>

                        {/* Customer Actions */}
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              releaseEscrow(b.id);
                              soundEffects.playCashPayoutChime();
                            }}
                            className="flex-1 h-10 bg-primary hover:bg-primary-container text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all"
                          >
                            <span className="material-symbols-outlined text-[16px]">verified</span>
                            <span>{isHindi ? 'भुगतान रिलीज करें (डेमो)' : 'Release Payment (Simulate)'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDisputeModalBooking(b)}
                            className="px-3.5 h-10 bg-error/10 hover:bg-error/20 text-error rounded-xl font-bold text-xs border border-error/20 flex items-center justify-center gap-1 active:scale-95 transition-all"
                          >
                            <span className="material-symbols-outlined text-[16px]">gavel</span>
                            <span>{isHindi ? 'विवाद' : 'Dispute'}</span>
                          </button>
                        </div>

                        {/* Customer Fallback Actions: Reassign Standby Worker or Instant Refund */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-amber-500/20 text-xs">
                          <button
                            type="button"
                            onClick={() => {
                              setReassignModalBooking(b);
                              soundEffects.playRadarBlip();
                            }}
                            className="py-2 px-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 font-bold text-indigo-900 flex items-center justify-center gap-1 text-[11px] transition-colors active:scale-95 shadow-2xs"
                          >
                            <span className="material-symbols-outlined text-[15px] text-indigo-700">swap_horiz</span>
                            <span>{isHindi ? 'कारीगर नहीं आया? दूसरा भेजें' : 'Worker Delayed? Reassign Peer'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setCancelModalBooking(b)}
                            className="py-2 px-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 font-bold text-red-700 flex items-center justify-center gap-1 text-[11px] transition-colors active:scale-95 shadow-2xs"
                          >
                            <span className="material-symbols-outlined text-[15px]">cancel</span>
                            <span>{isHindi ? 'रद्द करें व 100% रिफंड' : 'Cancel & 100% Refund'}</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      // Worker Active Job View (Direct Contact, Landmark & PIN Claim)
                      <div className="flex flex-col gap-3">
                        {/* Customer Doorstep Address & Calling Card */}
                        <div className="p-3 bg-white rounded-2xl border border-amber-300 shadow-2xs flex flex-col gap-2 text-xs">
                          <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                              <span className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                                {b.customerInitials || 'PS'}
                              </span>
                              <div>
                                <span className="font-extrabold text-slate-900 block leading-tight">
                                  {b.customerName || 'Priya Sharma'}
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  {b.customerPhone || '+91 98765 43210'}
                                </span>
                              </div>
                            </div>

                            {/* Direct Communication Buttons */}
                            <div className="flex items-center gap-1.5">
                              <a
                                href={`tel:${b.customerPhone || '9876543210'}`}
                                onClick={(e) => {
                                  soundEffects.playSuccessChime();
                                }}
                                className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-2xs active:scale-95 transition-all"
                              >
                                <span className="material-symbols-outlined text-[14px]">call</span>
                                <span>{isHindi ? 'कॉल करें' : 'Call'}</span>
                              </a>
                              <a
                                href={`https://wa.me/${(b.customerPhone || '919876543210').replace(/\D/g, '')}?text=Namaste%20${encodeURIComponent(b.customerName || 'Customer')}%20ji,%20I%20am%20${encodeURIComponent(b.workerName || 'technician')}%20from%20SAHYOG.%20I%20have%20reached%20your%20building.`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-[11px] flex items-center gap-1 shadow-2xs active:scale-95 transition-all"
                              >
                                <span className="material-symbols-outlined text-[14px]">chat</span>
                                <span>WhatsApp</span>
                              </a>
                            </div>
                          </div>

                          {/* House No, Landmark & Entry Notes */}
                          <div className="space-y-1 text-[11px] text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-200/80">
                            <div className="flex items-start gap-1">
                              <span className="material-symbols-outlined text-[15px] text-primary shrink-0 mt-0.5">home_pin</span>
                              <span className="font-bold text-slate-900">
                                {b.houseNo || 'Flat #402, 4th Floor, Shanti Enclave'}, {b.address}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-slate-600 pl-4">
                              <span className="font-bold text-amber-900">{isHindi ? 'लैंडमार्क:' : 'Landmark:'}</span>
                              <span>{b.landmark || 'Near Shiv Mandir / Opp Bank ATM'}</span>
                            </div>
                            <div className="flex items-center gap-1 text-slate-600 pl-4">
                              <span className="font-bold text-indigo-900">{isHindi ? 'गेट निर्देश:' : 'Gate Notes:'}</span>
                              <span className="italic">"{b.entryNotes || 'Press Bell #402, tell guard technician is from SAHYOG'}"</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-amber-950 font-bold">
                          <span className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[18px] text-amber-700 shrink-0">
                              lock_clock
                            </span>
                            <span>
                              {isHindi ? `₹${b.labourAmount} आरबीआई एस्क्रो तिजोरी में सुरक्षित` : `₹${b.labourAmount} in RBI Escrow Vault`}
                            </span>
                          </span>
                          <span className="text-[11px] text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded-md">
                            {isHindi ? 'ग्राहक से 4-अंक पिन मांगें' : 'Ask customer for PIN'}
                          </span>
                        </div>

                        {/* In-Card PIN Claim Bar */}
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            maxLength={4}
                            placeholder={isHindi ? "4-अंक पिन दर्ज करें" : "Enter 4-Digit PIN"}
                            value={pinInputs[b.id] || ''}
                            onChange={(e) =>
                              setPinInputs((prev) => ({
                                ...prev,
                                [b.id]: e.target.value.replace(/\D/g, ''),
                              }))
                            }
                            className="w-36 h-10 px-3 text-center tracking-widest font-mono font-black text-sm bg-white rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-on-surface placeholder:text-outline/60"
                          />
                          <button
                            type="button"
                            onClick={() => handleWorkerPinClaim(b.id, b.releaseOtp)}
                            className="flex-1 h-10 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all"
                          >
                            <span className="material-symbols-outlined text-[16px]">verified</span>
                            <span>{isHindi ? `दावा करें ₹${b.labourAmount}` : `Claim ₹${b.labourAmount}`}</span>
                          </button>
                        </div>

                        {/* Feedback message if PIN entered */}
                        {pinFeedback[b.id] && (
                          <div
                            className={`text-xs p-2 rounded-xl font-bold ${
                              pinFeedback[b.id].type === 'success'
                                ? 'bg-emerald-100 text-emerald-900'
                                : 'bg-rose-100 text-rose-900'
                            }`}
                          >
                            {pinFeedback[b.id].text}
                          </div>
                        )}

                        {/* Secondary Worker Action: Report OTP Refusal with Photo Proof */}
                        <button
                          type="button"
                          onClick={() => setOtpRefusalModalBooking(b)}
                          className="w-full py-2 px-3 rounded-xl bg-amber-100/90 hover:bg-amber-200 border border-amber-300 font-bold text-amber-950 flex items-center justify-center gap-1.5 text-xs transition-colors active:scale-95 shadow-2xs"
                        >
                          <span className="material-symbols-outlined text-[16px] text-amber-800">shield_with_heart</span>
                          <span>
                            {isHindi
                              ? 'ग्राहक ने OTP नहीं दिया? (साक्ष्य व दावा जमा करें)'
                              : 'Customer Refused OTP? (Submit Proof of Work)'}
                          </span>
                        </button>

                        {/* Worker Action Buttons */}
                        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-amber-500/20 text-xs">
                          <button
                            type="button"
                            onClick={() => openLiveTracking(b)}
                            className="py-2 px-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold flex items-center justify-center gap-1 text-[11px] active:scale-95 transition-all"
                          >
                            <span className="material-symbols-outlined text-[15px] text-amber-300">navigation</span>
                            <span>{isHindi ? 'रूट जीपीएस देखें' : 'Open Route GPS'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setReassignModalBooking(b)}
                            className="py-2 px-2.5 rounded-xl bg-white hover:bg-amber-100/60 border border-amber-300 font-bold text-amber-950 flex items-center justify-center gap-1 text-[11px] active:scale-95 transition-all"
                          >
                            <span className="material-symbols-outlined text-[15px] text-amber-800">swap_horiz</span>
                            <span>{isHindi ? 'सहयोगी को सौंपें' : 'Handover to Peer'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. If Released / Completed */}
                {isReleased && (
                  <div className="pt-3 border-t border-surface-variant/30 flex flex-col gap-2.5 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-emerald-900 font-bold">
                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[16px]">check</span>
                        </span>
                        <div>
                          <span className="block text-on-surface font-extrabold">
                            {isHindi ? `₹${b.labourAmount} 100% मेहनताना बैंक में क्रेडिट` : `₹${b.labourAmount} 100% Remuneration Credited`}
                          </span>
                          <span className="text-[11px] text-emerald-700 font-mono">
                            {b.settlementRef || (isHindi ? 'सीधा बैंक सेटलमेंट (UTR #CB-994102)' : 'Direct Bank Settlement (UTR #CB-994102)')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        {!isWorker && !b.review && (
                          <button
                            type="button"
                            onClick={() => {
                              setReviewModalBooking(b);
                              soundEffects.playSuccessChime();
                            }}
                            className="px-3.5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 rounded-xl text-xs font-black flex items-center gap-1.5 active:scale-95 transition-all shadow-xs"
                          >
                            <span className="material-symbols-outlined text-[16px] material-symbols-fill">star</span>
                            <span>{isHindi ? 'रेटिंग व समीक्षा दें' : 'Rate & Review'}</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setInvoiceModalBooking(b);
                            soundEffects.playSuccessChime();
                          }}
                          className="px-3.5 py-2 bg-surface-container-low hover:bg-surface-container border border-surface-variant/40 rounded-xl text-xs font-bold text-primary flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-2xs"
                        >
                          <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                          <span>{isHindi ? 'टैक्स-फ्री रसीद' : 'Invoice'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Customer Review Summary if already reviewed */}
                    {b.review && (
                      <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200 flex flex-col gap-1.5 text-xs text-amber-950">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="text-[11px] font-bold text-amber-900 mr-1">
                              {isHindi ? 'आपकी समीक्षा:' : 'Your Rating:'}
                            </span>
                            {[...Array(b.review.rating || 5)].map((_, i) => (
                              <span key={i} className="material-symbols-outlined text-[16px] text-amber-500 material-symbols-fill">star</span>
                            ))}
                            <span className="font-black text-amber-900 ml-1">({b.review.rating}/5)</span>
                          </div>
                          {!isWorker && (
                            <button
                              type="button"
                              onClick={() => setReviewModalBooking(b)}
                              className="text-[11px] font-bold text-primary hover:underline flex items-center gap-0.5"
                            >
                              <span className="material-symbols-outlined text-[13px]">edit</span>
                              <span>{isHindi ? 'संपादित करें' : 'Edit'}</span>
                            </button>
                          )}
                        </div>
                        {b.review.comment && (
                          <p className="text-[11px] text-slate-700 italic">"{b.review.comment}"</p>
                        )}
                        {b.review.tags && b.review.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-0.5">
                            {b.review.tags.map((tag, idx) => (
                              <span key={idx} className="text-[9px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md border border-amber-200">
                                {tag}
                              </span>
                            ))}
                            {b.review.tip > 0 && (
                              <span className="text-[9px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md border border-emerald-200">
                                +₹{b.review.tip} Tip Paid ✓
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. If Refunded */}
                {isRefunded && (
                  <div className="pt-3 border-t border-surface-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-blue-900 font-bold">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[16px]">currency_exchange</span>
                      </span>
                      <div>
                        <span className="block text-on-surface font-extrabold">
                          {isHindi ? `₹${b.refundAmount || b.totalEscrow} 100% मूल यूपीआई में वापस` : `₹${b.refundAmount || b.totalEscrow} Refunded 100% to Source UPI`}
                        </span>
                        <span className="text-[11px] text-blue-700">
                          {b.cancellationReason || (isHindi ? 'रवाना होने से पहले रद्द (0% पेनल्टी)' : 'Cancelled before dispatch (0% penalty)')}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setInvoiceModalBooking(b);
                        soundEffects.playSuccessChime();
                      }}
                      className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-bold text-blue-900 flex items-center gap-1 transition-all self-start sm:self-auto"
                    >
                      <span className="material-symbols-outlined text-[15px]">receipt_long</span>
                      <span>{isHindi ? 'रिफंड रसीद' : 'Refund Receipt'}</span>
                    </button>
                  </div>
                )}

                {/* 4. If Disputed */}
                {isDisputed && (
                  <div className="p-3.5 bg-rose-50 rounded-2xl border-2 border-rose-300 text-xs text-rose-950 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[18px]">gavel</span>
                        </span>
                        <div>
                          <span className="font-extrabold text-xs sm:text-sm text-rose-950 block">
                            {b.wardAuditActive
                              ? isHindi ? 'वार्ड 112 कोऑर्डिनेटर लाइव वीडियो व स्पॉट जांच सक्रिय' : 'Ward 112 Coordinator Video & Site Audit Active'
                              : isHindi ? `सहकारी मध्यस्थता सक्रिय: ${b.disputeReason}` : `Cooperative Mediation Active: ${b.disputeReason}`}
                          </span>
                          <span className="text-[11px] text-rose-800 font-medium">
                            {b.disputeReason}
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] font-black uppercase bg-rose-200 text-rose-900 px-2 py-0.5 rounded-md border border-rose-300 shrink-0">
                        Escrow Frozen
                      </span>
                    </div>

                    {b.wardAuditActive && (
                      <div className="p-3 bg-white rounded-xl border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80"
                            alt="Warden"
                            className="w-10 h-10 rounded-xl object-cover border border-rose-300 shrink-0"
                          />
                          <div>
                            <span className="font-extrabold text-slate-900 text-xs block">
                              Assigned Warden: Rajendra Shukla
                            </span>
                            <span className="text-[11px] text-slate-500">
                              Ward 112 • 0.6 km away • Phone: 94151 88201
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setWardAuditModalBooking(b)}
                            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-xs active:scale-95 transition-all"
                          >
                            <span className="material-symbols-outlined text-[16px]">videocam</span>
                            <span>{isHindi ? '2-मिनट वीडियो कॉल शुरू करें' : 'Open 2-Min Video Audit'}</span>
                          </button>
                        </div>
                      </div>
                    )}

                    <p className="text-[11px] text-rose-800 leading-relaxed">
                      {isHindi
                        ? 'एस्क्रो राशि सहकारी तिजोरी में सुरक्षित रूप से फ्रीज है। ऑटो-रिलीज टाइमर रोक दिया गया है।'
                        : 'Escrow funds safely frozen in cooperative vault. Auto-release timer has been stopped.'}
                    </p>
                  </div>
                )}

                {/* 5. If OTP Refused (Worker Proof-of-Work Protection Flow) */}
                {isOtpRefused && (
                  <div className="p-3.5 bg-gradient-to-br from-amber-50 to-orange-50/80 rounded-2xl border-2 border-amber-400 text-xs text-amber-950 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-bold">
                          <span className="material-symbols-outlined text-[18px]">shield_with_heart</span>
                        </span>
                        <div>
                          <span className="font-extrabold text-xs sm:text-sm text-amber-950 block">
                            {isHindi ? 'साक्ष्य-आधारित एस्क्रो दावा (2-घंटे ऑटो-रिलीज सक्रिय)' : 'Proof-Based Claim (2-Hour Auto-Release Active)'}
                          </span>
                          <span className="text-[11px] text-amber-800 font-medium">
                            Reason: <strong>{b.otpRefusalDetails?.reason || 'Customer refused PIN'}</strong>
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono font-black uppercase bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md border border-amber-300 shrink-0 animate-pulse">
                        ⏱️ 2h Timer Active
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-white/80 p-2.5 rounded-xl border border-amber-200">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                        <span className="material-symbols-outlined text-[15px] text-emerald-600">location_on</span>
                        <span>GPS Verified ({b.otpRefusalDetails?.gpsStayMinutes || 46} mins on-site)</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                        <span className="material-symbols-outlined text-[15px] text-primary">photo_camera</span>
                        <span>{b.otpRefusalDetails?.photos?.length || 2} Photos Attached ✓</span>
                      </div>
                    </div>

                    {!isWorker ? (
                      // Customer Action under OTP Refusal
                      <div className="space-y-2 pt-1 border-t border-amber-300">
                        <p className="text-[11px] text-amber-900 leading-snug">
                          {isHindi
                            ? `तकनीशियन ने कार्य पूर्णता का साक्ष्य सबमिट किया है। यदि आप संतुष्ट हैं तो नीचे दिए पिन से भुगतान रिलीज करें, अथवा 2 घंटे के भीतर वैध आपत्ति दर्ज करें।`
                            : `Technician has submitted GPS & photo proof of work completion. Please verify release PIN below or lodge a formal objection within 2 hours.`}
                        </p>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              releaseEscrow(b.id);
                              soundEffects.playCashPayoutChime();
                            }}
                            className="flex-1 h-10 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1 shadow-xs active:scale-95 transition-all"
                          >
                            <span className="material-symbols-outlined text-[15px]">verified</span>
                            <span>{isHindi ? `पिन ${b.releaseOtp} सत्यापित करें व भुगतान करें` : `Verify PIN ${b.releaseOtp} & Release`}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => triggerCustomerFakeClaimDispute(b.id, 'Worker submitted fake proof without completing work')}
                            className="px-3.5 h-10 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm"
                            title="Instant freeze escrow and summon Ward Coordinator for 2-min video audit"
                          >
                            <span className="material-symbols-outlined text-[16px]">videocam</span>
                            <span>{isHindi ? '🚨 फर्जी क्लेम - तुरंत रोकें व वीडियो जांच करें' : '🚨 Fake Claim / Incomplete (Stop & Video Audit)'}</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Worker View under OTP Refusal
                      <div className="pt-1 border-t border-amber-300 flex items-center justify-between text-[11px] text-amber-900">
                        <span className="flex items-center gap-1 font-bold">
                          <span className="material-symbols-outlined text-[15px] text-emerald-700">lock</span>
                          <span>₹{b.labourAmount} RBI एस्क्रो तिजोरी में सुरक्षित फ्रीज है</span>
                        </span>
                        <span className="text-amber-800 font-medium">
                          {isHindi ? 'चैप्टर एडमिन समीक्षा जारी' : 'Chapter Admin Reviewing'}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};
