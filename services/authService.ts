import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from './firebase.config';

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export class AuthService {
  static async signInWithGoogle(): Promise<User> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      
      console.log('✅ Connexion Google réussie', {
        user: result.user.email,
        token: token ? 'présent' : 'absent'
      });
      
      return result.user;
    } catch (error: any) {
      console.error('❌ Erreur connexion Google:', error);
      
      if (error.code === 'auth/popup-blocked') {
        console.log('🔄 Popup bloquée, tentative avec redirect...');
        await this.signInWithGoogleRedirect();
        throw new Error('Redirection vers Google...');
      }
      
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Connexion annulée par l\'utilisateur');
      }
      
      if (error.code === 'auth/unauthorized-domain') {
        throw new Error('Domaine non autorisé. Ajoutez ce domaine dans Firebase Console');
      }
      
      throw error;
    }
  }

  static async signInWithGoogleRedirect(): Promise<void> {
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error('❌ Erreur redirect Google:', error);
      throw error;
    }
  }

  static async checkRedirectResult(): Promise<User | null> {
    try {
      const result = await getRedirectResult(auth);
      if (result) {
        console.log('✅ Connexion redirect réussie:', result.user.email);
        return result.user;
      }
      return null;
    } catch (error: any) {
      console.error('❌ Erreur redirect result:', error);
      throw error;
    }
  }

  static async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
      console.log('✅ Déconnexion réussie');
    } catch (error) {
      console.error('❌ Erreur déconnexion:', error);
      throw error;
    }
  }

  static onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }
}

// Export par défaut pour compatibilité
export const authService = AuthService;
