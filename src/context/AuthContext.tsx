import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../firebase';

interface AuthContextType {
  user: User | null;
  userRole: 'admin' | 'student' | null;
  loading: boolean;
  login: () => Promise<void>;
  signupWithEmail: (email: string, password: string, name: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'student' | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role);
          } else {
            // Create new user document
            const role = currentUser.email === 'samuelabedecornelius@gmail.com' ? 'admin' : 'student';
            await setDoc(userDocRef, {
              name: currentUser.displayName || 'Unknown',
              email: currentUser.email,
              role: role,
              selectedSubjects: []
            });
            setUserRole(role);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}`);
        }
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      if (
        error.code === 'auth/popup-closed-by-user' || 
        error.code === 'auth/cancelled-popup-request'
      ) {
        console.log('Login popup closed or cancelled by user.');
      } else {
        console.error('Login failed', error);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const signupWithEmail = async (email: string, password: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Automatically update the profile with the name
    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName: name });
      
      // We also wait to create user document here to be safe and ensure the name is there.
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      const role = email === 'samuelabedecornelius@gmail.com' ? 'admin' : 'student';
      await setDoc(userDocRef, {
        name: name,
        email: email,
        role: role,
        selectedSubjects: []
      });
      setUserRole(role);
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userRole, loading, login, signupWithEmail, loginWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
