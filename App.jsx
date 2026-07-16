import React from 'react';
import Chatbot from './Chatbot';

const App = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 relative">
      
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
             <span className="text-2xl">🦷</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Aura<span className="text-blue-600">Dental</span>
          </h1>
        </div>
        <button className="hidden md:block px-6 py-2.5 rounded-full border border-gray-200 text-slate-600 font-medium hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50 transition-all">
          Contact Us
        </button>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
        <div className="inline-block mb-6 px-4 py-1.5 bg-blue-50 text-blue-600 font-medium text-sm rounded-full border border-blue-100 shadow-sm">
          ✨ Premium Dental Care
        </div>
        <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-4xl leading-tight">
          Healthy Smiles <br className="hidden md:block"/> Begin Here
        </h2>
        <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl leading-relaxed">
          Book appointments, ask questions, and connect with our dental experts instantly. Experience modern dentistry with comfort.
        </p>
        <button className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all duration-300">
          Book Appointment
        </button>
      </main>

      {/* Embedded Chatbot */}
      <Chatbot />
    </div>
  );
};

export default App;