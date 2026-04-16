import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LogOut, Trophy, PlayCircle, X, CheckCircle2, AlertCircle } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="bg-blue-600 p-1.5 rounded-lg mr-2">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">JAMB PrepMaster</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/leaderboard')}
                className="text-gray-600 hover:text-blue-600 flex items-center font-medium transition-colors"
              >
                <Trophy className="h-5 w-5 mr-1.5 text-yellow-500" />
                <span className="hidden sm:inline">Leaderboard</span>
              </button>
              <div className="hidden sm:block w-px h-6 bg-gray-200 mx-2"></div>
              <span className="text-sm font-medium text-gray-700 hidden md:inline">Hi, {user?.displayName?.split(' ')[0]}</span>
              <button
                onClick={logout}
                className="text-gray-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
                title="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Dashboard</h1>
          <p className="mt-2 text-lg text-gray-600">Configure your exam settings below before proceeding to the CBT interface.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-blue-50/50 px-6 py-5 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <CheckCircle2 className="w-5 h-5 text-blue-600 mr-2" />
              1. Select Your Subjects
            </h2>
            <p className="mt-1 text-sm text-gray-600 ml-7">
              JAMB requires exactly 4 subjects. Use of English is compulsory and already added.
            </p>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <select
                value={selectedDropdownSubject}
                onChange={(e) => setSelectedDropdownSubject(e.target.value)}
                className="flex-1 rounded-xl border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-3 font-medium text-gray-700"
              >
                <option value="">-- Choose a subject to add --</option>
                {SUBJECTS.filter(s => !selectedSubjects.includes(s.id) && s.id !== 'eng').map(subject => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
                ))}
              </select>
              <button
                onClick={handleAddSubject}
                disabled={!selectedDropdownSubject || selectedSubjects.length >= 4}
                className="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
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
                    className={`relative rounded-xl border p-4 flex items-center justify-between ${isEnglish ? 'border-green-300 bg-green-50 shadow-sm' : 'border-blue-200 bg-blue-50 shadow-sm'}`}
                  >
                    <span className={`font-semibold ${isEnglish ? 'text-green-900' : 'text-blue-900'}`}>
                      {subject.name} {isEnglish && <span className="text-green-600 text-xs ml-1 font-bold uppercase">(Compulsory)</span>}
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
              
              {/* Placeholders for empty slots */}
              {Array.from({ length: Math.max(0, 4 - selectedSubjects.length) }).map((_, i) => (
                <div key={`empty-${i}`} className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-4 flex items-center justify-center text-gray-400 font-medium h-[68px]">
                  Empty Slot
                </div>
              ))}
            </div>

            {subjectsNeeded > 0 && (
              <div className="mt-6 flex items-center space-x-2 text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">Please add {subjectsNeeded} more {subjectsNeeded === 1 ? 'subject' : 'subjects'} to continue.</span>
              </div>
            )}
          </div>

          <div className="bg-gray-50 px-6 py-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">2. Ready to begin?</h3>
                <p className="text-sm text-gray-600">
                  You will have 2 hours to complete 180 questions across your chosen subjects.
                </p>
              </div>
              <button
                onClick={startExam}
                disabled={selectedSubjects.length !== 4}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed group"
              >
                <PlayCircle className="h-5 w-5 mr-2 group-disabled:text-blue-300" />
                Start Mock Exam
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
