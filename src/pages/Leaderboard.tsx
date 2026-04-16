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
          userIds.add(data.userId);
        });

        // Fetch user details
        const usersMap: Record<string, string> = {};
        for (const uid of Array.from(userIds)) {
           const userDoc = await getDoc(doc(db, 'users', uid));
           if (userDoc.exists()) {
             usersMap[uid] = userDoc.data().name || 'Unknown User';
           }
        }

        const finalResults = fetchedResults.map(r => ({
          ...r,
          userName: usersMap[r.userId] || 'Unknown User'
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
    return <div className="min-h-screen flex items-center justify-center">Loading Leaderboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => navigate('/dashboard')} className="mr-4 text-gray-500 hover:text-gray-900">
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Trophy className="h-8 w-8 text-yellow-500 mr-3" />
              Leaderboard
            </h1>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {results.map((result, index) => (
              <li key={result.id} className="px-6 py-4 flex items-center hover:bg-gray-50">
                <div className="flex-shrink-0 w-12 text-center">
                  {index === 0 ? <Medal className="h-8 w-8 text-yellow-500 mx-auto" /> :
                   index === 1 ? <Medal className="h-8 w-8 text-gray-400 mx-auto" /> :
                   index === 2 ? <Medal className="h-8 w-8 text-amber-600 mx-auto" /> :
                   <span className="text-xl font-bold text-gray-500">#{index + 1}</span>}
                </div>
                <div className="ml-6 flex-1">
                  <div className="text-lg font-medium text-gray-900">{result.userName}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(result.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="ml-6 text-right">
                  <div className="text-2xl font-bold text-blue-600">{result.score}</div>
                  <div className="text-sm text-gray-500">out of {result.total}</div>
                </div>
              </li>
            ))}
            {results.length === 0 && (
              <li className="px-6 py-8 text-center text-gray-500">
                No exam results yet. Be the first to take an exam!
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
