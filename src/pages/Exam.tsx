import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, doc, getDoc, addDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { 
  Clock, ChevronLeft, ChevronRight, CheckCircle2, 
  Flag, XCircle, BarChart2, Check, ArrowRight
} from 'lucide-react';
import { QUESTIONS, SUBJECTS, Question } from '../data/jamb_data';

export default function Exam() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [reviewMarked, setReviewMarked] = useState<Record<string, boolean>>({});
  
  const [timeLeft, setTimeLeft] = useState(7200); // 2 hours
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // States to orchestrate the end of exam
  const [showReviewScreen, setShowReviewScreen] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [resultData, setResultData] = useState<any>(null);

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

        const allExamQuestions: Question[] = [];
        const subjectsOrder = ['eng', ...selectedSubjects.filter((s: string) => s !== 'eng')];
        
        subjectsOrder.forEach(subId => {
           let requiredCount = subId === 'eng' ? 60 : 40;
           let subQuestions = QUESTIONS.filter(q => q.subjectId === subId);
           
           if (subQuestions.length === 0) {
             subQuestions = [{ id: 'dummy', subjectId: subId, text: `Sample question for ${subId}...`, optionA: 'A', optionB: 'B', optionC: 'C', optionD: 'D', correctOption: 'A' }];
           }
           
           let generated = [];
           for (let i = 0; i < requiredCount; i++) {
             let baseQ = subQuestions[i % subQuestions.length];
             generated.push({
                ...baseQ,
                id: `${subId}-${i}`,
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
    if (loading || examFinished || showReviewScreen || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, examFinished, showReviewScreen, timeLeft]);

  // Auto-submit when time is strictly zero
  useEffect(() => {
    if (timeLeft === 0 && !examFinished && !submitting) {
      submitExam();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, examFinished, submitting]);

  const handleAnswer = (questionId: string, option: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const toggleReviewMark = (questionId: string) => {
    setReviewMarked(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const clearAnswer = (questionId: string) => {
    setAnswers(prev => {
      const newAnswers = { ...prev };
      delete newAnswers[questionId];
      return newAnswers;
    });
  };

  const submitExam = async () => {
    if (!user || submitting) return;
    setSubmitting(true);
    
    let globalScore = 0;
    const subjectBreakdown: Record<string, { correct: number, total: number }> = {};
    const examSubjects = [...new Set(questions.map(q => q.subjectId))];

    examSubjects.forEach(subId => {
      const subQs = questions.filter(q => q.subjectId === subId);
      const correct = subQs.filter(q => answers[q.id] === q.correctOption).length;
      subjectBreakdown[subId] = { correct, total: subQs.length };
      globalScore += correct;
    });

    try {
      await addDoc(collection(db, 'exam_results'), {
        userId: user.uid,
        subjectId: 'combined',
        score: globalScore,
        total: questions.length,
        subjectBreakdown: subjectBreakdown,
        date: new Date().toISOString(),
        timeUsed: 7200 - timeLeft
      });
      
      setResultData({
        score: globalScore,
        total: questions.length,
        breakdown: subjectBreakdown,
        timeUsed: 7200 - timeLeft
      });
      setExamFinished(true);
      setShowReviewScreen(false); // Make sure review screen hides
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-xl font-bold mb-4">No questions available.</h2>
        <button onClick={() => navigate('/dashboard')} className="text-blue-600 hover:underline">
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Final Result Page
  if (examFinished && resultData) {
    const { score, total, breakdown } = resultData;
    const percentage = Math.round((score / total) * 100);

    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-12 text-center text-white relative">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                 <BarChart2 className="w-48 h-48" />
               </div>
               <div className="relative z-10 w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
                 <CheckCircle2 className="h-12 w-12 text-white" />
               </div>
               <h1 className="text-4xl font-black mb-2 relative z-10">Exam Completed!</h1>
               <p className="text-blue-100 text-lg font-medium relative z-10">You've successfully finished your Mock CBT.</p>
            </div>
            
            <div className="p-8">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-10 mb-12">
                <div className="text-center">
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-2">Total Score</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-6xl font-black text-gray-900">{score}</span>
                    <span className="text-xl font-bold text-gray-400 ml-2">/ {total}</span>
                  </div>
                </div>
                <div className="hidden sm:block w-px h-24 bg-gray-200"></div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-2">Accuracy</p>
                  <div className="flex items-baseline justify-center">
                    <span className={`text-6xl font-black ${percentage >= 70 ? 'text-green-500' : percentage >= 50 ? 'text-amber-500' : 'text-red-500'}`}>{percentage}%</span>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-3">Subject Breakdown</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                 {Object.entries(breakdown).map(([subId, data]: [string, any]) => {
                    const subName = SUBJECTS.find(s => s.id === subId)?.name || subId;
                    const subPercent = Math.round((data.correct / data.total) * 100);
                    return (
                      <div key={subId} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-bold text-gray-800">{subName}</span>
                          <span className="font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded text-sm">{data.correct} / {data.total}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className={`h-2.5 rounded-full ${subPercent >= 70 ? 'bg-green-500' : subPercent >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${subPercent}%` }}></div>
                        </div>
                      </div>
                    );
                 })}
              </div>
              
              <div className="mt-10 pt-8 border-t border-gray-100 text-center">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-bold rounded-xl shadow-lg text-white bg-gray-900 hover:bg-gray-800 transition-transform hover:scale-105"
                >
                  Return to Dashboard
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const examSubjects = [...new Set(questions.map(q => q.subjectId))];
  
  const answeredCount = Object.keys(answers).length;
  const markedCount = Object.keys(reviewMarked).filter(k => reviewMarked[k]).length;
  const unansweredCount = questions.length - answeredCount;

  // Pre-submit Review Page
  if (showReviewScreen) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-blue-50/50 p-6 sm:p-10 border-b border-gray-200 text-center">
               <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Exam Review</h2>
               <p className="text-gray-600">Please review your exam status before final submission.</p>
            </div>
            
            <div className="p-6 sm:p-10">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                 <div className="bg-green-50 rounded-xl p-6 border border-green-100 text-center">
                    <div className="text-4xl font-black text-green-600 mb-1">{answeredCount}</div>
                    <div className="text-sm font-bold text-green-800 uppercase">Answered</div>
                 </div>
                 <div className="bg-amber-50 rounded-xl p-6 border border-amber-100 text-center">
                    <div className="text-4xl font-black text-amber-600 mb-1">{markedCount}</div>
                    <div className="text-sm font-bold text-amber-800 uppercase">Marked for Review</div>
                 </div>
                 <div className="bg-red-50 rounded-xl p-6 border border-red-100 text-center">
                    <div className="text-4xl font-black text-red-600 mb-1">{unansweredCount}</div>
                    <div className="text-sm font-bold text-red-800 uppercase">Unanswered</div>
                 </div>
               </div>
               
               {unansweredCount > 0 && (
                 <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
                   <p className="text-red-700 font-medium">You still have {unansweredCount} questions left unanswered. It is recommended to attempt all questions as there is no negative marking.</p>
                 </div>
               )}
               
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <button
                   onClick={() => setShowReviewScreen(false)}
                   disabled={submitting}
                   className="px-8 py-4 bg-white border-2 border-gray-200 font-bold text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                 >
                   Return to Exam
                 </button>
                 <button
                   onClick={submitExam}
                   disabled={submitting}
                   className="px-8 py-4 bg-blue-600 font-bold text-white rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-105 transition-all text-center flex items-center justify-center disabled:opacity-50 disabled:scale-100"
                 >
                   {submitting ? 'Submitting...' : 'Submit Final Examination'}
                 </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active Exam Interface
  return (
    <div className="min-h-screen bg-[#FBFBFA] flex flex-col font-sans select-none">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10 flex flex-col border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center text-gray-900 font-bold">
            <span className="bg-gray-100 px-3 py-1 rounded-md text-sm mr-4 border border-gray-200">
               Question {currentQuestionIndex + 1} / {questions.length}
            </span>
          </div>
          <div className={`flex items-center font-mono text-xl font-bold bg-gray-50 px-4 py-1.5 rounded-lg border ${timeLeft < 300 ? 'text-red-600 border-red-200 bg-red-50 animate-pulse' : 'text-gray-900 border-gray-200'}`}>
            <Clock className="h-5 w-5 mr-3" />
            {formatTime(timeLeft)}
          </div>
        </div>
        
        {/* Subject Tabs */}
        <div className="bg-gray-50/80 flex overflow-x-auto px-4 sm:px-8">
          <div className="flex space-x-1 max-w-[1400px] mx-auto w-full border-b border-gray-200">
            {examSubjects.map((subId) => {
              const subjectName = SUBJECTS.find(s => s.id === subId)?.name || subId;
              const startIndex = questions.findIndex(q => q.subjectId === subId);
              const isActive = currentQuestion.subjectId === subId;
              
              return (
                <button
                  key={subId}
                  onClick={() => setCurrentQuestionIndex(startIndex)}
                  className={`py-3 px-6 text-sm font-bold whitespace-nowrap transition-colors relative top-[1px] rounded-t-lg border-t-2 border-l border-r ${
                    isActive 
                      ? 'border-t-blue-600 border-x-gray-200 bg-white text-blue-700' 
                      : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-100/50'
                  }`}
                >
                  {subjectName}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Question Area */}
        <div className="flex-1 flex flex-col max-w-4xl">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-10 flex-1 relative overflow-hidden">
            {reviewMarked[currentQuestion.id] && (
               <div className="absolute top-0 right-0 bg-amber-400 text-white text-xs font-bold px-4 py-1 rounded-bl-xl shadow-sm flex items-center">
                 <Flag className="w-3 h-3 mr-1" />
                 Marked
               </div>
            )}
            
            <h3 className="text-xl font-medium text-gray-900 mb-10 whitespace-pre-wrap leading-relaxed mt-4">
              <span className="font-bold text-blue-600 mr-2">{currentQuestionIndex + 1}.</span>
              {currentQuestion.text}
            </h3>

            <div className="space-y-4">
              {['A', 'B', 'C', 'D'].map((opt) => {
                const optionText = currentQuestion[`option${opt}` as keyof Question] as string;
                const isSelected = answers[currentQuestion.id] === opt;
                
                return (
                  <label
                    key={opt}
                    className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all ${
                      isSelected ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex flex-shrink-0 items-center justify-center mr-4 ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                    </div>
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={opt}
                      checked={isSelected}
                      onChange={() => handleAnswer(currentQuestion.id, opt)}
                      className="hidden"
                    />
                    <span className="font-bold text-gray-500 w-8">{opt}.</span>
                    <span className="text-gray-900 font-medium text-lg">{optionText}</span>
                  </label>
                );
              })}
            </div>
            
            {/* Context Actions */}
            <div className="mt-10 pt-6 border-t border-gray-100 flex items-center space-x-4">
               <button
                 onClick={() => toggleReviewMark(currentQuestion.id)}
                 className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${reviewMarked[currentQuestion.id] ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
               >
                 <Flag className={`w-4 h-4 mr-2 ${reviewMarked[currentQuestion.id] ? 'fill-current' : ''}`} />
                 {reviewMarked[currentQuestion.id] ? 'Unmark Review' : 'Mark for Review'}
               </button>
               
               <button
                 onClick={() => clearAnswer(currentQuestion.id)}
                 disabled={!answers[currentQuestion.id]}
                 className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
               >
                 <XCircle className="w-4 h-4 mr-2" />
                 Clear Answer
               </button>
            </div>
          </div>

          {/* Navigation Footer */}
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="inline-flex items-center px-6 py-3 border border-gray-200 shadow-sm text-base font-bold rounded-xl text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-all disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Previous
            </button>

            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={() => setShowReviewScreen(true)}
                className="inline-flex items-center px-8 py-3 shadow-md shadow-blue-500/20 text-base font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Finish Exam
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                className="inline-flex items-center px-8 py-3 border border-transparent shadow-sm shadow-blue-500/20 text-base font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Next
                <ChevronRight className="h-5 w-5 ml-1" />
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Question Palette */}
        <div className="w-full lg:w-96 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h4 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center justify-between">
              Question Palette
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                 {SUBJECTS.find(s => s.id === currentQuestion.subjectId)?.name}
              </span>
            </h4>
            
            <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-5 gap-2.5 overflow-y-auto max-h-[400px] pr-2 pb-2 custom-scrollbar">
              {questions
                .map((q, idx) => ({ q, idx }))
                .filter(item => item.q.subjectId === currentQuestion.subjectId)
                .map((item, localIndex) => {
                  const isCurrent = currentQuestionIndex === item.idx;
                  const isAnswered = answers[item.q.id] !== undefined;
                  const isMarked = reviewMarked[item.q.id];

                  let btnClass = "w-full aspect-square rounded-lg font-bold flex items-center justify-center text-sm transition-all border-2 ";
                  
                  if (isCurrent) {
                    btnClass += "ring-4 ring-blue-100 border-blue-600 bg-white text-blue-700 shadow-sm z-10 scale-105 ";
                  } else if (isMarked) {
                    btnClass += "bg-amber-400 text-white border-amber-500 hover:bg-amber-500 ";
                  } else if (isAnswered) {
                    btnClass += "bg-green-500 text-white border-green-600 hover:bg-green-600 ";
                  } else {
                    btnClass += "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:border-gray-300 ";
                  }

                  return (
                    <button 
                      key={item.q.id} 
                      onClick={() => setCurrentQuestionIndex(item.idx)}
                      className={btnClass}
                      title={`Question ${localIndex + 1}`}
                    >
                      {localIndex + 1}
                    </button>
                  );
                })}
            </div>
            
            <div className="mt-8 space-y-3 text-sm text-gray-600 border-t border-gray-100 pt-6">
              <div className="grid grid-cols-2 gap-3">
                 <div className="flex items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
                   <div className="w-4 h-4 bg-green-500 rounded border border-green-600 mr-2 flex-shrink-0"></div> <span className="font-medium text-xs">Answered</span>
                 </div>
                 <div className="flex items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
                   <div className="w-4 h-4 bg-gray-50 rounded border-2 border-gray-200 mr-2 flex-shrink-0"></div> <span className="font-medium text-xs truncate">Unanswered</span>
                 </div>
                 <div className="flex items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
                   <div className="w-4 h-4 bg-amber-400 rounded border border-amber-500 mr-2 flex-shrink-0"></div> <span className="font-medium text-xs truncate">Marked</span>
                 </div>
                 <div className="flex items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
                   <div className="w-4 h-4 bg-white ring-2 ring-blue-100 border-2 border-blue-600 rounded mr-2 flex-shrink-0"></div> <span className="font-medium text-xs">Current</span>
                 </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-100">
               <button
                  onClick={() => setShowReviewScreen(true)}
                  className="w-full py-3 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:border-red-300 rounded-xl font-bold transition-colors"
               >
                 Submit / End Exam Mode
               </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
