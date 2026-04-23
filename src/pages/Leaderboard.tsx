import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Trophy, ArrowLeft, Medal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ExamResult {
  id: string;
  userId: string;
  score: number;
  total: number;
  date: string;
  userName?: string;
}

export default function Leaderboard() {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Fetch top 50 scores
        const q = query(collection(db, 'exam_results'), orderBy('score', 'desc'), limit(50));
        const snapshot = await getDocs(q);
        
        const fetchedResults: ExamResult[] = [];
        const userIds = new Set<string>();
        
        snapshot.forEach(doc => {
          const data = doc.data();
          fetchedResults.push({ id: doc.id, ...data } as ExamResult);
        });

        const finalResults = fetchedResults.map(r => ({
          ...r,
          userName: r.userName || 'Student'
        }));

        setResults(finalResults);
        setLoading(false);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'exam_results');
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
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
          <div className="hidden sm:block">
            <div className="inline-flex items-center space-x-2 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold border border-yellow-200 shadow-sm">
              <Trophy className="h-4 w-4" />
              <span>Top 50 Students</span>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 overflow-hidden sm:rounded-2xl">
          <div className="bg-blue-50 px-6 py-4 border-b border-gray-200 grid grid-cols-12 gap-4 text-xs font-semibold text-blue-800 uppercase tracking-wider">
             <div className="col-span-2 text-center">Rank</div>
             <div className="col-span-6">Candidate</div>
             <div className="col-span-4 text-right">Score</div>
          </div>
          <ul className="divide-y divide-gray-100">
            {results.map((result, index) => (
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
            {results.length === 0 && (
              <li className="px-6 py-16 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                   <Trophy className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">No scores recorded yet</h3>
                <p className="text-gray-500">Go to your dashboard to take an exam and be the very first!</p>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
