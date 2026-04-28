import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Trophy, ArrowLeft, Medal, Zap, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ExamResult {
  id: string;
  userId: string;
  score: number;
  total: number;
  date: string;
  userName?: string;
}

interface UserXPInfo {
  id: string;
  displayName: string;
  totalXP: number;
}

export default function Leaderboard() {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [xpLeaders, setXpLeaders] = useState<UserXPInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'highScores' | 'xp'>('highScores');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        if (tab === 'highScores') {
          // Fetch top 50 scores
          const q = query(collection(db, 'exam_results'), orderBy('score', 'desc'), limit(50));
          const snapshot = await getDocs(q);
          
          const fetchedResults: ExamResult[] = [];
          
          snapshot.forEach(doc => {
            const data = doc.data();
            fetchedResults.push({ id: doc.id, ...data } as ExamResult);
          });

          const finalResults = fetchedResults.map(r => ({
            ...r,
            userName: r.userName || 'Student'
          }));

          setResults(finalResults);
        } else {
          // Fetch top 50 users by total XP
          const q = query(collection(db, 'user_stats'), orderBy('totalXP', 'desc'), limit(50));
          const snapshot = await getDocs(q);
          
          const fetchedUsers: UserXPInfo[] = [];
          
          snapshot.forEach(doc => {
            const data = doc.data();
            if (data.totalXP) {
              fetchedUsers.push({ id: doc.id, displayName: data.displayName || 'Student', totalXP: data.totalXP });
            }
          });
          setXpLeaders(fetchedUsers);
        }
        setLoading(false);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, tab === 'highScores' ? 'exam_results' : 'user_stats');
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [tab]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/dashboard')} 
              className="mr-6 p-2 rounded-full border border-gray-200 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors shadow-sm bg-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
              Global Leaderboard
            </h1>
          </div>
          <div className="flex bg-gray-200 p-1 rounded-xl w-full sm:w-auto overflow-hidden">
             <button
                onClick={() => setTab('highScores')}
                className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'highScores' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
                <Star className="w-4 h-4" />
                <span>High Scores</span>
             </button>
             <button
                onClick={() => setTab('xp')}
                className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'xp' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
                <Zap className="w-4 h-4" />
                <span>Top Scholars</span>
             </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex py-20 items-center justify-center">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white shadow-sm border border-gray-200 overflow-hidden sm:rounded-2xl">
            <div className={`px-6 py-4 border-b border-gray-200 grid grid-cols-12 gap-4 text-xs font-semibold uppercase tracking-wider ${tab === 'xp' ? 'bg-orange-50 text-orange-800' : 'bg-blue-50 text-blue-800'}`}>
               <div className="col-span-2 text-center">Rank</div>
               <div className="col-span-6">Candidate</div>
               <div className="col-span-4 text-right">{tab === 'highScores' ? 'Score' : 'Level & XP'}</div>
            </div>
            <ul className="divide-y divide-gray-100">
              {tab === 'highScores' && results.map((result, index) => (
                <li key={result.id} className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-blue-50/50 transition-colors cursor-default">
                  <div className="col-span-2 flex justify-center">
                    {index === 0 ? <div className="bg-yellow-100 p-2 rounded-full shadow-sm"><Medal className="h-7 w-7 text-yellow-500" /></div> :
                     index === 1 ? <div className="bg-gray-100 p-2 rounded-full shadow-sm"><Medal className="h-7 w-7 text-gray-400" /></div> :
                     index === 2 ? <div className="bg-amber-100 p-2 rounded-full shadow-sm"><Medal className="h-7 w-7 text-amber-600" /></div> :
                     <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-gray-500 bg-gray-50 border border-gray-100">#{index + 1}</div>}
                  </div>
                  <div className="col-span-6 flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm flex-shrink-0 mr-4">
                      {result.userName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="text-base font-bold text-gray-900">{result.userName}</div>
                      <div className="text-xs font-medium text-gray-500 mt-0.5">
                        Completed {new Date(result.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-4 text-right flex flex-col items-end">
                    <div className="bg-green-50 px-3 py-1 rounded-lg border border-green-100 inline-block mb-1">
                       <span className="text-xl font-black text-green-700">{result.score}</span>
                       <span className="text-sm font-semibold text-green-600/60 ml-1">/ {result.total}</span>
                    </div>
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                       {Math.round((result.score / result.total) * 100)}%
                    </div>
                  </div>
                </li>
              ))}
              
              {tab === 'xp' && xpLeaders.map((user, index) => (
                <li key={user.id} className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-orange-50/50 transition-colors cursor-default">
                  <div className="col-span-2 flex justify-center">
                    {index === 0 ? <div className="bg-yellow-100 p-2 rounded-full shadow-sm"><Medal className="h-7 w-7 text-yellow-500" /></div> :
                     index === 1 ? <div className="bg-gray-100 p-2 rounded-full shadow-sm"><Medal className="h-7 w-7 text-gray-400" /></div> :
                     index === 2 ? <div className="bg-amber-100 p-2 rounded-full shadow-sm"><Medal className="h-7 w-7 text-amber-600" /></div> :
                     <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-gray-500 bg-gray-50 border border-gray-100">#{index + 1}</div>}
                  </div>
                  <div className="col-span-6 flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold shadow-sm flex-shrink-0 mr-4">
                      {user.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-base font-bold text-gray-900">{user.displayName}</div>
                      <div className="text-xs font-medium text-orange-600 mt-0.5">
                        Level {Math.floor(user.totalXP / 1000) + 1} Scholar
                      </div>
                    </div>
                  </div>
                  <div className="col-span-4 text-right flex flex-col items-end">
                    <div className="bg-orange-50 px-3 py-1 rounded-lg border border-orange-200 inline-flex items-center mb-1">
                       <Zap className="w-4 h-4 text-orange-500 mr-1" />
                       <span className="text-xl font-black text-orange-700">{user.totalXP}</span>
                    </div>
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                       Total XP
                    </div>
                  </div>
                </li>
              ))}

              {tab === 'highScores' && results.length === 0 && (
                <li className="px-6 py-16 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                     <Trophy className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">No scores recorded yet</h3>
                  <p className="text-gray-500">Go to your dashboard to take an exam and be the very first!</p>
                </li>
              )}
              {tab === 'xp' && xpLeaders.length === 0 && (
                <li className="px-6 py-16 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                     <Zap className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">No XP leaders found</h3>
                  <p className="text-gray-500">Earn XP by completing exams to appear here.</p>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
