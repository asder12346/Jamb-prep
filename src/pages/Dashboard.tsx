import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, doc, getDocs, onSnapshot, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LogOut, Settings, PlayCircle, CheckCircle } from 'lucide-react';

interface Subject {
  id: string;
  name: string;
}

export default function Dashboard() {
  const { user, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Listen to user's selected subjects
    const unsubscribeUser = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        setSelectedSubjects(docSnap.data().selectedSubjects || []);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
    });

    // Listen to all subjects
    const unsubscribeSubjects = onSnapshot(collection(db, 'subjects'), (snapshot) => {
      const subs: Subject[] = [];
      snapshot.forEach((doc) => {
        subs.push({ id: doc.id, ...doc.data() } as Subject);
      });
      setSubjects(subs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'subjects');
    });

    return () => {
      unsubscribeUser();
      unsubscribeSubjects();
    };
  }, [user]);

  const toggleSubject = async (subjectId: string) => {
    if (!user) return;
    try {
      const newSelected = selectedSubjects.includes(subjectId)
        ? selectedSubjects.filter(id => id !== subjectId)
        : [...selectedSubjects, subjectId];
      
      if (newSelected.length > 4) {
        alert("You can only select up to 4 subjects for JAMB.");
        return;
      }

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
              {userRole === 'admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="text-gray-500 hover:text-gray-700 flex items-center"
                >
                  <Settings className="h-5 w-5 mr-1" />
                  Admin
                </button>
              )}
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
            <h2 className="text-lg font-medium text-gray-900 mb-4">Select Your Subjects (Max 4)</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {subjects.map((subject) => {
                const isSelected = selectedSubjects.includes(subject.id);
                return (
                  <div
                    key={subject.id}
                    onClick={() => toggleSubject(subject.id)}
                    className={`relative rounded-lg border p-4 cursor-pointer hover:border-blue-500 transition-colors ${
                      isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                        {subject.name}
                      </span>
                      {isSelected && <CheckCircle className="h-5 w-5 text-blue-600" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Ready to practice?</h3>
                  <p className="text-sm text-gray-500">
                    You have selected {selectedSubjects.length} subject{selectedSubjects.length !== 1 ? 's' : ''}.
                  </p>
                </div>
                <button
                  onClick={startExam}
                  disabled={selectedSubjects.length === 0}
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
