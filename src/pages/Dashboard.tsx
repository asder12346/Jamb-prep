import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, doc, onSnapshot, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LogOut, Trophy, PlayCircle, X, CheckCircle2, AlertCircle, Target, Flame, Activity, History, ArrowRight } from 'lucide-react';
import { SUBJECTS } from '../data/jamb_data';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedDropdownSubject, setSelectedDropdownSubject] = useState<string>('');
  const [loading, setLoading] = useState(true);
  
  const [recentExams, setRecentExams] = useState<any[]>([]);
  const [stats, setStats] = useState({ predictedScore: 0, totalExams: 0, avgAccuracy: 0, weakestSubjects: [] as {id: string, accuracy: number}[] });

  useEffect(() => {
    if (!user) return;

    // Listen to user's selected subjects
    const unsubscribeUser = onSnapshot(doc(db, 'users', user.uid), async (docSnap) => {
      if (docSnap.exists()) {
        const dbSubjects = docSnap.data().selectedSubjects || [];
        if (!dbSubjects.includes('eng')) {
          const withEng = ['eng', ...dbSubjects];
          setSelectedSubjects(withEng);
          try {
            await updateDoc(doc(db, 'users', user.uid), {
              selectedSubjects: withEng
            });
          } catch (e) {
            console.error(e);
          }
        } else {
          setSelectedSubjects(dbSubjects);
        }
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
      setLoading(false);
    });

    // Fetch user's exams history
    const fetchExams = async () => {
      try {
        const q = query(collection(db, 'exam_results'), where('userId', '==', user.uid));
        const snap = await getDocs(q);
        const exams = snap.docs.map(d => ({id: d.id, ...d.data()})).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        setRecentExams(exams.slice(0, 5)); // Keep top 5 latest
        
        if (exams.length > 0) {
          let totalScore = 0;
          let totalQs = 0;
          
          // Data structure for weak subject analysis
          const subjectPerformances: Record<string, { correct: number, total: number }> = {};

          exams.forEach((ex: any) => {
            totalScore += ex.score;
            totalQs += ex.total;
            
            // Build subject breakdown aggregate
            if (ex.breakdown) {
               Object.keys(ex.breakdown).forEach(subId => {
                  if (!subjectPerformances[subId]) {
                     subjectPerformances[subId] = { correct: 0, total: 0 };
                  }
                  subjectPerformances[subId].correct += ex.breakdown[subId].correct;
                  subjectPerformances[subId].total += ex.breakdown[subId].total;
               });
            }
          });
          
          const accuracy = totalQs > 0 ? (totalScore / totalQs) : 0;
          
          // Calculate weakest subjects
          const subjectAccuracies = Object.keys(subjectPerformances).map(subId => ({
             id: subId,
             accuracy: subjectPerformances[subId].total > 0 
                ? subjectPerformances[subId].correct / subjectPerformances[subId].total 
                : 0
          }));
          
          subjectAccuracies.sort((a, b) => a.accuracy - b.accuracy);
          const weakestSubjects = subjectAccuracies.slice(0, 2);

          setStats({
            predictedScore: Math.round(accuracy * 400),
            totalExams: exams.length,
            avgAccuracy: Math.round(accuracy * 100),
            // @ts-ignore
            weakestSubjects: weakestSubjects
          });
        }
      } catch (err) {
        console.error("Failed to load history", err);
      }
    };

    fetchExams();

    return () => {
      unsubscribeUser();
    };
  }, [user]);

  const handleAddSubject = async () => {
    if (!user || !selectedDropdownSubject) return;
    if (selectedSubjects.includes(selectedDropdownSubject)) return;
    
    const newSelected = [...selectedSubjects, selectedDropdownSubject];
    if (newSelected.length > 4) {
      alert("You can only select up to 4 subjects for JAMB.");
      return;
    }

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        selectedSubjects: newSelected
      });
      setSelectedDropdownSubject('');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const handleRemoveSubject = async (subjectId: string) => {
    if (!user) return;
    if (subjectId === 'eng') {
      alert("Use of English is compulsory and cannot be removed.");
      return;
    }
    try {
      const newSelected = selectedSubjects.filter(id => id !== subjectId);
      await updateDoc(doc(db, 'users', user.uid), {
        selectedSubjects: newSelected
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const startExam = () => {
    if (selectedSubjects.length !== 4) {
      alert("Please select exactly 4 subjects to start the mock exam.");
      return;
    }
    navigate('/exam');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const subjectsNeeded = 4 - selectedSubjects.length;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="bg-blue-600 p-1.5 rounded-lg mr-2">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">JambPrep</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/leaderboard')}
                className="text-gray-600 hover:text-blue-600 flex items-center font-medium transition-colors p-2 sm:px-3 sm:py-2 rounded-md hover:bg-gray-100"
              >
                <Trophy className="h-5 w-5 sm:mr-1.5 text-yellow-500" />
                <span className="hidden sm:inline">Leaderboard</span>
              </button>
              <div className="hidden sm:block w-px h-6 bg-gray-200 mx-1"></div>
              <div className="flex items-center space-x-3">
                 <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold shadow-sm">
                   {user?.displayName?.charAt(0) || 'U'}
                 </div>
                 <span className="text-sm font-medium text-gray-700 hidden md:inline">Hi, {user?.displayName?.split(' ')[0]}</span>
              </div>
              <button
                onClick={logout}
                className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50 ml-2"
                title="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Welcome back, {user?.displayName}!</h1>
          <p className="mt-2 text-slate-600">Let's keep up the momentum. Here is your progress overview.</p>
        </div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           {/* Card 1: Predicted Score */}
           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between overflow-hidden relative group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Predicted Score</h3>
                  <div className="bg-blue-100 p-2 rounded-xl text-blue-600"><Target className="w-5 h-5" /></div>
                </div>
                <div className="flex items-baseline space-x-2">
                   <h2 className="text-5xl font-black text-gray-900">{stats.predictedScore || '--'}</h2>
                   <span className="text-lg font-medium text-gray-500">/ 400</span>
                </div>
                <p className="mt-4 text-sm font-medium text-blue-600">Based on {stats.totalExams} mock exams</p>
              </div>
           </div>

           {/* Card 2: Win Streak */}
           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between overflow-hidden relative group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-orange-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Study Streak</h3>
                  <div className="bg-orange-100 p-2 rounded-xl text-orange-500"><Flame className="w-5 h-5" /></div>
                </div>
                <div className="flex items-baseline space-x-2">
                   <h2 className="text-5xl font-black text-gray-900">1</h2>
                   <span className="text-lg font-medium text-gray-500">Day</span>
                </div>
                <p className="mt-4 text-sm font-medium text-orange-500">Start practicing to boost your streak!</p>
              </div>
           </div>

           {/* Card 3: Avg Accuracy */}
           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between overflow-hidden relative group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out z-0"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Avg. Accuracy</h3>
                  <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600"><Activity className="w-5 h-5" /></div>
                </div>
                <div className="flex items-baseline space-x-1">
                   <h2 className="text-5xl font-black text-gray-900">{stats.avgAccuracy || 0}</h2>
                   <span className="text-3xl font-bold text-gray-900">%</span>
                </div>
                <p className="mt-4 text-sm font-medium text-emerald-600">Accuracy rate across all tests</p>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Subject Configuration & Start Exam */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 mr-2" />
                    Configure Exam Subects
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                     Select exactly 4 subjects for your next mock exam session.
                  </p>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <select
                    value={selectedDropdownSubject}
                    onChange={(e) => setSelectedDropdownSubject(e.target.value)}
                    className="flex-1 rounded-xl border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-3 font-medium text-gray-700 bg-gray-50"
                  >
                    <option value="">-- Choose a subject to add --</option>
                    {SUBJECTS.filter(s => !selectedSubjects.includes(s.id) && s.id !== 'eng').map(subject => (
                      <option key={subject.id} value={subject.id}>{subject.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleAddSubject}
                    disabled={!selectedDropdownSubject || selectedSubjects.length >= 4}
                    className="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Add Subject
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {selectedSubjects.map((subjectId) => {
                    const subject = SUBJECTS.find(s => s.id === subjectId);
                    if (!subject) return null;
                    const isEnglish = subject.id === 'eng';
                    return (
                      <div
                        key={subject.id}
                        className={`relative rounded-xl border p-4 flex items-center justify-between ${isEnglish ? 'border-emerald-200 bg-emerald-50 shadow-sm' : 'border-blue-200 bg-blue-50/50 shadow-sm'}`}
                      >
                        <span className={`font-semibold ${isEnglish ? 'text-emerald-900' : 'text-blue-900'}`}>
                          {subject.name} {isEnglish && <span className="text-emerald-600 text-xs ml-1 font-bold uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded-full">(Compulsory)</span>}
                        </span>
                        {!isEnglish && (
                          <button
                            onClick={() => handleRemoveSubject(subject.id)}
                            className="text-blue-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                            title="Remove subject"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                  
                  {Array.from({ length: Math.max(0, 4 - selectedSubjects.length) }).map((_, i) => (
                    <div key={`empty-${i}`} className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-4 flex items-center justify-center text-gray-400 font-medium h-[68px]">
                       <span className="text-sm">+ Select Subject</span>
                    </div>
                  ))}
                </div>

                {subjectsNeeded > 0 && (
                  <div className="mt-6 flex items-center space-x-2 text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">Please add {subjectsNeeded} more {subjectsNeeded === 1 ? 'subject' : 'subjects'} to continue.</span>
                  </div>
                )}
                
                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                   <button
                    onClick={startExam}
                    disabled={selectedSubjects.length !== 4}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 border border-transparent rounded-xl shadow-lg shadow-blue-500/30 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:shadow-none transition-all disabled:cursor-not-allowed group"
                  >
                    <PlayCircle className="h-5 w-5 mr-2" />
                    Start Full CBT Mock
                  </button>
                </div>
              </div>
            </div>
            
            {/* Next Milestone Motivation Card */}
            <div className="bg-gradient-to-r from-gray-900 to-indigo-900 rounded-2xl shadow-sm border border-gray-800 p-6 flex items-center justify-between text-white">
               <div>
                  <h3 className="font-bold text-lg mb-1">Consistency is key!</h3>
                  <p className="text-indigo-200 text-sm max-w-md">Take at least 3 exams this week to unlock the "Active Scholar" badge and boost your global ranking.</p>
               </div>
               <div className="hidden sm:flex items-center justify-center w-16 h-16 rounded-full bg-white/10 border border-white/20">
                  <ArrowRight className="w-8 h-8 text-indigo-300" />
               </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Recent History Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
               <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                 <h3 className="text-lg font-bold text-gray-900 flex items-center">
                   <History className="w-5 h-5 mr-2 text-gray-400" />
                   Recent Activity
                 </h3>
               </div>
               <div className="p-0">
                  {recentExams.length > 0 ? (
                    <ul className="divide-y divide-gray-100">
                      {recentExams.map((exam, idx) => (
                         <li key={idx} className="p-5 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                               <span className="text-xs font-semibold text-gray-500 uppercase">{new Date(exam.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                               <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{exam.score} / {exam.total}</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2 mb-1 overflow-hidden">
                               <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(exam.score / exam.total) * 100}%` }}></div>
                            </div>
                            <div className="text-right text-xs font-medium text-gray-400">{Math.round((exam.score / exam.total) * 100)}% Accuracy</div>
                         </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                       <p className="text-sm">No recent mock exams taken.</p>
                       <p className="text-xs mt-1 text-gray-400">Your history will appear here.</p>
                    </div>
                  )}
               </div>
            </div>
            
            {/* Recommended Area Card placeholder */}
            <div className="bg-indigo-50/50 rounded-2xl shadow-sm border border-indigo-100 overflow-hidden">
               <div className="px-6 py-5">
                 <h3 className="text-md font-bold text-indigo-900 flex items-center mb-3">
                   <Target className="w-5 h-5 mr-2 text-indigo-500" />
                   Smart Recommendations
                 </h3>
                 
                 {stats.totalExams === 0 ? (
                   <>
                     <p className="text-sm text-indigo-700/80 mb-4 leading-relaxed">
                       Complete more exams to allow our AI to generate a personalized practice flow identifying your weakest subjects.
                     </p>
                     <div className="h-2 w-full bg-indigo-100 rounded-full overflow-hidden">
                       <div className="h-full bg-indigo-400 w-1/3 rounded-full"></div>
                     </div>
                     <div className="text-xs text-indigo-500 font-medium mt-2 text-right">Analyzing data...</div>
                   </>
                 ) : (
                   <div className="space-y-4">
                     <p className="text-sm text-indigo-800 font-medium">Based on your past {stats.totalExams} mock exams, we recommend focusing on:</p>
                     
                     <div className="space-y-3">
                       {stats.weakestSubjects.length > 0 ? stats.weakestSubjects.map((sub, idx) => {
                         const subName = SUBJECTS.find(s => s.id === sub.id)?.name || sub.id;
                         return (
                           <div key={idx} className="bg-white p-3 rounded-xl border border-indigo-100 shadow-sm flex items-center justify-between">
                             <div className="flex items-center space-x-3">
                               <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center font-bold text-xs">
                                 {Math.round(sub.accuracy * 100)}%
                               </div>
                               <span className="font-semibold text-gray-800 text-sm">{subName}</span>
                             </div>
                             <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Priority</div>
                           </div>
                         );
                       }) : (
                          <div className="text-sm text-gray-500 italic">No weak subjects detected yet. Great job!</div>
                       )}
                     </div>
                     
                     <p className="text-xs text-indigo-600/70 mt-4 border-t border-indigo-100 pt-3">
                       Make sure these subjects are included in your next CBT configuration to improve your global ranking.
                     </p>
                   </div>
                 )}
               </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
