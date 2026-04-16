import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, GraduationCap, Clock, LineChart, Target, CheckCircle } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export default function Landing() {
  const { user, login } = useAuth();

  // If already logged in, they can go straight to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-blue-200">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">JAMB PrepMaster</span>
          </div>
          <div>
            <button
              onClick={login}
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors shadow-sm"
            >
              Log in / Sign up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            {/* Background decorative blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100 mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-green-50 mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-8 border border-blue-100 shadow-sm">
              <GraduationCap className="h-4 w-4" />
              <span>Your Ultimate Guide to the 2026 JAMB CBT</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-8 leading-tight">
              Ace your JAMB exams. <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Without the stress.
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
              Experience the closest replica to the real Joint Admissions and Matriculation Board CBT. Train your speed, master your subjects, and track your performance against peers nationwide.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={login}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-transform hover:scale-105 shadow-lg shadow-blue-200"
              >
                Start Practicing Free
              </button>
            </div>
            
            {/* Minimal mockup illustration */}
            <div className="mt-16 sm:mt-24 max-w-4xl mx-auto border border-gray-200/60 rounded-2xl shadow-2xl bg-white/50 backdrop-blur-sm p-4 sm:p-8 transform rotate-1 md:rotate-2 transition-transform hover:rotate-0 duration-500">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                 <div className="flex space-x-2">
                   <div className="w-3 h-3 rounded-full bg-red-400"></div>
                   <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                   <div className="w-3 h-3 rounded-full bg-green-400"></div>
                 </div>
                 <div className="font-mono text-sm text-gray-500 font-medium">01:45:20 Remaining</div>
              </div>
              <div className="flex flex-col md:flex-row gap-6 text-left">
                <div className="flex-1">
                  <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse mb-6"></div>
                  <div className="space-y-3 mb-8">
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                    <div className="h-4 w-4/6 bg-gray-200 rounded"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-10 w-full bg-blue-50 border border-blue-100 rounded-lg"></div>
                    <div className="h-10 w-full bg-gray-50 border border-gray-100 rounded-lg"></div>
                    <div className="h-10 w-full bg-gray-50 border border-gray-100 rounded-lg"></div>
                    <div className="h-10 w-full bg-gray-50 border border-gray-100 rounded-lg"></div>
                  </div>
                </div>
                <div className="w-full md:w-48 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="grid grid-cols-4 gap-2">
                     {[...Array(16)].map((_, i) => (
                       <div key={i} className={`h-8 rounded ${i === 3 ? 'bg-yellow-300' : i < 5 ? 'bg-green-400' : 'bg-blue-400'}`}></div>
                     ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why it is important & Who is it for */}
        <section className="py-24 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Why Use JAMB PrepMaster?</h2>
              <p className="text-lg text-gray-600">
                Designed specifically for Nigerian students aiming for top tier scores. This platform bridges the gap between studying and practical exam execution.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-xl mb-6">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Time Management</h3>
                <p className="text-gray-600 leading-relaxed">
                  The JAMB exam is notoriously fast-paced (120 mins for 180 questions). Our strict simulated timer trains your speed and pressure resistance.
                </p>
              </div>

              <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-green-100 text-green-600 flex items-center justify-center rounded-xl mb-6">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Authentic CBT Experience</h3>
                <p className="text-gray-600 leading-relaxed">
                  Familiarize yourself with the exact digital layout you will face on exam day. Features like the 'question palette' ensure you never get lost.
                </p>
              </div>

              <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 flex items-center justify-center rounded-xl mb-6">
                  <LineChart className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Performance Tracking</h3>
                <p className="text-gray-600 leading-relaxed">
                  Identify your weak subjects instantly after submitting. The nationwide leaderboard sparks healthy competition to keep you motivated.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Who this is for */}
        <section className="py-24 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 tracking-tight">Who is this platform for?</h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-400 mt-1 mr-4 flex-shrink-0" />
                    <div>
                      <h4 className="text-lg font-bold">Secondary School Leavers</h4>
                      <p className="text-gray-400 mt-1">Perfect for SS3 students stepping into their first major computer-based examination.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-400 mt-1 mr-4 flex-shrink-0" />
                    <div>
                      <h4 className="text-lg font-bold">University Aspirants</h4>
                      <p className="text-gray-400 mt-1">Candidates re-taking JAMB or aiming for high competition courses like Medicine & Law.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-400 mt-1 mr-4 flex-shrink-0" />
                    <div>
                      <h4 className="text-lg font-bold">Tutorial Centers</h4>
                      <p className="text-gray-400 mt-1">A reliable mock-exam engine for teachers evaluating their students' readiness.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-3xl p-10 border border-gray-700 shadow-2xl relative shadow-blue-900/20">
                <blockquote className="text-xl leading-relaxed italic text-gray-300">
                  "This application completely removed my fear of the computer-based test format. By the time I wrote the actual JAMB, navigating the questions felt like second nature."
                </blockquote>
                <div className="mt-8 flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center font-bold text-lg">
                    S
                  </div>
                  <div className="ml-4">
                    <div className="font-bold text-white">Samuel A.</div>
                    <div className="text-gray-500 text-sm">Scored 312 in JAMB 2024</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-white text-center border-t border-gray-100">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">Ready to boost your score?</h2>
            <p className="text-xl text-gray-600 mb-10">Join thousands of students simulating the real exam experience today.</p>
            <button
              onClick={login}
              className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-transform hover:scale-105 shadow-xl shadow-blue-200"
            >
              Get Started for Free
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
             <BookOpen className="h-5 w-5 text-gray-400" />
             <span className="font-medium text-gray-600">JAMB PrepMaster</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} JAMB PrepMaster. Not affiliated with the official Joint Admissions and Matriculation Board.
          </div>
        </div>
      </footer>
    </div>
  );
}
