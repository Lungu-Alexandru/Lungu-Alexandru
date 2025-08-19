'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser, 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User } from '@/types';
import toast from 'react-hot-toast';

interface AuthContextType {
  currentUser: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
  resendEmailVerification: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();
  const appleProvider = new OAuthProvider('apple.com');

  // Configure providers
  googleProvider.addScope('email');
  googleProvider.addScope('profile');
  facebookProvider.addScope('email');
  appleProvider.addScope('email');
  appleProvider.addScope('name');

  const createUserDocument = async (firebaseUser: FirebaseUser, additionalData?: Partial<User>) => {
    if (!firebaseUser) return;

    const userRef = doc(db, 'users', firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const { displayName, email, photoURL, phoneNumber } = firebaseUser;
      
      try {
        const userData: Omit<User, 'uid'> = {
          email: email!,
          displayName: displayName || '',
          photoURL: photoURL || '',
          phoneNumber: phoneNumber || '',
          role: 'user',
          createdAt: serverTimestamp() as any,
          updatedAt: serverTimestamp() as any,
          preferences: {
            language: 'ro',
            notifications: true,
            categories: []
          },
          ...additionalData
        };

        await setDoc(userRef, userData);
        
        const newUserSnap = await getDoc(userRef);
        return { uid: firebaseUser.uid, ...newUserSnap.data() } as User;
      } catch (error) {
        console.error('Error creating user document:', error);
        throw error;
      }
    } else {
      return { uid: firebaseUser.uid, ...userSnap.data() } as User;
    }
  };

  const fetchUserData = async (firebaseUser: FirebaseUser) => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return { uid: firebaseUser.uid, ...userSnap.data() } as User;
      } else {
        return await createUserDocument(firebaseUser);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      if (!result.user.emailVerified) {
        toast.error('Vă rugăm să vă verificați email-ul înainte de a vă conecta.');
        await signOut(auth);
        return;
      }

      const userData = await fetchUserData(result.user);
      setCurrentUser(userData);
      toast.success('Conectare reușită!');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(getAuthErrorMessage(error.code));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, additionalData: Partial<User> = {}) => {
    try {
      setLoading(true);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update Firebase Auth profile
      if (additionalData.displayName) {
        await updateProfile(result.user, {
          displayName: additionalData.displayName
        });
      }

      // Send email verification
      await sendEmailVerification(result.user);
      
      // Create user document
      await createUserDocument(result.user, additionalData);
      
      toast.success('Cont creat cu succes! Vă rugăm să vă verificați email-ul.');
      
      // Sign out until email is verified
      await signOut(auth);
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(getAuthErrorMessage(error.code));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const userData = await createUserDocument(result.user);
      setCurrentUser(userData);
      toast.success('Conectare cu Google reușită!');
    } catch (error: any) {
      console.error('Google login error:', error);
      toast.error('Eroare la conectarea cu Google');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithFacebook = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, facebookProvider);
      const userData = await createUserDocument(result.user);
      setCurrentUser(userData);
      toast.success('Conectare cu Facebook reușită!');
    } catch (error: any) {
      console.error('Facebook login error:', error);
      toast.error('Eroare la conectarea cu Facebook');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithApple = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, appleProvider);
      const userData = await createUserDocument(result.user);
      setCurrentUser(userData);
      toast.success('Conectare cu Apple reușită!');
    } catch (error: any) {
      console.error('Apple login error:', error);
      toast.error('Eroare la conectarea cu Apple');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setFirebaseUser(null);
      toast.success('Deconectare reușită!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Eroare la deconectare');
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Email de resetare parolă trimis!');
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error(getAuthErrorMessage(error.code));
      throw error;
    }
  };

  const updateUserProfile = async (userData: Partial<User>) => {
    if (!currentUser) throw new Error('Nu există utilizator conectat');

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        ...userData,
        updatedAt: serverTimestamp()
      });

      // Update local state
      setCurrentUser({ ...currentUser, ...userData });
      toast.success('Profil actualizat cu succes!');
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Eroare la actualizarea profilului');
      throw error;
    }
  };

  const resendEmailVerification = async () => {
    if (!firebaseUser) throw new Error('Nu există utilizator conectat');

    try {
      await sendEmailVerification(firebaseUser);
      toast.success('Email de verificare retrimis!');
    } catch (error: any) {
      console.error('Resend verification error:', error);
      toast.error('Eroare la retrimiterea email-ului de verificare');
      throw error;
    }
  };

  const refreshUser = async () => {
    if (!firebaseUser) return;

    try {
      const userData = await fetchUserData(firebaseUser);
      setCurrentUser(userData);
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      setFirebaseUser(firebaseUser);

      if (firebaseUser) {
        if (firebaseUser.emailVerified) {
          const userData = await fetchUserData(firebaseUser);
          setCurrentUser(userData);
        } else {
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    firebaseUser,
    loading,
    login,
    register,
    loginWithGoogle,
    loginWithFacebook,
    loginWithApple,
    logout,
    resetPassword,
    updateUserProfile,
    resendEmailVerification,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'Nu există cont cu acest email';
    case 'auth/wrong-password':
      return 'Parolă incorectă';
    case 'auth/email-already-in-use':
      return 'Există deja un cont cu acest email';
    case 'auth/weak-password':
      return 'Parola este prea slabă';
    case 'auth/invalid-email':
      return 'Email invalid';
    case 'auth/user-disabled':
      return 'Acest cont a fost dezactivat';
    case 'auth/too-many-requests':
      return 'Prea multe încercări. Încercați din nou mai târziu';
    default:
      return 'A apărut o eroare. Încercați din nou';
  }
};