import { cn } from "../../lib/utils";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CallToAction() {
    const navigate = useNavigate();
    
    return (
        <div className="flex flex-col items-center justify-center w-full bg-gradient-to-b from-[#5524B7] to-[#0B1860] px-6 py-28 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
            
            <div className="flex items-center -space-x-4 mb-8 relative z-10">
                <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200" alt="student"
                    className="h-14 w-14 rounded-full border-4 border-[#5524B7] shadow-lg object-cover" />
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200" alt="student"
                    className="h-14 w-14 rounded-full border-4 border-[#5524B7] shadow-lg object-cover" />
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop"
                    alt="student"
                    className="h-14 w-14 rounded-full border-4 border-[#5524B7] shadow-lg object-cover" />
                <div className="h-14 w-14 rounded-full border-4 border-[#5524B7] shadow-lg bg-pink-500 flex items-center justify-center text-white font-bold text-xs z-10">
                    +10k
                </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-2 max-w-2xl leading-tight relative z-10 tracking-tight">
                Unlock your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CAABFF] to-[#F75BE9]">next big opportunity</span>.
            </h1>
            
            <p className="text-blue-100 mt-6 max-w-xl text-lg relative z-10">
                Over 10,000 students and educators trust JambPrep to supercharge their examination readiness.
            </p>
            
            <button 
                onClick={() => navigate('/signup')}
                className="group inline-flex items-center bg-gradient-to-r from-[#6B41FF] to-[#CAABFF] font-black text-white rounded-full px-10 py-4 mt-10 text-base shadow-lg shadow-[#6B41FF]/30 hover:scale-105 transition-all relative z-10"
            >
                START PRACTICING NOW
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
    );
}
