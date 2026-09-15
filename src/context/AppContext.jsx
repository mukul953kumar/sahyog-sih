import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  WORKERS,
  CATEGORIES,
  INITIAL_BOOKINGS,
  INITIAL_NEGOTIATION_THREAD,
  COOPERATIVE_INFO,
  RESOLUTIONS,
  SUPPORTED_CITIES,
  DEMO_USERS,
  CITY_LIVE_ROUTES,
  WHOLESALE_HARDWARE_CATALOG,
} from '../data/hardcodedData';
import { TRANSLATIONS } from '../i18n/translations';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Language & Translation
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('sahyog_language') || 'en';
  });

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem('sahyog_language', lang);
  };

  const t = (key) => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || key;
  };

  // Location State (Default to Sultanpur as requested: "abhi main sultanpur me hu")
  const [selectedCity, setSelectedCity] = useState(() => {
    return localStorage.getItem('sahyog_city') || 'sultanpur';
  });

  const [selectedLocality, setSelectedLocality] = useState(() => {
    return localStorage.getItem('sahyog_locality') || 'Civil Lines, Golaghat';
  });

  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const activeCityConfig =
    SUPPORTED_CITIES.find((c) => c.id === selectedCity) || SUPPORTED_CITIES[0];

  const updateLocation = (cityId, localityName) => {
    setSelectedCity(cityId);
    setSelectedLocality(localityName);
    localStorage.setItem('sahyog_city', cityId);
    localStorage.setItem('sahyog_locality', localityName);

    // Switch active default worker to the first available in this city
    const cityWorkers = WORKERS.filter(
      (w) => w.city && w.city.toLowerCase() === cityId.toLowerCase()
    );
    if (cityWorkers.length > 0) {
      setSelectedWorkerId(cityWorkers[0].id);
    }
  };

  const dynamicCooperativeInfo = {
    ...COOPERATIVE_INFO,
    fullName: `SAHYOG ${activeCityConfig.name} Cooperative Services`,
    regNumber: activeCityConfig.regNumber,
    area: selectedLocality || activeCityConfig.defaultLocality,
    ward: activeCityConfig.ward,
    city: activeCityConfig.name,
    chapter: activeCityConfig.chapter,
  };

  // User Authentication & Role: 'customer' | 'worker' | 'admin'
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('sahyog_is_auth') === 'true';
  });

  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('sahyog_role') || 'customer';
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('sahyog_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved user', e);
      }
    }
    const role = localStorage.getItem('sahyog_role') || 'customer';
    return DEMO_USERS[role] || DEMO_USERS.customer;
  });

  // Navigation state - Default to 'login' when opening the app / unauthenticated so judges always see Login first
  const [currentView, setCurrentView] = useState(() => {
    const isAuth = localStorage.getItem('sahyog_is_auth') === 'true';
    if (!isAuth) return 'login';
    const role = localStorage.getItem('sahyog_role') || 'customer';
    if (role === 'worker') return 'worker-dashboard';
    if (role === 'admin') return 'admin-dashboard';
    return 'home';
  });

  const [selectedWorkerId, setSelectedWorkerId] = useState('awadhesh-sharma-sln');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState('distance'); // 'distance' | 'rating' | 'jobs'

  // Direct 1-Click Demo Login for Hackathon Judges / Evaluators
  const loginAsDemoUser = (demoKey = 'customer') => {
    const userProfile = DEMO_USERS[demoKey] || DEMO_USERS.customer;
    setCurrentUser(userProfile);
    setUserRole(userProfile.role);
    setIsAuthenticated(true);
    localStorage.setItem('sahyog_is_auth', 'true');
    localStorage.setItem('sahyog_user', JSON.stringify(userProfile));
    localStorage.setItem('sahyog_role', userProfile.role);

    if (userProfile.city) {
      setSelectedCity(userProfile.city);
      localStorage.setItem('sahyog_city', userProfile.city);
    }
    if (userProfile.locality) {
      setSelectedLocality(userProfile.locality);
      localStorage.setItem('sahyog_locality', userProfile.locality);
    }

    if (userProfile.role === 'worker') {
      setSelectedWorkerId('awadhesh-sharma-sln');
      setCurrentView('worker-dashboard');
    } else if (userProfile.role === 'admin') {
      setCurrentView('admin-dashboard');
    } else {
      setCurrentView('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Switch Role helper that updates context and navigates
  const switchRole = (newRole) => {
    const userProfile = DEMO_USERS[newRole] || {
      ...currentUser,
      role: newRole,
    };
    setCurrentUser(userProfile);
    setUserRole(newRole);
    localStorage.setItem('sahyog_role', newRole);
    localStorage.setItem('sahyog_user', JSON.stringify(userProfile));

    if (newRole === 'worker') {
      setSelectedWorkerId('awadhesh-sharma-sln');
      setCurrentView('worker-dashboard');
    } else if (newRole === 'admin') {
      setCurrentView('admin-dashboard');
    } else {
      setCurrentView('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Logout function that clears session and navigates back to login view
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('sahyog_is_auth');
    localStorage.removeItem('sahyog_user');
    setCurrentView('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Bookings list (with localStorage fallback)
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('sahyog_bookings_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved bookings', e);
      }
    }
    return INITIAL_BOOKINGS;
  });

  useEffect(() => {
    localStorage.setItem('sahyog_bookings_v2', JSON.stringify(bookings));
  }, [bookings]);

  const resetBookingsToSample = () => {
    setBookings(INITIAL_BOOKINGS);
    localStorage.setItem('sahyog_bookings_v2', JSON.stringify(INITIAL_BOOKINGS));
  };

  // Active negotiation thread
  const [negotiationThread, setNegotiationThread] = useState(() => {
    const saved = localStorage.getItem('sahyog_negotiation');
    return saved ? JSON.parse(saved) : INITIAL_NEGOTIATION_THREAD;
  });

  // Current agreed price for active checkout
  const [agreedLabourPrice, setAgreedLabourPrice] = useState(450);

  // Modals & Dialogs
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [successBookingModal, setSuccessBookingModal] = useState(null);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [eShramWorkerModal, setEShramWorkerModal] = useState(null);
  const [digiLockerWorkerModal, setDigiLockerWorkerModal] = useState(null);
  const [voiceSearchModalOpen, setVoiceSearchModalOpen] = useState(false);
  const [disputeModalBooking, setDisputeModalBooking] = useState(null);
  const [auditReportModalOpen, setAuditReportModalOpen] = useState(false);
  const [invoiceModalBooking, setInvoiceModalBooking] = useState(null);
  const [skillAssessmentModalWorker, setSkillAssessmentModalWorker] = useState(null);
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [reassignModalBooking, setReassignModalBooking] = useState(null);
  const [liveTrackingModalOpen, setLiveTrackingModalOpen] = useState(false);
  const [liveTrackingBooking, setLiveTrackingBooking] = useState(() => INITIAL_BOOKINGS[0] || null);

  const openLiveTracking = (booking = null) => {
    const targetBooking = booking || bookings.find((b) => b.status === 'escrow_locked') || bookings[0] || INITIAL_BOOKINGS[0];
    setLiveTrackingBooking(targetBooking);
    setLiveTrackingModalOpen(true);
  };

  const closeLiveTracking = () => {
    setLiveTrackingModalOpen(false);
  };

  // --- WORKER DASHBOARD STATE ---
  const [workerOnDuty, setWorkerOnDuty] = useState(true);
  const [workerEarnings, setWorkerEarnings] = useState({
    today: 1350,
    week: 8400,
    dividend: 1200,
    commissionCut: 0,
    jobsToday: 3,
  });

  const [incomingJobs, setIncomingJobs] = useState([
    {
      id: 'DISPATCH-409',
      customerName: 'Ananya Rao',
      address: 'Plot 45, 100ft Road, Indiranagar',
      trade: 'Electrical MCB Trip & Sparks',
      distance: '0.8 km',
      quote: 450,
      eta: '12 mins',
      status: 'pending',
    },
    {
      id: 'DISPATCH-412',
      customerName: 'Karthik Raja',
      address: 'Flat 104, Sunrise Heights, Domlur',
      trade: 'Ceiling Fan Replacement',
      distance: '1.4 km',
      quote: 300,
      eta: '25 mins',
      status: 'pending',
    },
  ]);

  // Worker claims 4-digit PIN to release payment
  const claimEscrowWithPin = (pinCode) => {
    const matchingBooking = bookings.find(
      (b) => b.releaseOtp === pinCode && b.status === 'escrow_locked'
    );

    if (matchingBooking) {
      setBookings((prev) =>
        prev.map((b) => {
          if (b.id === matchingBooking.id) {
            return {
              ...b,
              status: 'released',
              timeline: b.timeline.map((step) => ({ ...step, status: 'completed' })),
            };
          }
          return b;
        })
      );

      setWorkerEarnings((prev) => ({
        ...prev,
        today: prev.today + matchingBooking.labourAmount,
        week: prev.week + matchingBooking.labourAmount,
        jobsToday: prev.jobsToday + 1,
      }));

      return {
        success: true,
        message: `PIN Verified! ₹${matchingBooking.labourAmount} directly transferred to your Canara Bank account (100% direct, ₹0 commission).`,
      };
    } else {
      return {
        success: false,
        message: 'Invalid or already released PIN. Please ask customer to check their booking screen.',
      };
    }
  };

  const acceptIncomingJob = (jobId) => {
    setIncomingJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'accepted' } : j))
    );
  };

  const declineIncomingJob = (jobId) => {
    setIncomingJobs((prev) => prev.filter((j) => j.id !== jobId));
  };

  // --- DISPUTE & 100% REFUND FLOW ---
  const raiseDispute = (bookingId, reason) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          return {
            ...b,
            status: 'disputed',
            disputeReason: reason,
            disputeDate: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
        }
        return b;
      })
    );
  };

  const adminResolveDispute = (bookingId, resolutionType) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          return {
            ...b,
            status: resolutionType === 'refund_customer' ? 'refunded' : 'released',
            disputeResolution: resolutionType,
          };
        }
        return b;
      })
    );
  };

  // --- CUSTOMER CANCELLATION & INSTANT 100% ESCROW REFUND ---
  const cancelBooking = (bookingId, reason = 'Customer request', cancelFee = 0) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          const refundAmount = Math.max(0, b.totalEscrow - cancelFee);
          return {
            ...b,
            status: 'refunded',
            cancellationReason: reason,
            cancelFee,
            refundAmount,
            timeline: [
              ...b.timeline,
              {
                step: 5,
                title: cancelFee > 0
                  ? `Cancelled (${reason}) • ₹${refundAmount} refunded, ₹${cancelFee} fuel allowance to worker`
                  : `Booking Cancelled (${reason}) • ₹${refundAmount} 100% Instant Refund to UPI`,
                status: 'completed',
                time: 'Just now',
              },
            ],
          };
        }
        return b;
      })
    );
  };

  // --- COOPERATIVE GUILD PEER REASSIGNMENT / JOB SWITCH ---
  const reassignBooking = (bookingId, newWorker, handoverReason = 'Guild Peer Reassignment') => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          const updated = {
            ...b,
            workerId: newWorker.id,
            workerName: newWorker.name,
            workerTrade: `${newWorker.trade} • Co-Owner #${newWorker.memberId}`,
            workerAvatar: newWorker.detailAvatar || newWorker.avatar,
            workerPhone: newWorker.phone || '98765 43210',
            reassignedFrom: b.workerName,
            handoverReason,
            timeline: [
              ...b.timeline,
              {
                step: 2,
                title: `Auto-reassigned to Guild Peer ${newWorker.name} (${handoverReason})`,
                status: 'completed',
                time: 'Just now',
              },
            ],
          };
          if (liveTrackingBooking?.id === bookingId) {
            setLiveTrackingBooking(updated);
          }
          return updated;
        }
        return b;
      })
    );
  };

  // --- ADMIN DASHBOARD STATE (KYC QUEUE WITH SKILL ASSESSMENT) ---
  const [kycQueue, setKycQueue] = useState([
    {
      id: 'KYC-901',
      name: 'Suresh Nanjappa',
      trade: 'Wireman & Circuit Specialist',
      experience: '4 Yrs',
      verificationMethod: 'skill_assessment',
      eShramId: 'Not Available (Applied via Practical Demo)',
      digiLockerStatus: 'Non-Formal Tradesman (Grassroots)',
      policeCheck: 'Clear (HAL Station)',
      date: 'Today, 11:20 AM',
      status: 'pending',
      skillAssessment: {
        status: 'pending_review',
        practicalScore: '96/100',
        grade: 'Grade A (Master Wireman Review)',
        demoVideo: {
          title: 'Live 3-Phase MCB Wiring & Multi-meter Earthing Test',
          duration: '2:10 mins',
          recordedAt: 'Ward 112 Co-op Training Bench',
          thumbnail: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
          description: 'Suresh demonstrates safe troubleshooting of an industrial distribution board, testing earth pit resistance < 4 ohms with insulated gloves.',
          checklist: [
            'Live safety circuit isolation (Passed)',
            'Insulated tools protocol (Passed)',
            'Load test & voltage drop check (Passed)',
          ],
        },
        workshopProof: {
          shopName: 'Nanjappa Electricals & Motor Works',
          shopAddress: 'Shop #3, 2nd Cross, Old Madras Road, Indiranagar',
          photo: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
          toolsVerified: ['Fluke 101 Digital Multimeter', 'Rotary Hammer Drill', 'Insulated Pliers & Crimper', 'Megger Tester'],
          inspectedDate: 'Yesterday by Chapter Inspection Officer',
        },
        peerGuarantors: [
          { name: 'Ramesh Kumar', memberId: 'CK-410', role: 'Master Wireman Guarantor' },
          { name: 'Sunita Patil', memberId: 'CK-284', role: 'Chapter Executive Member' },
        ],
      },
    },
    {
      id: 'KYC-902',
      name: 'Meena Bai',
      trade: 'Residential Deep Cleaning Lead',
      experience: '5 Yrs',
      verificationMethod: 'skill_assessment',
      eShramId: 'Not Available (Applied via Practical Demo)',
      digiLockerStatus: 'Community Peer Vouched',
      policeCheck: 'Clear (Indiranagar Station)',
      date: 'Today, 02:45 PM',
      status: 'pending',
      skillAssessment: {
        status: 'pending_review',
        practicalScore: '98/100',
        grade: 'Grade A+ (Senior Sanitation Review)',
        demoVideo: {
          title: 'Chemical-Free Steam Tile Cleaning & Disinfection Demo',
          duration: '1:54 mins',
          recordedAt: 'Community Centre Kitchen',
          thumbnail: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80',
          description: 'Meena demonstrates commercial steam cleaning on hardened grime and grease traps without toxic acid or surface damage.',
          checklist: [
            'Non-acidic chemical safety standards (Passed)',
            'Appliance protection & masking (Passed)',
            'High-pressure steam sanitization (Passed)',
          ],
        },
        workshopProof: {
          shopName: 'Meena Professional Cleaning Gear Depot',
          shopAddress: 'Ward 112 Co-op Storage Hub, Domlur',
          photo: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&auto=format&fit=crop&q=80',
          toolsVerified: ['Karcher High-Pressure Steamer', 'Industrial Wet & Dry Vacuum', 'Bio-degradable Sanitizers'],
          inspectedDate: 'Today by Welfare Inspection Officer',
        },
        peerGuarantors: [
          { name: 'Sunita Patil', memberId: 'CK-284', role: 'Cleaning Guild Lead Guarantor' },
          { name: 'Ramesh Kumar', memberId: 'CK-410', role: 'Cooperative Co-Owner' },
        ],
      },
    },
    {
      id: 'KYC-903',
      name: 'Abdul Kalam',
      trade: 'Plumber & Water Motor Specialist',
      experience: '6 Yrs',
      verificationMethod: 'dpi_eshram',
      eShramId: 'e-Shram #6610-9944',
      digiLockerStatus: 'Verified (Govt ITI Plumber)',
      policeCheck: 'Clear (Ulsoor Station)',
      date: 'Yesterday',
      status: 'pending',
      skillAssessment: {
        status: 'verified',
        practicalScore: '95/100',
        grade: 'Grade A (ITI + Practical)',
        demoVideo: {
          title: 'Submersible Pump Overhaul & Capacitor Bench Test',
          duration: '2:05 mins',
          recordedAt: 'Ulsoor Sanitation Workshop',
          thumbnail: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80',
          description: 'Abdul demonstrates replacing worn impellers and testing capacitor draw under simulated water head.',
          checklist: ['Seal leakage check (Passed)', 'Electrical safety isolation (Passed)'],
        },
        workshopProof: {
          shopName: 'Kalam Plumbing & Motor Works',
          shopAddress: 'Near Ulsoor Lake, Ward 110, Bengaluru',
          photo: 'https://images.unsplash.com/photo-1542013936693-884638332954?w=600&auto=format&fit=crop&q=80',
          toolsVerified: ['Rothenberger Pipe Threader', 'Pressure Gauge Tester', 'Digital Clamp Meter'],
          inspectedDate: '18 Feb 2024',
        },
        peerGuarantors: [
          { name: 'Mohammad Arif', memberId: 'CK-312', role: 'Plumbing Guild Peer' },
        ],
      },
    },
  ]);

  const [workersList, setWorkersList] = useState(WORKERS);
  const [resolutionsList, setResolutionsList] = useState(RESOLUTIONS);

  const submitWorkerRegistration = ({
    name,
    phone,
    trade,
    tradeId,
    experience = '4 Yrs',
    locality,
    verificationMethod = 'skill_assessment',
    eShramId,
    workshopName,
    workshopAddress,
    demoVideo,
    toolsVerified,
    peerGuarantors,
    avatar,
  }) => {
    const kycId = `KYC-${Math.floor(1000 + Math.random() * 9000)}`;
    const newKycEntry = {
      id: kycId,
      name,
      trade: trade || 'Master Electrician & Wireman',
      tradeId: tradeId || 'electrical',
      experience: experience.includes('Yr') ? experience : `${experience} Yrs`,
      verificationMethod: verificationMethod || 'skill_assessment',
      eShramId: eShramId || (verificationMethod === 'dpi_eshram' ? `e-Shram #${Math.floor(1000+Math.random()*9000)}-${Math.floor(1000+Math.random()*9000)}` : 'Not Available (Applied via Practical Demo)'),
      digiLockerStatus: verificationMethod === 'dpi_eshram' ? 'Verified (Govt e-Shram API)' : 'Practical Bench Verified',
      policeCheck: 'Submitted (Local Station Audit)',
      date: 'Just now',
      status: 'pending',
      avatar: avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80',
      skillAssessment: {
        status: 'pending_review',
        practicalScore: '97/100',
        grade: 'Grade A+ (Live Bench Test Review)',
        demoVideo: demoVideo || {
          title: `Live Practical Guild Demo - ${trade || 'Technical Service'}`,
          duration: '2:15 mins',
          recordedAt: `${locality || activeCityConfig.name} Cooperative Trade Bench`,
          thumbnail: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
          description: `${name} demonstrates live troubleshooting, safety protocol isolation, and zero-leakage compliance.`,
          checklist: [
            'Live safety circuit isolation (Passed)',
            'Insulated tools protocol (Passed)',
            'Load test & voltage drop check (Passed)',
          ],
        },
        workshopProof: {
          shopName: workshopName || `${name} Works & Service Station`,
          shopAddress: workshopAddress || `${locality || 'Civil Lines'}, ${activeCityConfig.name}`,
          photo: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
          toolsVerified: toolsVerified || ['Fluke Multimeter', 'Rotary Hammer Drill', 'Insulated Pliers', 'Earthing Tester'],
          inspectedDate: 'Today by Chapter Inspection Officer',
        },
        peerGuarantors: peerGuarantors || [
          { name: 'Awadhesh Sharma', memberId: 'SLN-101', role: 'Master Wireman Guarantor' },
          { name: 'Ram Prasad Bind', memberId: 'SLN-108', role: 'Chapter Executive Member' },
        ],
      },
    };

    setKycQueue((prev) => [newKycEntry, ...prev]);
    return newKycEntry;
  };

  const approveWorkerKyc = (applicantId) => {
    setKycQueue((prev) =>
      prev.map((k) => (k.id === applicantId ? { ...k, status: 'approved' } : k))
    );

    const target = kycQueue.find((k) => k.id === applicantId);
    if (target) {
      const generatedMemberId = `SLN-${Math.floor(120 + Math.random() * 80)}`;
      const newWorkerObject = {
        id: `worker-${target.id.toLowerCase()}`,
        name: target.name,
        trade: target.trade,
        category: target.tradeId || (target.trade.toLowerCase().includes('plumb')
          ? 'plumbing'
          : target.trade.toLowerCase().includes('clean')
          ? 'cleaning'
          : target.trade.toLowerCase().includes('carpent')
          ? 'carpentry'
          : target.trade.toLowerCase().includes('ac')
          ? 'ac'
          : 'electrical'),
        city: selectedCity || 'sultanpur',
        memberId: generatedMemberId,
        chapter: `Sahyog ${activeCityConfig.name} Chapter`,
        memberSince: '2026',
        verified: true,
        isCoOwner: true,
        eShramId: target.eShramId,
        digiLockerVerified: true,
        rating: 5.0,
        reviewCount: 1,
        experienceYears: target.experience,
        jobsCompleted: 0,
        onTimeRate: '100%',
        responseTime: '10m',
        avatar: target.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80',
        detailAvatar: target.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80',
        distance: '0.9 km',
        area: `${selectedLocality || 'Civil Lines'}, ${activeCityConfig.name}`,
        coverageArea: `${selectedLocality || 'Civil Lines'} (within 8 km)`,
        availableNow: true,
        nextSlot: 'Today, 4:00 PM',
        baseQuote: 199,
        standardJobQuote: 450,
        bio: `Newly approved co-owner tradesperson (#${generatedMemberId}). Vouched by Guild peers with ${target.skillAssessment?.practicalScore || '97/100'} score.`,
        skillAssessment: target.skillAssessment,
        skills: ['Practical Skill Assessment Grade A+', 'ISI Safety Compliant', 'Co-op Warranty'],
        priceGuide: [
          { item: 'Standard Diagnostic & Inspection', price: '₹199', note: 'Co-op fixed rate' },
          { item: 'Standard Repair Service', price: '₹450', note: '100% direct labour' },
        ],
        reviews: [
          {
            user: 'Cooperative Chapter Audit',
            rating: 5,
            date: 'Today',
            comment: 'Practical skill bench test passed with Grade A+. Verified cooperative co-owner.',
          },
        ],
      };

      setWorkersList((prev) => [newWorkerObject, ...prev]);
    }
  };

  const rejectWorkerKyc = (applicantId) => {
    setKycQueue((prev) =>
      prev.map((k) => (k.id === applicantId ? { ...k, status: 'rejected' } : k))
    );
  };

  const publishResolution = (newRes) => {
    setResolutionsList((prev) => [newRes, ...prev]);
  };

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('sahyog_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('sahyog_negotiation', JSON.stringify(negotiationThread));
  }, [negotiationThread]);

  // Navigation helper
  const navigateTo = (view, payload = {}) => {
    if (payload.workerId) setSelectedWorkerId(payload.workerId);
    if (payload.category) setSelectedCategory(payload.category);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentWorker = WORKERS.find((w) => w.id === selectedWorkerId) || WORKERS[0];

  const submitCounterOffer = (amount, text = '') => {
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'customer',
      name: 'You',
      text: text || `Can you do it for ₹${amount}?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const workerResponse = {
      id: `msg-${Date.now() + 1}`,
      sender: 'worker',
      name: `${currentWorker.name.split(' ')[0]} (Worker)`,
      text: `Understood! I accept ₹${amount} with ISI certified materials and cooperative safety warranty.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const acceptedMsg = {
      id: `msg-${Date.now() + 2}`,
      sender: 'system',
      name: 'System',
      text: `Agreed ₹${amount}`,
      agreedPrice: amount,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setNegotiationThread((prev) => [...prev, newMsg, workerResponse, acceptedMsg]);
    setAgreedLabourPrice(amount);
  };

  const createBooking = ({
    worker = currentWorker,
    serviceTitle = 'Direct Service',
    address = `${selectedLocality}, ${activeCityConfig.name}`,
    timeSlot = 'Today, 4:00 PM – 5:00 PM',
    labourAmount = agreedLabourPrice,
    paymentMethod = 'UPI',
  }) => {
    const bookingId = `SHG-${Math.floor(1000 + Math.random() * 9000)}`;
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    const workerVehicle = worker.vehicle || {
      type: 'Electric Scooter',
      model: 'Hero Electric NYX',
      regNumber: `UP-64-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${Math.floor(1000 + Math.random() * 9000)}`,
      speedKmH: 28,
      batteryPercent: 90,
      helmetVerified: true,
    };

    const newBooking = {
      id: bookingId,
      workerId: worker.id,
      workerName: worker.name,
      workerTrade: `${worker.trade} • Co-Owner #${worker.memberId}`,
      workerAvatar: worker.detailAvatar || worker.avatar,
      serviceTitle,
      address,
      timeSlot,
      labourAmount,
      platformCommission: 0,
      insuranceAmount: 10,
      totalEscrow: labourAmount + 10,
      status: 'escrow_locked',
      releaseOtp: otp,
      paymentMethod,
      city: selectedCity || 'sultanpur',
      workerPhone: worker.phone || '98123 45678',
      vehicle: workerVehicle,
      liveTracking: {
        active: true,
        etaMins: 11,
        distanceKm: 1.8,
        speedKmH: workerVehicle.speedKmH || 28,
        currentStep: 'en_route',
        routeCity: selectedCity || 'sultanpur',
        progressPercent: 15,
      },
      bookingDate: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      timeline: [
        { step: 1, title: 'Escrow Deposit Held', status: 'completed', time: 'Just now' },
        { step: 2, title: 'Technician Dispatched (Live GPS En Route)', status: 'completed', time: 'ETA 11m' },
        { step: 3, title: 'Service in Progress', status: 'current', time: timeSlot },
        { step: 4, title: 'Release 4-Digit OTP', status: 'pending', time: 'After inspection' },
      ],
    };

    setBookings((prev) => [newBooking, ...prev]);
    setLiveTrackingBooking(newBooking);
    setSuccessBookingModal(newBooking);
    return newBooking;
  };

  const releaseEscrow = (bookingId) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          return {
            ...b,
            status: 'released',
            timeline: b.timeline.map((step) => ({ ...step, status: 'completed' })),
          };
        }
        return b;
      })
    );
  };

  const handleLogin = (phone, role = 'customer', name = 'Cooperative Member') => {
    const baseDemo = DEMO_USERS[role] || DEMO_USERS.customer;
    const user = {
      ...baseDemo,
      name: name || baseDemo.name,
      phone: phone || baseDemo.phone,
      role,
    };
    setCurrentUser(user);
    setUserRole(role);
    setIsAuthenticated(true);
    localStorage.setItem('sahyog_is_auth', 'true');
    localStorage.setItem('sahyog_user', JSON.stringify(user));
    localStorage.setItem('sahyog_role', role);

    if (role === 'worker') {
      setSelectedWorkerId('awadhesh-sharma-sln');
      setCurrentView('worker-dashboard');
    } else if (role === 'admin') {
      setCurrentView('admin-dashboard');
    } else {
      setCurrentView('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentView,
        setCurrentView,
        navigateTo,
        selectedWorkerId,
        setSelectedWorkerId,
        currentWorker,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        availableOnly,
        setAvailableOnly,
        sortBy,
        setSortBy,
        isAuthenticated,
        setIsAuthenticated,
        userRole,
        setUserRole,
        switchRole,
        currentUser,
        setCurrentUser,
        loginAsDemoUser,
        handleLogin,
        handleLogout,
        demoUsers: DEMO_USERS,
        bookings,
        setBookings,
        resetBookingsToSample,
        createBooking,
        releaseEscrow,
        negotiationThread,
        setNegotiationThread,
        submitCounterOffer,
        agreedLabourPrice,
        setAgreedLabourPrice,
        // Modals
        emergencyModalOpen,
        setEmergencyModalOpen,
        successBookingModal,
        setSuccessBookingModal,
        roleModalOpen,
        setRoleModalOpen,
        eShramWorkerModal,
        setEShramWorkerModal,
        digiLockerWorkerModal,
        setDigiLockerWorkerModal,
        voiceSearchModalOpen,
        setVoiceSearchModalOpen,
        disputeModalBooking,
        setDisputeModalBooking,
        auditReportModalOpen,
        setAuditReportModalOpen,
        invoiceModalBooking,
        setInvoiceModalBooking,
        skillAssessmentModalWorker,
        setSkillAssessmentModalWorker,
        cancelModalBooking,
        setCancelModalBooking,
        reassignModalBooking,
        setReassignModalBooking,
        cancelBooking,
        reassignBooking,
        wholesaleCatalog: WHOLESALE_HARDWARE_CATALOG,
        // Disputes & Refunds
        raiseDispute,
        adminResolveDispute,
        // Worker state
        workerOnDuty,
        setWorkerOnDuty,
        workerEarnings,
        setWorkerEarnings,
        incomingJobs,
        setIncomingJobs,
        claimEscrowWithPin,
        acceptIncomingJob,
        declineIncomingJob,
        // Admin state
        kycQueue,
        setKycQueue,
        submitWorkerRegistration,
        approveWorkerKyc,
        rejectWorkerKyc,
        resolutionsList,
        setResolutionsList,
        publishResolution,
        // Live Map Tracking
        liveTrackingModalOpen,
        setLiveTrackingModalOpen,
        liveTrackingBooking,
        setLiveTrackingBooking,
        openLiveTracking,
        closeLiveTracking,
        cityLiveRoutes: CITY_LIVE_ROUTES,
        // Location State
        selectedCity,
        setSelectedCity,
        selectedLocality,
        setSelectedLocality,
        locationModalOpen,
        setLocationModalOpen,
        updateLocation,
        supportedCities: SUPPORTED_CITIES,
        activeCityConfig,
        cooperativeInfo: dynamicCooperativeInfo,
        workers: workersList,
        setWorkersList,
        categories: CATEGORIES,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
