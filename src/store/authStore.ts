import { create } from 'zustand';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { User } from '../types';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetError: () => void;
}

const convertFirebaseUser = (firebaseUser: FirebaseUser): User => ({
  id: firebaseUser.uid,
  email: firebaseUser.email || '',
  displayName: firebaseUser.displayName || undefined,
  photoURL: firebaseUser.photoURL || undefined,
  createdAt: new Date(firebaseUser.metadata.creationTime || Date.now()),
});

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  initialized: false,

  signUp: async (email, password, displayName) => {
    set({ loading: true, error: null });
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      set({ 
        user: convertFirebaseUser(userCredential.user),
        loading: false
      });
    } catch (error) {
      set({ 
        error: (error as Error).message, 
        loading: false 
      });
    }
  },

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      set({ 
        user: convertFirebaseUser(userCredential.user),
        loading: false
      });
    } catch (error) {
      set({ 
        error: (error as Error).message, 
        loading: false 
      });
    }
  },

  signOut: async () => {
    set({ loading: true, error: null });
    try {
      await firebaseSignOut(auth);
      set({ user: null, loading: false });
    } catch (error) {
      set({ 
        error: (error as Error).message, 
        loading: false 
      });
    }
  },

  resetError: () => set({ error: null }),
}));

// Initialize auth state listener
onAuthStateChanged(auth, (firebaseUser) => {
  if (firebaseUser) {
    useAuthStore.setState({ 
      user: convertFirebaseUser(firebaseUser),
      initialized: true
    });
  } else {
    useAuthStore.setState({ 
      user: null,
      initialized: true
    });
  }
});