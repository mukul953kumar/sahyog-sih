import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

export const VoiceSearchModal = () => {
  const {
    voiceSearchModalOpen,
    setVoiceSearchModalOpen,
    setSelectedCategory,
    setSelectedWorkerId,
    navigateTo,
    workers,
    language,
    t,
  } = useApp();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [assistantMessage, setAssistantMessage] = useState('');
  const [matchedResult, setMatchedResult] = useState(null);
  const [speechSupported, setSpeechSupported] = useState(true);

  const recognitionRef = useRef(null);

  // Text-To-Speech helper for users
  const speakAloud = (text) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang =
          language === 'kn'
            ? 'kn-IN'
            : language === 'mr'
            ? 'mr-IN'
            : language === 'ta'
            ? 'ta-IN'
            : language === 'hi'
            ? 'hi-IN'
            : 'en-IN';
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('Speech synthesis error:', err);
      }
    }
  };

  // Start real browser speech recognition
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      setAssistantMessage(
        language === 'en'
          ? 'Microphone not supported on this browser. Please select an option below:'
          : 'माइक्रोफ़ोन समर्थित नहीं है। कृपया नीचे दिए गए विकल्प चुनें:'
      );
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang =
        language === 'kn'
          ? 'kn-IN'
          : language === 'ta'
          ? 'ta-IN'
          : language === 'mr'
          ? 'mr-IN'
          : language === 'hi'
          ? 'hi-IN'
          : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setMatchedResult(null);
        setAssistantMessage(t('voiceListeningPrompt'));
      };

      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const spokenText = event.results[current][0].transcript;
        setTranscript(spokenText);

        if (event.results[current].isFinal) {
          processSpokenCommand(spokenText);
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setAssistantMessage(
            language === 'en'
              ? 'Microphone permission blocked. Please select a service below:'
              : 'माइक्रोफ़ोन की अनुमति नहीं मिली। कृपया नीचे से सेवा चुनें:'
          );
        } else {
          setAssistantMessage(
            language === 'en'
              ? 'Could not hear clearly. Tap the mic to try again or choose below:'
              : 'आवाज़ साफ़ सुनाई नहीं दी। दोबारा बोलने के लिए माइक दबाएं:'
          );
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error('Failed to start speech recognition:', e);
      setIsListening(false);
    }
  };

  // Stop listening
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Intelligent NLP keyword processing with localized voice response
  const processSpokenCommand = (text) => {
    const lower = text.toLowerCase();
    let category = null;
    let matchedWorkerId = null;
    let replyVoice = '';

    const isEn = language === 'en';
    const isKn = language === 'kn';
    const isMr = language === 'mr';
    const isTa = language === 'ta';

    if (
      lower.includes('बिजली') ||
      lower.includes('bijli') ||
      lower.includes('electric') ||
      lower.includes('wire') ||
      lower.includes('fan') ||
      lower.includes('पंखा') ||
      lower.includes('fuse') ||
      lower.includes('रमेश') ||
      lower.includes('ramesh') ||
      lower.includes('ಕರೆಂಟ್') ||
      lower.includes('ವೈರಿಂಗ್') ||
      lower.includes('மின்சாரம்')
    ) {
      category = 'electrical';
      matchedWorkerId = 'ramesh-kumar';
      replyVoice = isEn
        ? 'Got it! Certified Electrician Ramesh Kumar is available near you with a 4.8 star rating.'
        : isKn
        ? 'ಅರ್ಥವಾಯಿತು! ಪರಿಶೀಲಿತ ಎಲೆಕ್ಟ್ರಿಷಿಯನ್ ರಮೇಶ್ ಕುಮಾರ್ ನಿಮ್ಮ ಬಳಿ ಲಭ್ಯವಿದ್ದಾರೆ.'
        : isMr
        ? 'समजले! प्रमाणित इलेक्ट्रिशियन रमेश कुमार आपल्या जवळ उपलब्ध आहेत.'
        : isTa
        ? 'புரிந்தது! சரிபார்க்கப்பட்ட எலக்ட்ரீஷியன் ரமேஷ் குமார் அருகில் உள்ளார்.'
        : 'समझ गया! आपके नज़दीक बिजली मिस्त्री रमेश कुमार उपलब्ध हैं।';
    } else if (
      lower.includes('नल') ||
      lower.includes('pani') ||
      lower.includes('पानी') ||
      lower.includes('leak') ||
      lower.includes('pipe') ||
      lower.includes('plumber') ||
      lower.includes('प्लंबर') ||
      lower.includes('motor') ||
      lower.includes('aarif') ||
      lower.includes('ಆರಿಫ್') ||
      lower.includes('நீர்') ||
      lower.includes('குழாய்')
    ) {
      category = 'plumbing';
      matchedWorkerId = 'mohammad-arif';
      replyVoice = isEn
        ? 'Found verified Plumber Mohammad Arif, 0.8 kilometers away for pipe and water repair.'
        : isKn
        ? 'ನೀರಿನ ಕೆಲಸಕ್ಕಾಗಿ ಪ್ಲಂಬರ್ ಮೊಹಮ್ಮದ್ ಆರಿಫ್ 0.8 ಕಿಮೀ ದೂರದಲ್ಲಿ ಲಭ್ಯವಿದ್ದಾರೆ.'
        : isMr
        ? 'नळ व पाण्याच्या कामासाठी प्लंबर मोहम्मद आरिफ ०.८ किमी अंतरावर उपलब्ध आहेत.'
        : isTa
        ? 'குழாய் வேலைக்கு பிளம்பர் முகமது ஆரிப் 0.8 கிமீ தொலைவில் உள்ளார்.'
        : 'समझ गया! नल और पानी के काम के लिए प्लंबर मोहम्मद आरिफ़ 0.8 किमी दूर उपलब्ध हैं।';
    } else if (
      lower.includes('सफाई') ||
      lower.includes('cleaning') ||
      lower.includes('safai') ||
      lower.includes('jhaadu') ||
      lower.includes('सुनीता') ||
      lower.includes('sunita') ||
      lower.includes('ಕ್ಲೀನಿಂಗ್') ||
      lower.includes('சுத்தம்')
    ) {
      category = 'cleaning';
      matchedWorkerId = 'sunita-patil';
      replyVoice = isEn
        ? 'Found Deep Cleaning Lead Sunita Patil with 5-star rating and cooperative membership.'
        : isKn
        ? 'ಮನೆ ಸ್ವಚ್ಛತೆಗಾಗಿ ಸುನೀತಾ ಪಾಟೀಲ್ ಲಭ್ಯವಿದ್ದಾರೆ.'
        : isMr
        ? 'घर स्वच्छतेसाठी सुनीता पाटील ५ स्टार रेटिंगसह उपलब्ध आहेत.'
        : isTa
        ? 'வீடு சுத்தம் செய்ய சுனிதா பாட்டீல் தயாராக உள்ளார்.'
        : 'समझ गया! घर की गहरी सफाई के लिए सुनीता पाटिल 5 स्टार रेटिंग के साथ उपलब्ध हैं।';
    } else if (
      lower.includes('ac') ||
      lower.includes('एसी') ||
      lower.includes('कूलिंग') ||
      lower.includes('cooling') ||
      lower.includes('fridge') ||
      lower.includes('vikram') ||
      lower.includes('विक्रम')
    ) {
      category = 'ac';
      matchedWorkerId = 'vikram-chauhan';
      replyVoice = isEn
        ? 'Found AC Specialist Vikram Chauhan for fast cooling inspection and gas charging.'
        : isKn
        ? 'ಎಸಿ ರಿಪೇರಿಗಾಗಿ ವಿಕ್ರಮ್ ಚೌಹಾಣ್ ಲಭ್ಯವಿದ್ದಾರೆ.'
        : isMr
        ? 'एसी दुरुस्तीसाठी विक्रम चौहान उपलब्ध आहेत.'
        : isTa
        ? 'ஏசி பழுதுபார்க்க விக்ரம் சவுகான் உள்ளார்.'
        : 'समझ गया! एसी रिपेयर और गैस चार्जिंग के लिए विक्रम चौहान उपलब्ध हैं।';
    } else if (
      lower.includes('बढ़ई') ||
      lower.includes('carpenter') ||
      lower.includes('lakdi') ||
      lower.includes('wood') ||
      lower.includes('door') ||
      lower.includes('rajesh') ||
      lower.includes('ಬಡಗಿ') ||
      lower.includes('தச்சர்')
    ) {
      category = 'carpentry';
      matchedWorkerId = 'rajesh-gowda';
      replyVoice = isEn
        ? 'Found Carpenter Rajesh Gowda for door, lock, and furniture repairs.'
        : isKn
        ? 'ಮರಗೆಲಸಕ್ಕೆ ರಾಜೇಶ್ ಗೌಡ ಲಭ್ಯವಿದ್ದಾರೆ.'
        : isMr
        ? 'लाकडी कामासाठी सुतार राजेश गौडा उपलब्ध आहेत.'
        : isTa
        ? 'மரவேலைக்காக தச்சர் ராஜேஷ் கவுடா உள்ளார்.'
        : 'समझ गया! बढ़ई और लकड़ी के काम के लिए राजेश गौड़ा उपलब्ध हैं।';
    } else if (
      lower.includes('emergency') ||
      lower.includes('तुरंत') ||
      lower.includes('urgent') ||
      lower.includes('ತುರ್ತು') ||
      lower.includes('அவசரம்')
    ) {
      category = 'emergency';
      matchedWorkerId = 'ramesh-kumar';
      replyVoice = isEn
        ? 'Emergency service activated! Nearest on-duty technician dispatched within 15 minutes.'
        : isKn
        ? 'ತುರ್ತು ಸೇವೆ ಸಕ್ರಿಯವಾಗಿದೆ! 15 ನಿಮಿಷಗಳಲ್ಲಿ ತಂತ್ರಜ್ಞರು ತಲುಪಲಿದ್ದಾರೆ.'
        : isMr
        ? 'आपत्कालीन सेवा सक्रिय! १५ मिनिटांत तंत्रज्ञ पोहोचत आहेत.'
        : isTa
        ? 'அவசர சேவை செயல்பட்டது! 15 நிமிடங்களில் தொழிலாளி வருகிறார்.'
        : 'आपातकालीन सेवा सक्रिय! 15 मिनट के अंदर नज़दीकी मिस्त्री रवाना हो रहा है।';
    } else {
      category = 'electrical';
      matchedWorkerId = 'ramesh-kumar';
      replyVoice = isEn
        ? `Found top verified technician matching "${text}".`
        : `"${text}" के लिए नज़दीकी सत्यापित कारीगर दिखाए जा रहे हैं।`;
    }

    const workerObj =
      workers.find((w) => w.id === matchedWorkerId) || workers[0];

    setAssistantMessage(replyVoice);
    setMatchedResult({
      category,
      worker: workerObj,
      rawText: text,
      replyVoice,
    });

    // Speak aloud in selected language
    speakAloud(replyVoice);
  };

  // Helper when user taps a preset spoken phrase
  const handlePresetTrigger = (presetText) => {
    setTranscript(presetText);
    processSpokenCommand(presetText);
  };

  // Confirm and navigate to booking / worker page
  const handleConfirmAction = () => {
    if (!matchedResult) return;

    if (matchedResult.category) {
      setSelectedCategory(matchedResult.category);
    }
    if (matchedResult.worker) {
      setSelectedWorkerId(matchedResult.worker.id);
      navigateTo('worker-detail', { workerId: matchedResult.worker.id });
    } else {
      navigateTo('workers');
    }
    setVoiceSearchModalOpen(false);
  };

  // Initialize or start speech when modal opens
  useEffect(() => {
    if (voiceSearchModalOpen) {
      setTranscript('');
      setMatchedResult(null);
      setAssistantMessage(t('voiceListeningPrompt'));
      startListening();
    } else {
      stopListening();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
    return () => {
      stopListening();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [voiceSearchModalOpen, language]);

  if (!voiceSearchModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl flex flex-col gap-4 border border-emerald-200 text-slate-800 max-h-[92vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-primary flex items-center justify-center font-black">
              <span className="material-symbols-outlined text-[20px]">record_voice_over</span>
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                {t('voiceModalTitle')}
              </h3>
              <p className="text-[11px] text-emerald-700 font-semibold">
                {t('voiceModalSubtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={() => setVoiceSearchModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Central Animated Listening Button */}
        <div className="flex flex-col items-center justify-center py-2 gap-3">
          <div className="relative flex items-center justify-center">
            {isListening && (
              <>
                <span className="animate-ping absolute inline-flex h-28 w-28 rounded-full bg-emerald-400 opacity-40"></span>
                <span className="animate-pulse absolute inline-flex h-24 w-24 rounded-full bg-emerald-300 opacity-60"></span>
              </>
            )}

            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-transform active:scale-95 ${
                isListening
                  ? 'bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white ring-4 ring-emerald-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-white'
              }`}
              title={isListening ? 'Stop Mic' : 'Start Mic'}
            >
              <span className="material-symbols-outlined text-4xl material-symbols-fill">
                {isListening ? 'mic' : 'mic_none'}
              </span>
            </button>
          </div>

          <div className="text-center px-2">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                isListening
                  ? 'bg-emerald-100 text-emerald-900 animate-pulse'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {isListening ? t('voiceListeningBadge') : t('voiceTapToSpeakAgain')}
            </span>

            {transcript && (
              <p className="text-sm font-bold text-slate-900 mt-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                {t('voiceSpokenPrefix')}{' '}
                <span className="text-primary">"{transcript}"</span>
              </p>
            )}
          </div>
        </div>

        {/* Audio Spoken Feedback Box */}
        <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
            <span className="material-symbols-outlined text-[18px]">volume_up</span>
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-emerald-950 leading-relaxed">
              {assistantMessage || t('voiceListeningPrompt')}
            </p>
            {matchedResult && (
              <button
                type="button"
                onClick={() => speakAloud(assistantMessage)}
                className="mt-1 text-[11px] font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">replay</span>
                <span>{t('voiceListenAgain')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Visual Matched Result Card */}
        {matchedResult && matchedResult.worker && (
          <div className="bg-white rounded-2xl p-3.5 border-2 border-primary shadow-md flex flex-col gap-2.5 animate-fade-in">
            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-800">
              <span className="bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                {t('voiceVerifiedBadge')}
              </span>
              <span>{matchedResult.worker.distance}</span>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={matchedResult.worker.avatar}
                alt={matchedResult.worker.name}
                className="w-14 h-14 rounded-xl object-cover border border-emerald-300 shadow-xs shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-black text-slate-900 truncate">
                  {matchedResult.worker.name}
                </h4>
                <p className="text-xs font-bold text-primary">
                  {matchedResult.worker.trade}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-600 mt-0.5">
                  <span className="font-bold text-amber-600">★ {matchedResult.worker.rating}</span>
                  <span>•</span>
                  <span>{matchedResult.worker.jobsCompleted} jobs</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">{t('voiceCoopRate')}</span>
                <strong className="text-base font-black text-slate-900">
                  ₹{matchedResult.worker.hourlyRate || 450}
                </strong>
              </div>
              <button
                type="button"
                onClick={handleConfirmAction}
                className="px-4 py-2.5 bg-primary hover:bg-emerald-800 text-white rounded-xl font-black text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5"
              >
                <span>{t('voiceConfirmBtn')}</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* Tap-to-Speak Presets with Dynamic Translations */}
        <div className="flex flex-col gap-2 pt-1 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            {t('voiceQuickPresetsTitle')}
          </span>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handlePresetTrigger('electrician wireman fan repair')}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-left flex items-center gap-2 transition-colors active:scale-95"
            >
              <span className="text-xl">⚡</span>
              <div>
                <strong className="text-xs font-bold text-slate-900 block">
                  {t('voiceElectricianPreset')}
                </strong>
                <span className="text-[10px] text-slate-500">
                  {t('voiceElectricianSub')}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handlePresetTrigger('plumber water pipe leakage motor')}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-left flex items-center gap-2 transition-colors active:scale-95"
            >
              <span className="text-xl">🚰</span>
              <div>
                <strong className="text-xs font-bold text-slate-900 block">
                  {t('voicePlumberPreset')}
                </strong>
                <span className="text-[10px] text-slate-500">
                  {t('voicePlumberSub')}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handlePresetTrigger('home deep cleaning safai')}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-left flex items-center gap-2 transition-colors active:scale-95"
            >
              <span className="text-xl">🧹</span>
              <div>
                <strong className="text-xs font-bold text-slate-900 block">
                  {t('voiceCleaningPreset')}
                </strong>
                <span className="text-[10px] text-slate-500">
                  {t('voiceCleaningSub')}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handlePresetTrigger('ac cooling gas repair')}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-left flex items-center gap-2 transition-colors active:scale-95"
            >
              <span className="text-xl">❄️</span>
              <div>
                <strong className="text-xs font-bold text-slate-900 block">
                  {t('voiceAcPreset')}
                </strong>
                <span className="text-[10px] text-slate-500">
                  {t('voiceAcSub')}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handlePresetTrigger('carpenter door lock wood furniture')}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-left flex items-center gap-2 transition-colors active:scale-95"
            >
              <span className="text-xl">🪚</span>
              <div>
                <strong className="text-xs font-bold text-slate-900 block">
                  {t('voiceCarpenterPreset')}
                </strong>
                <span className="text-[10px] text-slate-500">
                  {t('voiceCarpenterSub')}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handlePresetTrigger('emergency immediate technician')}
              className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-left flex items-center gap-2 transition-colors active:scale-95"
            >
              <span className="text-xl">🚨</span>
              <div>
                <strong className="text-xs font-bold text-rose-900 block">
                  {t('voiceEmergencyPreset')}
                </strong>
                <span className="text-[10px] text-rose-600">
                  {t('voiceEmergencySub')}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
