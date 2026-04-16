import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, doc, getDoc, addDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Clock, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { QUESTIONS, SUBJECTS, Question } from '../data/jamb_data';

export default function Exam() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(7200); // 2 hours
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!user) return;

    const fetchQuestions = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) return;
        
        const selectedSubjects = userDoc.data().selectedSubjects || [];
        if (selectedSubjects.length !== 4) {
          navigate('/dashboard');
          return;
        }

        // Generate 180 questions: 60 for English, 40 for the other 3
        const allExamQuestions: Question[] = [];
        
        // Ensure 'eng' is first if it exists
        const subjectsOrder = ['eng', ...selectedSubjects.filter((s: string) => s !== 'eng')];
        
        subjectsOrder.forEach(subId => {
           let requiredCount = subId === 'eng' ? 60 : 40;
           let subQuestions = QUESTIONS.filter(q => q.subjectId === subId);
           
           // If we don't have questions for a selected subject in local DB, create a dummy one
           if (subQuestions.length === 0) {
             subQuestions = [{ id: 'dummy', subjectId: subId, text: `Sample question for ${subId}...`, optionA: 'A', optionB: 'B', optionC: 'C', optionD: 'D', correctOption: 'A' }];
           }
           
           let generated = [];
           for (let i = 0; i < requiredCount; i++) {
             // Cycle through available questions to meet the required count (60/40)
             let baseQ = subQuestions[i % subQuestions.length];
             generated.push({
                ...baseQ,
                id: `${subId}-${i}`, // Make IDs unique for this generated set
                text: `${baseQ.text} (Mock Q${i+1})`
             });
           }
           allExamQuestions.push(...generated);
        });

        setQuestions(allExamQuestions);
        setLoading(false);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
      }
    };

    fetchQuestions();
  }, [user, navigate]);

  useEffect(() => {
    if (loading || examFinished || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, examFinished, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && !examFinished && !submitting) {
      submitExam();
    }
  }, [timeLeft, examFinished, submitting]);

  const handleAnswer = (questionId: string, option: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const submitExam = async () => {
    if (!user || submitting) return;
    setSubmitting(true);
    
    let calculatedScore = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctOption) {
        calculatedScore += 1;
      }
    });

    try {
      // Save result
      await addDoc(collection(db, 'exam_results'), {
        userId: user.uid,
        subjectId: 'combined', // Or save per subject
        score: calculatedScore,
        total: questions.length,
        date: new Date().toISOString()
      });
      
      setScore(calculatedScore);
      setExamFinished(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'exam_results');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? `${h}:` : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading Exam...</div>;
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold mb-4">No questions available for selected subjects.</h2>
        <button onClick={() => navigate('/dashboard')} className="text-blue-600 hover:underline">
          Return to Dashboard
        </button>
      </div>
    );
  }

  if (examFinished) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Exam Completed!</h2>
          <p className="text-lg text-gray-600 mb-6">
            You scored <span className="font-bold text-blue-600">{score}</span> out of {questions.length}
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  
  // Extract unique subjects in order to render tabs
  const examSubjects = [...new Set(questions.map(q => q.subjectId))];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10 flex flex-col">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center text-gray-900 font-medium">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <div className={`flex items-center font-mono text-lg font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-gray-900'}`}>
            <Clock className="h-5 w-5 mr-2" />
            {formatTime(timeLeft)}
          </div>
        </div>
        
        {/* Subject Tabs */}
        <div className="border-t bg-gray-100 flex overflow-x-auto">
          {examSubjects.map((subId) => {
            const subjectName = SUBJECTS.find(s => s.id === subId)?.name || subId;
            // Find the first question belonging to this subject
            const startIndex = questions.findIndex(q => q.subjectId === subId);
            const isActive = currentQuestion.subjectId === subId;
            
            return (
              <button
                key={subId}
                onClick={() => setCurrentQuestionIndex(startIndex)}
                className={`py-3 px-6 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  isActive 
                    ? 'border-blue-600 text-blue-600 bg-white' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {subjectName}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        {/* Left Column: Question Area */}
        <div className="flex-1 flex flex-col max-w-3xl">
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-8 whitespace-pre-wrap">
              {currentQuestion.text}
            </h3>

            <div className="space-y-4">
              {['A', 'B', 'C', 'D'].map((opt) => {
                const optionText = currentQuestion[`option${opt}` as keyof Question] as string;
                const isSelected = answers[currentQuestion.id] === opt;
                
                return (
                  <label
                    key={opt}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={opt}
                      checked={isSelected}
                      onChange={() => handleAnswer(currentQuestion.id, opt)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-3 font-medium text-gray-700 w-8">{opt}.</span>
                    <span className="text-gray-900">{optionText}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Navigation Footer */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Previous
            </button>

            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={() => {
                  const answeredCount = Object.keys(answers).length;
                  const unansweredCount = questions.length - answeredCount;
                  let message = 'Are you sure you want to submit your mock exam?';
                  if (unansweredCount > 0) {
                    message = `You still have ${unansweredCount} unanswered ${unansweredCount === 1 ? 'question' : 'questions'}.\n\nAre you sure you want to submit?`;
                  }
                  if (window.confirm(message)) {
                    submitExam();
                  }
                }}
                disabled={submitting}
                className="inline-flex items-center px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                Submit Exam
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Next
                <ChevronRight className="h-5 w-5 ml-1" />
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Question Palette & User Info */}
        <div className="w-full lg:w-80 flex flex-col gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center space-x-3 border-b pb-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl">
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'S'}
              </div>
              <div>
                 <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Candidate</p>
                 <p className="font-bold text-gray-900 truncate w-48" title={user?.displayName || 'Student'}>
                   {user?.displayName || 'Student'}
                 </p>
              </div>
            </div>
            
            <h4 className="font-medium text-gray-900 mb-3 text-sm flex items-center justify-between">
              <span>{SUBJECTS.find(s => s.id === currentQuestion.subjectId)?.name}</span>
            </h4>
            
            <div className="grid grid-cols-5 gap-2 overflow-y-auto max-h-96 pr-2">
              {questions
                .map((q, idx) => ({ q, idx }))
                .filter(item => item.q.subjectId === currentQuestion.subjectId)
                .map((item, localIndex) => {
                  const isCurrent = currentQuestionIndex === item.idx;
                  const isAnswered = answers[item.q.id] !== undefined;

                  let btnClass = "w-10 h-10 rounded-md font-medium flex items-center justify-center text-sm transition-all ";
                  if (isCurrent) {
                    btnClass += "ring-2 ring-yellow-400 ring-offset-2 font-bold ";
                  }
                  
                  if (isAnswered) {
                    btnClass += "bg-green-500 text-white hover:bg-green-600 ";
                  } else {
                    btnClass += "bg-blue-500 text-white hover:bg-blue-600 ";
                  }

                  return (
                    <button 
                      key={item.q.id} 
                      onClick={() => setCurrentQuestionIndex(item.idx)}
                      className={btnClass}
                      title={`Go to Question ${localIndex + 1}`}
                    >
                      {localIndex + 1}
                    </button>
                  );
                })}
            </div>
            
            <div className="mt-6 space-y-2 text-xs text-gray-600 border-t pt-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-sm mr-2"></div> Answered
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-sm mr-2"></div> Unanswered
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-white ring-2 ring-yellow-400 rounded-sm mr-2"></div> Current Question
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
