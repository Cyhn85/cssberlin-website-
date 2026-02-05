import React, { useState, useEffect, useRef } from 'react';
import { Bot, Mic, X, Send, Volume2, StopCircle, ShoppingBag } from 'lucide-react';
import { cn } from '../lib/utils';

// Types for Chat Messages
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  isAudio?: boolean;
}

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hallo! Ich bin dein CSS Berlin AI Assistant. Ich kann für dich Produkte suchen, Beschreibungen vorlesen oder den Checkout starten. Sag einfach Bescheid! 🤖", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Web Speech API Refs
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Initialize Speech Synthesis
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }

    // Scroll to bottom on new message
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- LOGIC: TEXT TO SPEECH (TTS) ---
  const speak = (text: string) => {
    if (!synthRef.current) return;
    
    // Stop any current speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE'; // German
    utterance.rate = 1.1; // Slightly faster
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // --- LOGIC: VOICE RECOGNITION (STT) ---
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert("Dein Browser unterstützt keine Spracheingabe.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'de-DE';
    recognitionRef.current.interimResults = false;
    recognitionRef.current.maxAlternatives = 1;

    recognitionRef.current.onstart = () => setIsListening(true);
    
    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      handleSendMessage(transcript);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error("Speech error", event.error);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => setIsListening(false);

    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // --- LOGIC: AI BRAIN (MOCKED) ---
  const processAICommand = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // 1. SEARCH INTENT
    if (lowerText.includes("suche") || lowerText.includes("finde") || lowerText.includes("zeigen")) {
      setTimeout(() => {
        const botResponse = "Ich habe einige Produkte für dich gefunden. Scrolle herunter, um sie zu sehen.";
        addBotMessage(botResponse);
        speak(botResponse);
        // Simulate scrolling to products
        window.scrollTo({ top: 800, behavior: 'smooth' });
      }, 1000);
      return;
    }

    // 2. READ DESCRIPTION INTENT
    if (lowerText.includes("lis") || lowerText.includes("oku") || lowerText.includes("beschreib") || lowerText.includes("vorlesen")) {
        const productDesc = "Dieses Produkt ist eine seltene Leica M6 Analog Kamera in sehr gutem Zustand. Es wurde vom Verkäufer AnalogPro Berlin geprüft und kommt mit einer 12-monatigen Garantie. Perfekt für Liebhaber der analogen Fotografie.";
        addBotMessage("Hier ist die Produktbeschreibung:");
        speak(productDesc);
        return;
    }

    // 3. BUY / CHECKOUT INTENT
    if (lowerText.includes("kauf") || lowerText.includes("bestell") || lowerText.includes("warenkorb")) {
       const botResponse = "Ich habe das Produkt in den Warenkorb gelegt. Wir gehen jetzt zur Kasse. Bitte bestätige deine Adresse.";
       addBotMessage(botResponse);
       speak(botResponse);
       // In a real app, this would trigger router.push('/checkout')
       return;
    }

    // DEFAULT FALLBACK
    const defaultResponse = "Verstanden. Ich verarbeite deine Anfrage...";
    setTimeout(() => {
        const finalResponse = "Ich bin mir nicht sicher, wie ich das tun soll, aber ich lerne jeden Tag dazu! Versuch es mal mit 'Suche rote Schuhe' oder 'Lies die Beschreibung'.";
        addBotMessage(finalResponse);
        speak(finalResponse);
    }, 1000);
  };

  const addBotMessage = (text: string) => {
    setMessages(prev => [...prev, { id: Date.now(), text, sender: 'bot' }]);
  };

  const handleSendMessage = (textOverride?: string) => {
    const textToSend = textOverride || inputValue;
    if (!textToSend.trim()) return;

    // Add User Message
    setMessages(prev => [...prev, { id: Date.now(), text: textToSend, sender: 'user' }]);
    setInputValue("");
    
    // Process Logic
    processAICommand(textToSend);
  };

  return (
    <>
      {/* --- FLOATING TRIGGER BUTTON --- */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center justify-center w-16 h-16 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-2xl hover:scale-110 transition-all duration-300 animate-in slide-in-from-bottom-5"
          >
            {/* Pulsing Effect */}
            <span className="absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-20 animate-ping"></span>
            <Bot className="w-8 h-8" />
            
            <div className="absolute right-full mr-4 bg-white dark:bg-zinc-800 px-3 py-1 rounded-lg text-xs font-bold shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-gray-800 dark:text-white pointer-events-none">
              AI Assistant (Beta)
            </div>
          </button>
        )}
      </div>

      {/* --- CHAT WINDOW INTERFACE --- */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-gray-200 dark:border-zinc-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-darkGreen to-brand-green p-4 flex items-center justify-between shrink-0">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20">
                 <Bot className="w-6 h-6 text-white" />
               </div>
               <div>
                 <h3 className="text-white font-heading font-bold text-lg">CSS Assistant</h3>
                 <div className="flex items-center gap-1.5">
                   <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                   <span className="text-white/70 text-xs">Online & Listening</span>
                 </div>
               </div>
             </div>
             <button 
                onClick={() => {
                  stopSpeaking();
                  setIsOpen(false);
                }} 
                className="text-white/70 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"
             >
               <X className="w-6 h-6" />
             </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-zinc-950/50">
             {messages.map((msg) => (
               <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={cn(
                      "max-w-[80%] px-4 py-3 rounded-2xl text-sm shadow-sm relative",
                      msg.sender === 'user' 
                        ? "bg-brand-orange text-white rounded-br-none" 
                        : "bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-100 dark:border-zinc-700"
                    )}
                  >
                    {msg.text}
                    {msg.sender === 'bot' && (
                       <button onClick={() => speak(msg.text)} className="absolute -right-8 top-2 text-gray-400 hover:text-brand-orange">
                         <Volume2 className="w-4 h-4" />
                       </button>
                    )}
                  </div>
               </div>
             ))}
             {/* Loading Bubble */}
             {messages[messages.length-1].sender === 'user' && !isSpeaking && (
                <div className="flex justify-start">
                   <div className="bg-white dark:bg-zinc-800 px-4 py-3 rounded-2xl rounded-bl-none border border-gray-100 dark:border-zinc-700">
                     <div className="flex gap-1">
                       <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                       <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                       <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                     </div>
                   </div>
                </div>
             )}
             <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 shrink-0">
            {/* Quick Actions */}
            <div className="flex gap-2 overflow-x-auto pb-3 no-scrollbar mb-1">
              <button onClick={() => handleSendMessage("Suche rote Schuhe")} className="whitespace-nowrap px-3 py-1.5 bg-gray-100 dark:bg-zinc-800 text-xs rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">🔍 Rote Schuhe</button>
              <button onClick={() => handleSendMessage("Lies Beschreibung")} className="whitespace-nowrap px-3 py-1.5 bg-gray-100 dark:bg-zinc-800 text-xs rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">📢 Vorlesen</button>
              <button onClick={() => handleSendMessage("Jetzt kaufen")} className="whitespace-nowrap px-3 py-1.5 bg-gray-100 dark:bg-zinc-800 text-xs rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">🛒 Kaufen</button>
            </div>

            <div className="flex items-center gap-2">
               <button 
                 onClick={isListening ? stopListening : startListening}
                 className={cn(
                   "p-3 rounded-full transition-all duration-300",
                   isListening 
                     ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30" 
                     : "bg-gray-100 dark:bg-zinc-800 text-gray-500 hover:text-brand-orange"
                 )}
               >
                 {isListening ? <StopCircle className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
               </button>

               <div className="flex-1 relative">
                 <input 
                   type="text" 
                   value={inputValue}
                   onChange={(e) => setInputValue(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                   placeholder={isListening ? "Höre zu..." : "Schreib etwas..."}
                   className="w-full pl-4 pr-10 py-3 bg-gray-100 dark:bg-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-green/50 text-sm"
                 />
                 <button 
                   onClick={() => handleSendMessage()}
                   className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-brand-green text-white rounded-xl hover:scale-105 transition-transform"
                 >
                   <Send className="w-4 h-4" />
                 </button>
               </div>
            </div>
            {isSpeaking && (
              <div className="text-xs text-brand-green text-center mt-2 font-bold animate-pulse">
                Assistant spricht gerade...
              </div>
            )}
          </div>

        </div>
      )}
    </>
  );
};

export default AIAssistant;
