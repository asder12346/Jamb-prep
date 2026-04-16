import { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface Subject {
  id: string;
  name: string;
}

export default function Admin() {
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubject, setNewSubject] = useState('');
  
  // Question form state
  const [qSubjectId, setQSubjectId] = useState('');
  const [qText, setQText] = useState('');
  const [qOptA, setQOptA] = useState('');
  const [qOptB, setQOptB] = useState('');
  const [qOptC, setQOptC] = useState('');
  const [qOptD, setQOptD] = useState('');
  const [qCorrect, setQCorrect] = useState('A');

  useEffect(() => {
    if (userRole !== 'admin') {
      navigate('/dashboard');
      return;
    }

    const unsubscribe = onSnapshot(collection(db, 'subjects'), (snapshot) => {
      const subs: Subject[] = [];
      snapshot.forEach((doc) => {
        subs.push({ id: doc.id, ...doc.data() } as Subject);
      });
      setSubjects(subs);
      if (subs.length > 0 && !qSubjectId) {
        setQSubjectId(subs[0].id);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'subjects');
    });

    return () => unsubscribe();
  }, [userRole, navigate, qSubjectId]);

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) return;
    try {
      await addDoc(collection(db, 'subjects'), { name: newSubject.trim() });
      setNewSubject('');
      alert('Subject added!');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'subjects');
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qSubjectId || !qText || !qOptA || !qOptB || !qOptC || !qOptD || !qCorrect) return;
    try {
      await addDoc(collection(db, 'questions'), {
        subjectId: qSubjectId,
        text: qText.trim(),
        optionA: qOptA.trim(),
        optionB: qOptB.trim(),
        optionC: qOptC.trim(),
        optionD: qOptD.trim(),
        correctOption: qCorrect
      });
      setQText('');
      setQOptA('');
      setQOptB('');
      setQOptC('');
      setQOptD('');
      setQCorrect('A');
      alert('Question added!');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'questions');
    }
  };

  if (userRole !== 'admin') return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex items-center">
          <button onClick={() => navigate('/dashboard')} className="mr-4 text-gray-500 hover:text-gray-900">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium mb-4">Add Subject</h2>
          <form onSubmit={handleAddSubject} className="flex gap-4">
            <input
              type="text"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="e.g. Mathematics"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
              required
            />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Add Subject
            </button>
          </form>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Add Question</h2>
          <form onSubmit={handleAddQuestion} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Subject</label>
              <select
                value={qSubjectId}
                onChange={(e) => setQSubjectId(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                required
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Question Text</label>
              <textarea
                value={qText}
                onChange={(e) => setQText(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Option A</label>
                <input type="text" value={qOptA} onChange={(e) => setQOptA(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Option B</label>
                <input type="text" value={qOptB} onChange={(e) => setQOptB(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Option C</label>
                <input type="text" value={qOptC} onChange={(e) => setQOptC(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Option D</label>
                <input type="text" value={qOptD} onChange={(e) => setQOptD(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Correct Option</label>
              <select
                value={qCorrect}
                onChange={(e) => setQCorrect(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>

            <button type="submit" className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Add Question
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
