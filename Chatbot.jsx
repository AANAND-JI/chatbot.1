import React, { useState, useEffect, useRef } from 'react';
import { faqDatabase } from './faqData';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [answeredIds, setAnsweredIds] = useState(new Set());
  const [inputValue, setInputValue] = useState("");
  const [showLeadModal, setShowLeadModal] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Initialize welcome message
  useEffect(() => {
    setMessages([
      {
        sender: 'bot',
        text: "👋 Hello! Welcome to our dental clinic. I'm here to answer common questions about our clinic. You can type your own question or choose one of the suggestions below.",
        type: 'text'
      }
    ]);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showLeadModal]);

  // Derived state: Get exactly 3 unanswered questions in priority order
  const visibleSuggestions = faqDatabase
    .filter(faq => !answeredIds.has(faq.id))
    .slice(0, 3);

  const handleSend = (text, isSuggestion = false, faqId = null) => {
    if (!text.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text }]);
    setInputValue("");

    // Find if the text matches an FAQ
    const matchedFaq = isSuggestion 
      ? faqDatabase.find(f => f.id === faqId)
      : faqDatabase.find(f => f.q.toLowerCase().includes(text.toLowerCase().trim()));

    setTimeout(() => {
      if (matchedFaq) {
        setMessages(prev => [...prev, { sender: 'bot', text: matchedFaq.a, type: 'text' }]);
        setAnsweredIds(prev => new Set(prev).add(matchedFaq.id));
      } else {
        setMessages(prev => [...prev, { 
          sender: 'bot', 
          text: "I'm sorry, I don't have that information. Would you like to speak with one of our team members?",
          type: 'fallback'
        }]);
      }
    }, 500);
  };

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    setShowLeadModal(false);
    setMessages(prev => [...prev, { sender: 'bot', text: "Thank you! We have received your details and will contact you shortly.", type: 'text' }]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-[350px] h-[550px] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] mb-4 flex flex-col overflow-hidden transition-all duration-300 transform origin-bottom-right scale-100 border border-gray-100">
          
          {/* Header */}
          <div className="bg-blue-50 px-5 py-4 flex justify-between items-center border-b border-blue-100">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-full shadow-sm">
                <ChatIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">Dental Assistant</h3>
                <p className="text-xs text-blue-500 font-medium">Online</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 transition">
              ✕
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 relative">
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 text-sm rounded-2xl shadow-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-slate-700 rounded-bl-none border border-gray-100'}`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Fallback Buttons */}
            {messages[messages.length - 1]?.type === 'fallback' && (
              <div className="flex flex-col gap-2 mb-4">
                <button className="bg-white border border-blue-200 text-blue-600 text-sm py-2 px-4 rounded-xl shadow-sm hover:bg-blue-50 transition font-medium">Contact Clinic</button>
                <button onClick={() => setShowLeadModal(true)} className="bg-blue-600 text-white text-sm py-2 px-4 rounded-xl shadow-sm hover:bg-blue-700 transition font-medium">Leave Your Details</button>
              </div>
            )}

            {/* Dynamic Suggestions */}
            {visibleSuggestions.length > 0 && messages[messages.length - 1]?.sender === 'bot' && (
              <div className="flex flex-col gap-2 mt-4 mb-2">
                {visibleSuggestions.map((faq) => (
                  <button 
                    key={faq.id}
                    onClick={() => handleSend(faq.q, true, faq.id)}
                    className="text-left bg-white border border-blue-100 text-slate-600 text-xs py-2 px-3 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition shadow-sm"
                  >
                    {faq.q}
                  </button>
                ))}
              </div>
            )}

            {/* Lead Modal Overlay */}
            {showLeadModal && (
              <div className="absolute inset-0 bg-white/95 z-10 flex flex-col p-5 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-slate-800">Leave Your Details</h4>
                  <button onClick={() => setShowLeadModal(false)} className="text-slate-400">✕</button>
                </div>
                <form onSubmit={handleLeadSubmit} className="flex flex-col gap-3">
                  <input required type="text" placeholder="Name" className="w-full text-sm border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:border-blue-400" />
                  <input required type="tel" placeholder="Phone Number" className="w-full text-sm border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:border-blue-400" />
                  <input type="email" placeholder="Email (Optional)" className="w-full text-sm border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:border-blue-400" />
                  <textarea required placeholder="Message" rows="3" className="w-full text-sm border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:border-blue-400 resize-none"></textarea>
                  <button type="submit" className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition shadow-sm mt-1">Submit</button>
                </form>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }}
              className="flex items-center gap-2"
            >
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a question..." 
                className="flex-1 bg-slate-50 border border-gray-200 text-sm rounded-full px-4 py-2.5 focus:outline-none focus:border-blue-400 focus:bg-white transition"
              />
              <button 
                type="submit" 
                disabled={!inputValue.trim()}
                className="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 disabled:opacity-50 transition shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-700 to-blue-400 flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      >
        {isOpen ? (
           <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        ) : (
          <ChatIcon className="w-8 h-8 text-white drop-shadow-md" />
        )}
      </button>
    </div>
  );
};

// Custom SVG Logo for the Chatbot
const ChatIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 5.92 2 10.75C2 13.43 3.48 15.82 5.76 17.38C5.6 18.57 4.97 19.88 4.09 20.91C4.01 21.01 4.04 21.16 4.15 21.23C4.24 21.28 4.36 21.27 4.44 21.2C6.54 19.46 8.36 18.66 9.57 18.42C10.35 18.52 11.16 18.58 12 18.58C17.52 18.58 22 14.66 22 9.83C22 5 17.52 2 12 2Z" fill="currentColor"/>
    <path d="M15.5 13.5C15.5 14.33 14.83 15 14 15H10C9.17 15 8.5 14.33 8.5 13.5V9.5C8.5 8.67 9.17 8 10 8H14C14.83 8 15.5 8.67 15.5 9.5V13.5Z" fill="white" stroke="#2563EB" strokeWidth="1.5"/>
    <path d="M10 15V16.5C10 17.33 10.67 18 11.5 18H12.5C13.33 18 14 17.33 14 16.5V15" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="18" cy="6" r="1.5" fill="#FDE047" />
    <path d="M18 3V4.5M18 7.5V9M15 6H16.5M19.5 6H21" stroke="#FDE047" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export default Chatbot;