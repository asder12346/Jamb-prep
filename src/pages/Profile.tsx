import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import imageCompression from 'browser-image-compression';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, Camera, Loader2, Save, User as UserIcon, 
  Activity, Target, History, Star, BookOpen, Zap
} from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const [stats, setStats] = useState({
    totalExams: 0,
    avgScore: 0,
    bestScore: 0,
    totalQuestionsAnswered: 0,
    totalXP: 0
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    
    // update display name if user.displayName resolves after first render
    if (user.displayName && !displayName) {
      setDisplayName(user.displayName);
    }
    
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.profilePicture) {
            setProfilePicture(data.profilePicture);
          }
        }

        // Fetch stats
        const q = query(collection(db, 'exam_results'), where('userId', '==', user.uid));
        const snap = await getDocs(q);
        const exams = snap.docs.map(d => d.data());
        
        let totalScore = 0;
        let totalQs = 0;
        let best = 0;
        let totalXP = 0;
        
        exams.forEach((ex: any) => {
          totalScore += ex.score;
          totalQs += ex.total;
          totalXP += (ex.score || 0);
          const percentage = (ex.score / ex.total) * 100;
          if (percentage > best) best = percentage;
        });

        setStats({
          totalExams: exams.length,
          avgScore: exams.length > 0 ? Math.round((totalScore / totalQs) * 100) : 0,
          bestScore: Math.round(best),
          totalQuestionsAnswered: totalQs,
          totalXP
        });

      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `users/${user.uid}`);
      } finally {
        setFetching(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleImageSelect = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ text: 'Please select a valid image file.', type: 'error' });
      return;
    }

    try {
      const options = {
        maxSizeMB: 0.1, // compress aggressively for Firestore limit (100KB)
        maxWidthOrHeight: 300,
        useWebWorker: true,
        fileType: 'image/jpeg',
      };
      const compressedFile = await imageCompression(file, options);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setProfilePicture(dataUrl);
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error(error);
      setMessage({ text: 'Failed to compress image.', type: 'error' });
    }
  };

  const handleSaveProfile = async (e: any) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      // 1. Update Firebase Auth Profile
      if (displayName !== user.displayName) {
        await updateProfile(user, { displayName });
      }

      // 2. Update Firestore Document
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        name: displayName,
        ...(profilePicture ? { profilePicture } : {})
      });

      setMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (err: any) {
      console.error(err);
      setMessage({ text: err.message || 'Failed to update profile.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Edit Profile Column */}
          <div className="w-full md:w-1/2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h1>
              
              {message.text && (
                <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-6">
                
                {/* Profile Picture */}
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center">
                      {profilePicture ? (
                        <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                         <div className="w-full h-full bg-blue-100 text-blue-600 flex items-center justify-center text-4xl font-bold">
                           {displayName.charAt(0).toUpperCase() || 'U'}
                         </div>
                      )}
                    </div>
                    
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:scale-105 transition-all"
                      title="Upload photo"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                    <input 
                      type="file" 
                      accept="image/*" 
                      capture="user"
                      ref={fileInputRef} 
                      className="hidden" 
                      onChange={handleImageSelect}
                    />
                  </div>
                  <p className="mt-3 text-sm text-gray-500 font-medium">Click the camera to replace</p>
                </div>

                {/* Display Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <UserIcon className="w-5 h-5" />
                    </div>
                    <input 
                      type="text" 
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required
                      className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition-all"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Stats Column */}
          <div className="w-full md:w-1/2 space-y-6">
             <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-sm border border-amber-600 p-6 sm:p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -m-8 w-32 h-32 bg-white/20 rounded-full filter blur-xl"></div>
                <div className="flex justify-between items-center relative z-10">
                   <div>
                     <div className="text-amber-100 text-sm font-semibold uppercase tracking-wider mb-1">Current Level</div>
                     <div className="text-4xl font-black">Level {Math.floor(stats.totalXP / 1000) + 1}</div>
                   </div>
                   <div className="text-right">
                     <div className="text-amber-100 text-sm font-semibold uppercase tracking-wider mb-1">Total XP</div>
                     <div className="text-2xl font-bold flex items-center justify-end">
                       <Zap className="w-5 h-5 mr-1" />
                       {stats.totalXP}
                     </div>
                   </div>
                </div>
                <div className="mt-6 relative z-10">
                  <div className="flex justify-between text-xs font-bold text-amber-100 mb-2">
                    <span>Progress to Level {Math.floor(stats.totalXP / 1000) + 2}</span>
                    <span>{1000 - (stats.totalXP % 1000)} XP needed</span>
                  </div>
                  <div className="w-full bg-black/20 rounded-full h-2">
                     <div className="bg-white h-2 rounded-full transition-all duration-1000" style={{ width: `${((stats.totalXP % 1000) / 1000) * 100}%` }}></div>
                  </div>
                </div>
             </div>

            <div className="bg-gradient-to-br from-gray-900 to-indigo-900 rounded-2xl shadow-sm border border-gray-800 p-6 sm:p-8 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 -m-16 w-48 h-48 bg-white/5 rounded-full filter blur-3xl"></div>
               
               <h2 className="text-xl font-bold mb-8 flex items-center">
                 <Activity className="w-5 h-5 mr-2 text-indigo-400" />
                 Global Performance
               </h2>
               
               <div className="grid grid-cols-2 gap-6">
                 
                 <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                   <div className="text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center">
                     <History className="w-4 h-4 mr-1.5" /> Exams Taken
                   </div>
                   <div className="text-3xl font-black">{stats.totalExams}</div>
                 </div>

                 <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                   <div className="text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center">
                     <Target className="w-4 h-4 mr-1.5" /> Avg Score
                   </div>
                   <div className="text-3xl font-black">{stats.avgScore}<span className="text-lg text-indigo-300 ml-1">%</span></div>
                 </div>

                 <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                   <div className="text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center">
                     <Star className="w-4 h-4 mr-1.5 text-yellow-500" /> Best Score
                   </div>
                   <div className="text-3xl font-black">{stats.bestScore}<span className="text-lg text-indigo-300 ml-1">%</span></div>
                 </div>

                 <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                   <div className="text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center">
                     <BookOpen className="w-4 h-4 mr-1.5" /> Qs Answered
                   </div>
                   <div className="text-3xl font-black">{stats.totalQuestionsAnswered}</div>
                 </div>

               </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
