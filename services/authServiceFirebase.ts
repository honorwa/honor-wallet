import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendEmailVerification,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { auth } from './firebase.config';
import { User } from '../types';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export class FirebaseAuthService {
  static async registerWithEmail(fullName: string, email: string, password: string): Promise<{ user: User; needsVerification: boolean }> {
    try {
      console.log('Creating Firebase user account...');

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, {
        displayName: fullName
      });

      console.log('Sending email verification...');
      await sendEmailVerification(firebaseUser);

      const user: User = {
        id: firebaseUser.uid,
        full_name: fullName,
        email: email,
        role: 'user',
        kyc_status: 'none',
        status: 'active',
        verified: false,
        email_verified: false,
        join_date: new Date().toISOString(),
      };

      console.log('User registered successfully. Email verification sent to:', email);

      return {
        user,
        needsVerification: true
      };
    } catch (error: any) {
      console.error('Firebase registration error:', error);

      if (error.code === 'auth/email-already-in-use') {
        throw new Error('This email is already registered');
      }
      if (error.code === 'auth/weak-password') {
        throw new Error('Password should be at least 6 characters');
      }
      if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address');
      }

      throw new Error(error.message || 'Registration failed');
    }
  }

  static async loginWithEmail(email: string, password: string): Promise<User> {
    try {
      console.log('Signing in with email/password...');

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      if (!firebaseUser.emailVerified) {
        console.warn('Email not verified yet');
      }

      const user: User = {
        id: firebaseUser.uid,
        full_name: firebaseUser.displayName || 'User',
        email: firebaseUser.email || email,
        role: 'user',
        kyc_status: 'none',
        status: 'active',
        verified: firebaseUser.emailVerified,
        email_verified: firebaseUser.emailVerified,
        join_date: new Date().toISOString(),
      };

      console.log('User logged in successfully:', user.email);
      return user;
    } catch (error: any) {
      console.error('Firebase login error:', error);

      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        throw new Error('Invalid email or password');
      }
      if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many attempts. Please try again later');
      }

      throw new Error(error.message || 'Login failed');
    }
  }

  static async loginWithGoogle(): Promise<User> {
    try {
      console.log('Signing in with Google...');

      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      const user: User = {
        id: firebaseUser.uid,
        full_name: firebaseUser.displayName || 'User',
        email: firebaseUser.email || '',
        role: 'user',
        kyc_status: 'none',
        status: 'active',
        verified: true,
        email_verified: true,
        join_date: new Date().toISOString(),
      };

      console.log('Google sign-in successful:', user.email);
      return user;
    } catch (error: any) {
      console.error('Google sign-in error:', error);

      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in cancelled');
      }
      if (error.code === 'auth/popup-blocked') {
        throw new Error('Popup blocked. Please allow popups for this site');
      }
      if (error.code === 'auth/unauthorized-domain') {
        throw new Error('This domain is not authorized. Add it in Firebase Console');
      }
      if (error.code === 'auth/configuration-not-found') {
        throw new Error('Google Sign-In not configured in Firebase Console');
      }

      throw new Error(error.message || 'Google sign-in failed');
    }
  }

  static async logout(): Promise<void> {
    try {
      await firebaseSignOut(auth);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  static onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const user: User = {
          id: firebaseUser.uid,
          full_name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          role: 'user',
          kyc_status: 'none',
          status: 'active',
          verified: firebaseUser.emailVerified,
          email_verified: firebaseUser.emailVerified,
          join_date: new Date().toISOString(),
        };
        callback(user);
      } else {
        callback(null);
      }
    });
  }

  static getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  static async resendVerificationEmail(): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user logged in');
    }

    if (user.emailVerified) {
      throw new Error('Email already verified');
    }

    await sendEmailVerification(user);
    console.log('Verification email resent');
  }
}

export const firebaseAuthService = FirebaseAuthService;
