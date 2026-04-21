import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, GraduationCap, Clock, LineChart, Target, CheckCircle, 
  ChevronRight, Laptop, Users, Zap, Shield, HelpCircle, PlayCircle,
  Twitter, Facebook, Instagram, Mail, ArrowRight, Sparkles
} from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';

const FADE_UP_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 15 } },
};

const STAGGER_CHILDREN_VARIANTS = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#FBFBFA] font-sans text-gray-900 selection:bg-blue-200 overflow-hidden">
      {/* Navigation */}
      <nav className="bg-white/70 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="bg-blue-600 p-2 rounded-xl shadow-sm shadow-blue-200 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-gray-900">JambPrep</span>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How it Works</a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">FAQ</a>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/login')}
              className="hidden md:inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-colors shadow-sm"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main>
        {/* Her Section */}
        <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100/50 mix-blend-multiply blur-[80px] animate-blob"></div>
            <div className="absolute top-[20%] right-[-10%] w-[40%] h-[50%] rounded-full bg-emerald-50/50 mix-blend-multiply blur-[80px] animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[80%] h-[40%] rounded-full bg-indigo-50/50 mix-blend-multiply blur-[100px] animate-blob animation-delay-4000"></div>
          </div>

          <motion.div 
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center"
            variants={STAGGER_CHILDREN_VARIANTS}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="flex justify-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-white text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium border border-blue-100 shadow-sm">
                <Sparkles className="h-4 w-4 text-blue-500" />
                <span>Updated for 2026 JAMB CBT</span>
              </div>
            </motion.div>
            
            <motion.h1 variants={FADE_UP_ANIMATION_VARIANTS} className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-gray-900 mb-8 leading-[1.1]">
              Score 300+ with <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-300% animate-gradient">
                Zero Anxiety.
              </span>
            </motion.h1>
            
            <motion.p variants={FADE_UP_ANIMATION_VARIANTS} className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 mb-10 leading-relaxed font-medium">
              The most authentic Computer-Based Test (CBT) simulator for Nigerian students. Build your speed, master your subjects, and secure your university admission.
            </motion.p>
            
            <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => navigate('/signup')}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all hover:scale-105 shadow-lg shadow-blue-200/50 group"
              >
                Start Practicing Now
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-all shadow-sm"
              >
                <PlayCircle className="mr-2 w-5 h-5 text-gray-500" />
                See How It Works
              </button>
            </motion.div>
            
            {/* Animated Floating UI Elements (Hero Imagery) */}
            <motion.div 
              variants={FADE_UP_ANIMATION_VARIANTS}
              className="mt-20 relative max-w-5xl mx-auto hidden md:block"
            >
              <div className="relative rounded-2xl border border-gray-200/60 shadow-2xl bg-white p-2">
                <div className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex flex-col h-80 relative">
                  {/* Mock Window Header */}
                  <div className="h-12 border-b border-gray-200 bg-white flex items-center px-4 justify-between">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                      <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                      <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm font-mono text-gray-500 bg-gray-100 px-3 py-1 rounded-md">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span>01:45:20</span>
                    </div>
                  </div>
                  {/* Mock Body */}
                  <div className="flex-1 flex p-6 gap-6 relative">
                    <div className="flex-1 space-y-4">
                      <div className="w-24 h-6 bg-blue-100 rounded-md"></div>
                      <div className="h-4 w-full bg-gray-200 rounded-md mt-4"></div>
                      <div className="h-4 w-5/6 bg-gray-200 rounded-md"></div>
                      <div className="space-y-3 pt-6">
                        <div className="h-12 w-full bg-white border-2 border-blue-500 rounded-xl"></div>
                        <div className="h-12 w-full bg-white border border-gray-200 rounded-xl"></div>
                        <div className="h-12 w-full bg-white border border-gray-200 rounded-xl"></div>
                      </div>
                    </div>
                    {/* Floating Sidebar element */}
                    <div className="w-48 bg-white border border-gray-200 rounded-xl shadow-sm p-4 hidden sm:block">
                      <div className="w-full h-8 bg-gray-100 rounded mb-4"></div>
                      <div className="grid grid-cols-4 gap-2">
                        {[...Array(12)].map((_, i) => (
                          <div key={i} className={`h-8 rounded-md ${i === 3 ? 'bg-yellow-400 ring-2 ring-yellow-200' : i < 5 ? 'bg-green-500' : 'bg-blue-100'}`}></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating overlay 1 */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -right-8 -top-8 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center space-x-4"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Result Analytics</p>
                    <p className="text-xl font-bold text-gray-900">Score: 312/400</p>
                  </div>
                </motion.div>
                
                {/* Floating overlay 2 */}
                <motion.div 
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -left-10 bottom-10 bg-white p-4 rounded-xl shadow-xl border border-gray-100"
                >
                  <div className="flex gap-2 flex-wrap max-w-[200px]">
                    <span className="px-3 py-1 bg-green-100 text-green-700 font-medium text-xs rounded-full shadow-sm mb-1">Use of English</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 font-medium text-xs rounded-full shadow-sm mb-1">Physics</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 font-medium text-xs rounded-full shadow-sm">Chemistry</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
                <div className="text-4xl font-extrabold text-blue-600 mb-2">180</div>
                <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Minutes Timer</div>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                <div className="text-4xl font-extrabold text-blue-600 mb-2">15+</div>
                <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">JAMB Subjects</div>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                <div className="text-4xl font-extrabold text-blue-600 mb-2">180</div>
                <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Total Questions</div>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
                <div className="text-4xl font-extrabold text-blue-600 mb-2">10k+</div>
                <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Happy Students</div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 bg-[#FBFBFA]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Your path to admission</h2>
              <p className="text-lg text-gray-600">Four simple steps to mastery. We designed the workflow to exactly mirror how candidates prepare and sit for the actual examination.</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8 relative">
              {/* Connecting line for desktop */}
              <div className="hidden md:block absolute top-8 left-16 right-16 h-0.5 bg-gray-200 z-0"></div>
              
              {[
                { step: "01", title: "Create Profile", desc: "Sign in with Google. Track your history securely." },
                { step: "02", title: "Pick Subjects", desc: "Select 4 subjects. Use of English automatically included." },
                { step: "03", title: "Take Mock Exam", desc: "180 questions in a strict 2-hour CBT environment." },
                { step: "04", title: "Analyze & Rank", desc: "View detailed results and climb the global leaderboard." }
              ].map((s, i) => (
                <motion.div 
                  key={s.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative z-10 flex flex-col items-center text-center group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white border-2 border-blue-600 text-blue-600 flex items-center justify-center text-xl font-bold mb-6 shadow-lg group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    {s.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-gray-600 px-4">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features - Bento Grid Style */}
        <section id="features" className="py-24 bg-white border-y border-gray-100 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Everything you need to score 300+</h2>
              <p className="text-lg text-gray-600">
                Bridging the gap between reading textbook chapters and executing flawlessly in a live computer-based environment.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Bento 1: Authentic UI */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="md:col-span-2 bg-[#F8FAFC] rounded-3xl p-8 border border-gray-200 overflow-hidden relative group hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-2xl mb-6">
                  <Laptop className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Authentic CBT Experience</h3>
                <p className="text-gray-600 leading-relaxed max-w-md">
                  Familiarize yourself with the exact digital layout you will face on exam day. Track answered, current, and unanswered queries seamlessly with our signature Question Palette.
                </p>
                <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity translate-x-10 translate-y-10">
                  <Laptop className="w-64 h-64 text-blue-600" />
                </div>
              </motion.div>

              {/* Bento 2: Timer */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-[#FFF1F2] rounded-3xl p-8 border border-red-100 hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-red-100 text-red-600 flex items-center justify-center rounded-2xl mb-6">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Time Management</h3>
                <p className="text-gray-600 leading-relaxed">
                  The exam is notoriously fast (120 mins). Our strict countdown timer trains your mental speed.
                </p>
              </motion.div>

              {/* Bento 3: Leaderboard & Analytics */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="md:col-span-3 bg-[#F0FDF4] rounded-3xl p-8 sm:p-10 border border-green-200 flex flex-col md:flex-row items-center justify-between hover:shadow-xl transition-shadow"
              >
                <div className="max-w-xl mb-8 md:mb-0">
                  <div className="w-12 h-12 bg-green-100 text-green-600 flex items-center justify-center rounded-2xl mb-6">
                    <LineChart className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Instant Leaderboard Rankings</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Identify your weak subjects instantly after submitting. The nationwide leaderboard sparks competition, keeping you motivated to surpass your peers before the real day.
                  </p>
                </div>
                <div className="w-full md:w-auto">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100 flex items-center space-x-6 transform rotate-2">
                       <div className="text-center">
                          <div className="text-4xl font-black text-green-600">#1</div>
                          <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">Global Rank</div>
                       </div>
                       <div className="h-12 w-px bg-gray-200"></div>
                       <div className="text-center">
                          <div className="text-4xl font-black text-gray-900">324</div>
                          <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">High Score</div>
                       </div>
                    </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Who this is for & Testimonial */}
        <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -m-32 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[120px] opacity-30"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl sm:text-5xl font-extrabold mb-8 tracking-tight text-white leading-tight">Built for your success.</h2>
                <div className="space-y-8">
                  <div className="flex items-start">
                    <div className="p-3 bg-gray-800 rounded-xl mr-5">
                      <Target className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">Secondary School Leavers</h4>
                      <p className="text-gray-400 leading-relaxed">Perfect for SS3 students stepping into their first major computer-based examination. We remove the software shock entirely.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="p-3 bg-gray-800 rounded-xl mr-5">
                      <GraduationCap className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">University Aspirants</h4>
                      <p className="text-gray-400 leading-relaxed">Made for candidates aiming for highly competitive courses (Medicine, Law, Engineering) where hitting exactly 300+ is mandatory.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="p-3 bg-gray-800 rounded-xl mr-5">
                      <Shield className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">Tutorial Centers</h4>
                      <p className="text-gray-400 leading-relaxed">A reliable, scalable mock-exam engine for teachers evaluating their students' readiness comprehensively before March.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-gray-800/80 backdrop-blur-lg rounded-3xl p-10 border border-gray-700 shadow-2xl relative"
              >
                <div className="absolute top-0 right-0 p-8 opacity-20">
                  <svg className="w-20 h-20 text-blue-500" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-1.1.9-2 2-2h4V8h-4zm14 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-1.1.9-2 2-2h4V8h-4z"></path>
                  </svg>
                </div>
                <blockquote className="text-2xl leading-relaxed font-serif text-gray-200 relative z-10">
                  "This application completely removed my fear of the CBT format. By the time I wrote the actual JAMB, navigating the questions and managing my time felt like second nature."
                </blockquote>
                <div className="mt-10 flex items-center relative z-10">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center font-bold text-xl ring-4 ring-gray-900 border border-white/10">
                    S
                  </div>
                  <div className="ml-4">
                    <div className="font-bold text-white text-lg">Samuel A.</div>
                    <div className="text-emerald-400 text-sm font-bold uppercase tracking-wider mt-1">Scored 312 • JAMB 2024</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section id="faq" className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-600">Common questions from our prospective candidates.</p>
            </div>
            
            <div className="space-y-6">
              {[
                { q: "Is JambPrep completely free?", a: "Yes. Basic mock exams and access to the global leaderboard are 100% free for all Nigerian students." },
                { q: "Do you use actual past questions?", a: "We curate high-quality questions mimicking past questions from official JAMB repositories stretching back to 2010." },
                { q: "Is Use of English strictly enforced?", a: "Yes! Just like the real exam, Use of English is compulsory and constitutes 60 questions, while your other 3 chosen subjects contain 40 questions each." },
              ].map((faq, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 relative group cursor-pointer hover:border-blue-200 transition-colors">
                  <div className="flex z-10 relative">
                    <div className="flex-shrink-0 mt-1">
                      <HelpCircle className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{faq.q}</h4>
                      <p className="text-gray-600">{faq.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="py-24 bg-blue-600 relative overflow-hidden">
          {/* Abstract geometric shapes */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
          </div>
          
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Don't leave your admission to chance.</h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">Join thousands of students pushing their limits today. Start practicing and see your name on the leaderboard.</p>
            <button
              onClick={() => navigate('/signup')}
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-blue-900 bg-white rounded-full hover:bg-gray-50 hover:scale-105 transition-all shadow-xl hover:shadow-2xl"
            >
              Get Started for Free
              <ArrowRight className="ml-2 w-5 h-5 text-blue-600" />
            </button>
          </div>
        </section>
      </main>

      {/* Massive Modern Footer */}
      <footer className="bg-gray-900 pt-20 pb-10 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 border-b border-gray-800 pb-16 mb-10">
            
            {/* Brand Col */}
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center space-x-2.5 mb-6">
                <div className="bg-blue-600 p-2 rounded-xl">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-extrabold tracking-tight text-white">JambPrep</span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6 max-w-sm">
                Built by a community of educators aiming to democratize access to high-quality JAMB CBT mock exams across Nigeria and beyond.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Links Col 1 */}
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wider uppercase text-sm">Product</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Mock Exams</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Leaderboards</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Subject Syllabuses</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Analytics Trackers</a></li>
              </ul>
            </div>

            {/* Links Col 2 */}
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wider uppercase text-sm">Support</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#faq" className="hover:text-blue-400 transition-colors">Help Center & FAQ</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Tutorial Centers</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Report bugs</a></li>
              </ul>
            </div>

            {/* Links Col 3 */}
            <div>
              <h4 className="text-white font-bold mb-6 tracking-wider uppercase text-sm">Legal</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
            
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p>&copy; {new Date().getFullYear()} JambPrep Inc. All rights reserved.</p>
            <p className="mt-4 md:mt-0 text-center md:text-right">
              Disclaimer: Not officially affiliated with the Joint Admissions and Matriculation Board (JAMB).
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
