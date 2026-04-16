import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LogOut, Trophy, PlayCircle, X } from 'lucide-react';
import { SUBJECTS } from '../data/jamb_data';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedDropdownSubject, setSelectedDropdownSubject] = useState<string>('');
  const [loading, setLoading] = useState(true);

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
    if (selectedSubjects.length === 0) {
      alert("Please select at least one subject to start the exam.");
      return;
    }
    navigate('/exam');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">JAMB Prep</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/leaderboard')}
                className="text-gray-500 hover:text-gray-700 flex items-center"
              >
                <Trophy className="h-5 w-5 mr-1" />
                Leaderboard
              </button>
              <span className="text-sm text-gray-700">Hello, {user?.displayName}</span>
              <button
                onClick={logout}
                className="text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Select 3 Additional Subjects (Use of English is compulsory)</h2>
            
            <div className="flex gap-4 mb-6">
              <select
                value={selectedDropdownSubject}
                onChange={(e) => setSelectedDropdownSubject(e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
              >
                <option value="">-- Select a subject --</option>
                {SUBJECTS.filter(s => !selectedSubjects.includes(s.id) && s.id !== 'eng').map(subject => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
              </select>
              <button
                onClick={handleAddSubject}
                disabled={!selectedDropdownSubject || selectedSubjects.length >= 4}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Subject
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {selectedSubjects.map((subjectId) => {
                const subject = SUBJECTS.find(s => s.id === subjectId);
                if (!subject) return null;
                const isEnglish = subject.id === 'eng';
                return (
                  <div
                    key={subject.id}
                    className={`relative rounded-lg border p-4 flex items-center justify-between ${isEnglish ? 'border-green-300 bg-green-50' : 'border-blue-200 bg-blue-50'}`}
                  >
                    <span className={`font-medium ${isEnglish ? 'text-green-900' : 'text-blue-900'}`}>{subject.name} {isEnglish && '(Compulsory)'}</span>
                    {!isEnglish && (
                      <button
                        onClick={() => handleRemoveSubject(subject.id)}
                        className="text-blue-400 hover:text-blue-600"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                );
              })}
              {selectedSubjects.length === 1 && (
                <div className="col-span-full text-center py-4 text-gray-500">
                  Please add 3 more subjects to start the exam.
                </div>
              )}
            </div>

            <div className="mt-8 border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Ready to practice?</h3>
                  <p className="text-sm text-gray-500">
                    You have selected {selectedSubjects.length} of 4 required subjects.
                  </p>
                </div>
                <button
                  onClick={startExam}
                  disabled={selectedSubjects.length !== 4}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PlayCircle className="h-5 w-5 mr-2" />
                  Start Exam
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
