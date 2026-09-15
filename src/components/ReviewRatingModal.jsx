import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { soundEffects } from '../utils/soundEffects';

export const ReviewRatingModal = () => {
  const {
    reviewModalBooking,
    setReviewModalBooking,
    submitBookingReview,
    language,
  } = useApp();

  const isHindi = language === 'hi';

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState(['Expert Workmanship', 'On-Time Arrival']);
  const [comment, setComment] = useState('');
  const [selectedTip, setSelectedTip] = useState(50);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!reviewModalBooking) return null;

  const booking = reviewModalBooking;

  const availableTags = [
    { id: 'On-Time Arrival', label: isHindi ? '⚡ समय पर आगमन (On-Time)' : '⚡ On-Time Arrival' },
    { id: 'Expert Workmanship', label: isHindi ? '🛠️ कुशल व पक्का काम (Expert Work)' : '🛠️ Expert Workmanship' },
    { id: 'Polite Behavior', label: isHindi ? '😊 विनम्र व शालीन व्यवहार' : '😊 Polite & Courteous' },
    { id: 'Clean Work Site', label: isHindi ? '🧼 सफाई से काम किया' : '🧼 Cleaned Up Site' },
    { id: 'Fair Pricing', label: isHindi ? '💰 पारदर्शी व सही दाम' : '💰 Transparent Pricing' },
    { id: 'Safety Standards', label: isHindi ? '🛡️ सुरक्षा मानकों का पालन' : '🛡️ Followed Safety Rules' },
  ];

  const ratingLabels = {
    1: isHindi ? 'बहुत निराशाजनक (1/5)' : 'Needs Improvement (1/5)',
    2: isHindi ? 'औसत से कम (2/5)' : 'Below Average (2/5)',
    3: isHindi ? 'संतोषजनक काम (3/5)' : 'Satisfactory Service (3/5)',
    4: isHindi ? 'बहुत बढ़िया काम (4/5)' : 'Very Satisfied (4/5)',
    5: isHindi ? 'अतिउत्कृष्ट सेवा! (5/5)' : 'Outstanding Service! (5/5)',
  };

  const toggleTag = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    soundEffects.playSuccessChime();

    submitBookingReview(booking.id, {
      rating,
      comment: comment.trim() || (isHindi ? 'शानदार काम! समय पर आए और सफाई से पूरा काम किया।' : 'Flawless service! Arrived on time and solved the issue quickly.'),
      tags: selectedTags,
      tip: selectedTip,
      date: 'Today, Just now',
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setReviewModalBooking(null);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-md bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border-2 border-primary/30 flex flex-col gap-4 my-auto relative">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 border border-amber-300 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl material-symbols-fill">
                star
              </span>
            </span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                {isHindi ? 'सेवा रेटिंग व प्रतिक्रिया' : 'Rating & Review'}
              </span>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 mt-0.5">
                {isHindi ? 'तकनीशियन के काम की समीक्षा करें' : 'Rate Your Service Experience'}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setReviewModalBooking(null)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col items-center text-center gap-3 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg animate-bounce">
              <span className="material-symbols-outlined text-3xl">sentiment_very_satisfied</span>
            </div>
            <div>
              <h4 className="font-black text-base text-emerald-950">
                {isHindi ? 'समीक्षा व रेटिंग दर्ज हुई!' : 'Review Submitted Successfully!'}
              </h4>
              <p className="text-xs text-emerald-800 mt-1 max-w-sm font-medium">
                {isHindi
                  ? `आपकी रेटिंग से तकनीशियन ${booking.workerName || 'Awadhesh'} की सार्वजनिक प्रोफ़ाइल अपडेट हो गई है।`
                  : `Your feedback has been added to ${booking.workerName || 'technician'}'s public cooperative profile.`}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 text-xs text-slate-700">
            {/* Worker Summary Card */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3">
              <img
                src={booking.workerAvatar || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80'}
                alt={booking.workerName}
                className="w-12 h-12 rounded-xl object-cover border border-slate-300 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <span className="font-extrabold text-sm text-slate-900 block truncate">
                  {booking.workerName || 'Awadhesh Sharma'}
                </span>
                <p className="text-[11px] text-slate-500 truncate">
                  Order #{booking.id} • {booking.serviceTitle || 'Electrical Service'}
                </p>
              </div>
            </div>

            {/* 1. Interactive Star Rating */}
            <div className="flex flex-col items-center justify-center py-2 bg-gradient-to-b from-amber-50/60 to-white rounded-2xl border border-amber-200/80 gap-1.5">
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => {
                      setRating(star);
                      soundEffects.playSuccessChime();
                    }}
                    className="p-1 transition-transform hover:scale-125 active:scale-95 focus:outline-none"
                  >
                    <span
                      className={`material-symbols-outlined text-3xl sm:text-4xl transition-colors ${
                        (hoverRating || rating) >= star
                          ? 'text-amber-400 material-symbols-fill drop-shadow-xs'
                          : 'text-slate-300'
                      }`}
                    >
                      star
                    </span>
                  </button>
                ))}
              </div>
              <span className="font-black text-xs text-amber-900">
                {ratingLabels[hoverRating || rating]}
              </span>
            </div>

            {/* 2. Positive Feedback Badges */}
            <div>
              <label className="font-extrabold text-slate-900 block mb-1 text-xs">
                {isHindi ? 'विशेष सराहना के बिंदु चुनें:' : 'What did you like best?'}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {availableTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all active:scale-95 border ${
                        isSelected
                          ? 'bg-primary text-white border-primary shadow-2xs'
                          : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border-slate-200'
                      }`}
                    >
                      {tag.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Written Review Feedback */}
            <div>
              <label className="font-extrabold text-slate-900 block mb-1 text-xs">
                {isHindi ? 'अपनी टिप्पणी / अनुभव साझा करें:' : 'Share your feedback (Optional):'}
              </label>
              <textarea
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  isHindi
                    ? 'उदा. काम समय पर पूरा हुआ, तकनीशियन बहुत विनम्र थे और वायरिंग एकदम ठीक कर दी।'
                    : 'e.g. Technician arrived on time and fixed the switchboard neatly. Very polite and expert work!'
                }
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-slate-400"
              />
            </div>

            {/* 4. Optional Direct Tip */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-extrabold text-slate-900 text-xs">
                  {isHindi ? 'तकनीशियन को टिप दें (100% डायरेक्ट):' : 'Add a Tip for Technician (100% Direct):'}
                </label>
                <span className="text-[10px] text-emerald-700 font-bold">0% Commission on Tips</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[0, 20, 50, 100].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setSelectedTip(amt)}
                    className={`py-1.5 rounded-xl text-xs font-black transition-all border ${
                      selectedTip === amt
                        ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                    }`}
                  >
                    {amt === 0 ? (isHindi ? 'कोई नहीं' : 'No Tip') : `₹${amt}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setReviewModalBooking(null)}
                className="px-4 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                {isHindi ? 'रद्द करें' : 'Skip'}
              </button>
              <button
                type="submit"
                className="flex-1 h-11 rounded-xl bg-primary hover:bg-primary-container text-white font-black text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
                <span>
                  {isHindi
                    ? `समीक्षा सबमिट करें ${selectedTip > 0 ? `(+₹${selectedTip} टिप)` : ''}`
                    : `Submit Rating & Review ${selectedTip > 0 ? `(+₹${selectedTip} Tip)` : ''}`}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
