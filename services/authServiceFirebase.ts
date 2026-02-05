import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  User as FirebaseUser,
} from "firebase/auth";
import { User } from "../types";
import { auth } from "./firebase.config";

type AuthErrorWithCode = Error & { code?: string };

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

const createAuthError = (message: string, code?: string): AuthErrorWithCode => {
  const authError = new Error(message) as AuthErrorWithCode;
  authError.code = code;
  return authError;
};

const toAppUser = (firebaseUser: FirebaseUser, fallbackEmail = ""): User => ({
  id: firebaseUser.uid,
  full_name: firebaseUser.displayName || "User",
  email: firebaseUser.email || fallbackEmail,
  role: "user",
  kyc_status: "none",
  status: "on_hold",
  verified: firebaseUser.emailVerified,
  email_verified: firebaseUser.emailVerified,
  join_date: new Date().toISOString(),
  buy_access: false,
});

export class FirebaseAuthService {
  static async registerWithEmail(
    fullName: string,
    email: string,
    password: string,
  ): Promise<{ user: User; needsVerification: boolean }> {
    try {
      console.log("Creating Firebase user account...");

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, { displayName: fullName });

      console.log("Sending email verification...");
      await sendEmailVerification(firebaseUser);

      const user: User = {
        id: firebaseUser.uid,
        full_name: fullName,
        email,
        role: "user",
        kyc_status: "none",
        status: "on_hold",
        verified: false,
        email_verified: false,
        join_date: new Date().toISOString(),
        buy_access: false,
      };

      console.log(
        "User registered successfully. Email verification sent to:",
        email,
      );

      return { user, needsVerification: true };
    } catch (error: any) {
      console.error("Firebase registration error:", error);

      if (error.code === "auth/email-already-in-use") {
        throw createAuthError("This email is already registered", error.code);
      }
      if (error.code === "auth/weak-password") {
        throw createAuthError("Password should be at least 6 characters", error.code);
      }
      if (error.code === "auth/invalid-email") {
        throw createAuthError("Invalid email address", error.code);
      }

      throw createAuthError(error.message || "Registration failed", error.code);
    }
  }

  static async loginWithEmail(email: string, password: string): Promise<User> {
    try {
      console.log("Signing in with email/password...");

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const firebaseUser = userCredential.user;

      if (!firebaseUser.emailVerified) {
        console.warn("Email not verified yet");
      }

      const user = toAppUser(firebaseUser, email);
      console.log("User logged in successfully:", user.email);
      return user;
    } catch (error: any) {
      console.error("Firebase login error:", error);

      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        throw createAuthError("Invalid email or password", error.code);
      }
      if (error.code === "auth/too-many-requests") {
        throw createAuthError("Too many attempts. Please try again later", error.code);
      }

      throw createAuthError(error.message || "Login failed", error.code);
    }
  }

  static async loginWithGoogle(): Promise<User> {
    try {
      console.log("Signing in with Google...");

      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      const user: User = {
        ...toAppUser(firebaseUser),
        verified: true,
        email_verified: true,
      };

      console.log("Google sign-in successful:", user.email);
      return user;
    } catch (error: any) {
      console.error("Google sign-in error:", error);

      if (error.code === "auth/popup-closed-by-user") {
        throw createAuthError("Sign-in cancelled", error.code);
      }
      if (error.code === "auth/popup-blocked") {
        throw createAuthError(
          "Popup blocked. Please allow popups for this site",
          error.code,
        );
      }
      if (error.code === "auth/unauthorized-domain") {
        throw createAuthError(
          "This domain is not authorized. Add it in Firebase Console",
          error.code,
        );
      }
      if (error.code === "auth/configuration-not-found") {
        throw createAuthError(
          "Google Sign-In not configured in Firebase Console",
          error.code,
        );
      }

      throw createAuthError(error.message || "Google sign-in failed", error.code);
    }
  }

  static async logout(): Promise<void> {
    try {
      await firebaseSignOut(auth);
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }

  static onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        callback(toAppUser(firebaseUser));
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
      throw new Error("No user logged in");
    }

    if (user.emailVerified) {
      throw new Error("Email already verified");
    }

    await sendEmailVerification(user);
    console.log("Verification email resent");
  }
}
