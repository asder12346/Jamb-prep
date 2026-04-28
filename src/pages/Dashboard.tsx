import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, doc, onSnapshot, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LogOut, Trophy, PlayCircle, X, CheckCircle2, AlertCircle, Target, Flame, Activity, History, ArrowRight } from 'lucide-react';
import { SUBJECTS } from '../data/jamb_data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedDropdownSubject, setSelectedDropdownSubject] = useState<string>('');
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [recentExams, setRecentExams] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [stats, setStats] = useState({ predictedScore: 0, totalExams: 0, avgAccuracy: 0, streak: 0, totalXP: 0, weakestSubjects: [] as {id: string, accuracy: number}[] });

  useEffect(() => {
    if (!user) return;

    // Listen to user's selected subjects and profile details
    const unsubscribeUser = onSnapshot(doc(db, 'users', user.uid), async (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const dbSubjects = data.selectedSubjects || [];
        
        if (data.profilePicture) {
           setProfilePic(data.profilePicture);
        }
        
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
        
        // Prepare chart data chronologically
        const chronologicalExams = [...exams].reverse();
        const dataForChart = chronologicalExams.map((exam: any, index: number) => {
           let accuracy = exam.total > 0 ? Math.round((exam.score / exam.total) * 100) : 0;
           return {
              name: `Exam ${index + 1}`,
              date: new Date(exam.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
              accuracy: accuracy,
           };
        });
        setChartData(dataForChart);
        
        if (exams.length > 0) {
          let totalScore = 0;
          let totalQs = 0;
          let calculatedXP = 0;
          
          // Calculate Streak logic
          const uniqueDays = [...new Set(exams.map((ex: any) => {
             const d = new Date(ex.date);
             return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
          }))];
          
          let currentStreak = 0;
          let checkDate = new Date();
          // Check if they did one today or yesterday to continue streak
          const todayStr = `${checkDate.getFullYear()}-${checkDate.getMonth()}-${checkDate.getDate()}`;
          checkDate.setDate(checkDate.getDate() - 1);
          const yesterdayStr = `${checkDate.getFullYear()}-${checkDate.getMonth()}-${checkDate.getDate()}`;
          
          let dayIndex = 0;
          let trackingDate = new Date();
          // Adjust starting point to yesterday if they haven't done one today yet but did one yesterday
          if (!uniqueDays.includes(todayStr) && uniqueDays.includes(yesterdayStr)) {
             trackingDate.setDate(trackingDate.getDate() - 1);
          }
          
          while(true) {
             const dStr = `${trackingDate.getFullYear()}-${trackingDate.getMonth()}-${trackingDate.getDate()}`;
             if (uniqueDays.includes(dStr)) {
                currentStreak++;
                trackingDate.setDate(trackingDate.getDate() - 1);
             } else {
                break;
             }
          }

          // Data structure for weak subject analysis
          const subjectPerformances: Record<string, { correct: number, total: number }> = {};

          exams.forEach((ex: any) => {
            totalScore += ex.score;
            totalQs += ex.total;
            calculatedXP += (ex.score || 0);
            
            // Build subject breakdown aggregate
            if (ex.breakdown || ex.subjectBreakdown) {
               const breakdownObj = ex.subjectBreakdown || ex.breakdown;
               Object.keys(breakdownObj).forEach(subId => {
                  if (!subjectPerformances[subId]) {
                     subjectPerformances[subId] = { correct: 0, total: 0 };
                  }
                  subjectPerformances[subId].correct += breakdownObj[subId].correct;
                  subjectPerformances[subId].total += breakdownObj[subId].total;
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
            streak: currentStreak,
            totalXP: calculatedXP,
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
    <div className="min-h-screen bg-[#FBFBFA] font-sans">
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20 transition-all">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl shadow-md text-white">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-gray-900 hidden sm:block">
                JambPrep<span className="text-blue-600">.</span>
              </span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => navigate('/leaderboard')}
                className="text-gray-600 hover:text-blue-600 flex items-center font-bold transition-all p-2 sm:px-4 sm:py-2 rounded-full hover:bg-blue-50"
              >
                <Trophy className="h-5 w-5 sm:mr-2 text-amber-500" />
                <span className="hidden sm:inline">Leaderboard</span>
              </button>
              <div className="hidden sm:block w-px h-6 bg-gray-200 mx-1"></div>
              <button 
                 onClick={() => navigate('/profile')}
                 className="flex items-center space-x-3 p-1 rounded-full hover:bg-blue-50 transition-colors sm:pr-4 border border-transparent hover:border-blue-100 group"
                 title="Go to Profile"
              >
                 <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold shadow-sm overflow-hidden border-2 border-white group-hover:border-blue-200 transition-colors">
                   {profilePic ? (
                     <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                   ) : (
                     user?.displayName?.charAt(0)?.toUpperCase() || 'U'
                   )}
                 </div>
                 <span className="text-sm font-bold text-gray-700 hidden md:inline group-hover:text-blue-600 transition-colors">
                   {user?.displayName?.split(' ')[0] || 'User'}
                 </span>
              </button>
              <button
                onClick={logout}
                className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 ml-1"
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
                   <h2 className="text-5xl font-black text-gray-900">{stats.streak}</h2>
                   <span className="text-lg font-medium text-gray-500">Day{stats.streak !== 1 ? 's' : ''}</span>
                </div>
                <p className="mt-4 text-sm font-medium text-orange-500">
                  {stats.streak > 2 ? 'You are on fire! 🔥 Keep it up!' : 'Start practicing to boost your streak!'}
                </p>
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
            
            {/* Visual Progress Tracker */}
            {chartData.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 relative">
                 <h2 className="text-xl font-bold text-gray-900 flex items-center mb-6">
                    <Activity className="w-5 h-5 text-blue-600 mr-2" />
                    Accuracy Over Time
                 </h2>
                 <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dx={-10} domain={[0, 100]} />
                        <Tooltip 
                           contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                           labelStyle={{ fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}
                           itemStyle={{ color: '#2563EB', fontWeight: 'bold' }}
                           formatter={(value: number) => [`${value}%`, 'Accuracy']}
                           labelFormatter={(label: string, payload: any[]) => {
                              if (payload && payload.length > 0) {
                                 return `${label} (${payload[0].payload.date})`;
                              }
                              return label;
                           }}
                        />
                        <Line type="monotone" dataKey="accuracy" stroke="#2563EB" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#2563EB' }} activeDot={{ r: 6, strokeWidth: 0, fill: '#2563EB' }} />
                      </LineChart>
                    </ResponsiveContainer>
                 </div>
              </div>
            )}

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
            
            {/* Level and XP Progress Card */}
            <div className="bg-gradient-to-r from-gray-900 via-indigo-900 to-blue-900 rounded-2xl shadow-xl border border-gray-800 p-6 text-white relative overflow-hidden group">
               <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-5 rounded-full blur-[40px] group-hover:opacity-10 transition-opacity"></div>
               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
                 <div className="flex items-center space-x-6">
                    <div className="relative">
                       <svg className="w-20 h-20 transform -rotate-90">
                         <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-700" />
                         <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="transparent" 
                           strokeDasharray={36 * 2 * Math.PI} 
                           strokeDashoffset={36 * 2 * Math.PI * (1 - ((stats.totalXP % 1000) / 1000))} 
                           className="text-amber-400 transition-all duration-1000 ease-out" strokeLinecap="round" />
                       </svg>
                       <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <span className="text-xs font-bold text-amber-200">LVL</span>
                         <span className="text-xl font-black text-amber-400 leading-none">{Math.floor(stats.totalXP / 1000) + 1}</span>
                       </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-2xl mb-1 text-white">Experience Points</h3>
                      <p className="text-indigo-200 text-sm max-w-md">
                        {stats.totalXP} TOTAL XP • {(1000 - (stats.totalXP % 1000))} XP to next level
                      </p>
                    </div>
                 </div>
                 <div className="hidden sm:flex flex-col items-center justify-center bg-white/10 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <span className="text-sm font-bold text-indigo-300 uppercase tracking-wider mb-1">Rank Status</span>
                    <span className="text-lg font-black text-white capitalize">{Math.floor(stats.totalXP / 1000) + 1 >= 5 ? 'Elite Scholar' : Math.floor(stats.totalXP / 1000) + 1 >= 3 ? 'Dedicated Student' : 'Novice Learner'}</span>
                 </div>
               </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            
            {/* Trophies & Achievements */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
               <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                 <h3 className="text-sm font-bold text-amber-900 flex items-center uppercase tracking-wider">
                   <Trophy className="w-4 h-4 mr-2 text-amber-500" />
                   Recent Badges
                 </h3>
               </div>
               <div className="p-5 grid grid-cols-3 gap-3">
                 <div className={`flex flex-col items-center p-3 rounded-xl border ${stats.totalExams > 0 ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-100 opacity-50 grayscale'}`}>
                   <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mb-2 border border-amber-100">
                     <span className="text-xl">🎯</span>
                   </div>
                   <span className={`text-[10px] font-bold text-center leading-tight ${stats.totalExams > 0 ? 'text-amber-900' : 'text-gray-500'}`}>First Steps</span>
                 </div>
                 <div className={`flex flex-col items-center p-3 rounded-xl border ${stats.streak >= 3 ? 'bg-orange-50 border-orange-200' : 'bg-gray-50 border-gray-100 opacity-50 grayscale'}`}>
                   <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mb-2 border border-orange-100">
                     <span className="text-xl">🔥</span>
                   </div>
                   <span className={`text-[10px] font-bold text-center leading-tight ${stats.streak >= 3 ? 'text-orange-900' : 'text-gray-500'}`}>3 Day Streak</span>
                 </div>
                 <div className={`flex flex-col items-center p-3 rounded-xl border ${stats.avgAccuracy >= 80 ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-100 opacity-50 grayscale'}`}>
                   <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mb-2 border border-emerald-100">
                     <span className="text-xl">🧠</span>
                   </div>
                   <span className={`text-[10px] font-bold text-center leading-tight ${stats.avgAccuracy >= 80 ? 'text-emerald-900' : 'text-gray-500'}`}>Top Brain</span>
                 </div>
               </div>
            </div>

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
