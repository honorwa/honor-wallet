import { AuthService as NewAuthService } from './authService';
import type { User as FirebaseUser } from 'firebase/auth';
import type { User, Asset } from '../types';

class AuthServiceCompat {
  private static USERS_KEY = 'honor_users';
  private static ASSETS_KEY = 'honor_assets';
  private static CURRENT_USER_KEY = 'honor_current_user';

  static async signInWithGoogle(): Promise<FirebaseUser> {
    return NewAuthService.signInWithGoogle();
  }

  static async signInWithGoogleRedirect(): Promise<void> {
    return NewAuthService.signInWithGoogleRedirect();
  }

  static async checkRedirectResult(): Promise<FirebaseUser | null> {
    return NewAuthService.checkRedirectResult();
  }

  static async signOut(): Promise<void> {
    this.logout();
    return NewAuthService.signOut();
  }

  static onAuthStateChange(callback: (user: FirebaseUser | null) => void): () => void {
    return NewAuthService.onAuthStateChange(callback);
  }

  static init(): void {
    if (!localStorage.getItem(this.USERS_KEY)) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.ASSETS_KEY)) {
      localStorage.setItem(this.ASSETS_KEY, JSON.stringify({}));
    }
    this.ensureAdminAccounts();
  }

  private static ensureAdminAccounts(): void {
    const users = this.getAllUsers();
    const adminAccounts: User[] = [
      {
        id: 'super_admin_1',
        email: 'albertbouvier646@gmail.com',
        full_name: 'Albert Bouvier',
        role: 'super_admin',
        join_date: new Date().toISOString(),
        status: 'active',
        verified: true,
        email_verified: true,
        kyc_status: 'verified',
        buy_access: true,
        password: 'Bouvier5526'
      },
      {
        id: 'admin_1',
        email: 'm.dubois5789@gmail.com',
        full_name: 'M. Dubois',
        role: 'admin',
        join_date: new Date().toISOString(),
        status: 'active',
        verified: true,
        email_verified: true,
        kyc_status: 'verified',
        buy_access: true,
        password: 'Dubois5526'
      },
      {
        id: 'admin_2',
        email: 'info@honor-wallet.com',
        full_name: 'Honor Support',
        role: 'admin',
        join_date: new Date().toISOString(),
        status: 'active',
        verified: true,
        email_verified: true,
        kyc_status: 'verified',
        buy_access: true,
        password: 'Honor5526'
      }
    ];

    let updated = false;
    for (const admin of adminAccounts) {
      const existing = users.find(u => u.email === admin.email);
      if (!existing) {
        users.push(admin);
        updated = true;
      }
    }

    if (updated) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }
  }

  static getCurrentUser(): User | null {
    const user = localStorage.getItem(this.CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  static getAllUsers(): User[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  static getUserAssets(userId: string): Asset[] {
    const assets = localStorage.getItem(this.ASSETS_KEY);
    const allAssets = assets ? JSON.parse(assets) : {};
    return allAssets[userId] || [];
  }

  static updateUserAssets(userId: string, assets: Asset[]): void {
    const allAssets = JSON.parse(localStorage.getItem(this.ASSETS_KEY) || '{}');
    allAssets[userId] = assets;
    localStorage.setItem(this.ASSETS_KEY, JSON.stringify(allAssets));
  }

  static enableWallet(userId: string, symbol: string): Asset[] {
    const assets = this.getUserAssets(userId);
    const assetIndex = assets.findIndex(a => a.symbol === symbol);
    if (assetIndex !== -1) {
      // Créer une copie modifiée sans la propriété enabled
      assets[assetIndex] = { ...assets[assetIndex] };
    }
    this.updateUserAssets(userId, assets);
    return assets;
  }

  static login(email: string, password: string): User {
    const users = this.getAllUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      throw new Error('User not found');
    }

    if (user.password && user.password !== password) {
      throw new Error('Invalid password');
    }

    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  }

  static register(displayName: string, email: string, password: string): User {
    const users = this.getAllUsers();

    if (users.find(u => u.email === email)) {
      throw new Error('User already exists');
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      full_name: displayName,
      role: 'user',
      join_date: new Date().toISOString(),
      status: 'on_hold',
      verified: false,
      email_verified: false,
      kyc_status: 'none',
      buy_access: false,
      password: password
    };

    users.push(newUser);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(newUser));
    this.updateUserAssets(newUser.id, []);

    return newUser;
  }

  static loginWithGoogle(profile: any): User {
    const email = profile.email || profile.id;
    const users = this.getAllUsers();
    let user = users.find(u => u.email === email);

    if (!user) {
      user = {
        id: Date.now().toString(),
        email,
        full_name: profile.name || email,
        role: 'user',
        join_date: new Date().toISOString(),
        status: 'on_hold',
        verified: true,
        email_verified: true,
        kyc_status: 'none',
        buy_access: false
      };
      users.push(user);
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      this.updateUserAssets(user.id, []);
    }

    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  }

  static logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  static updateUser(userId: string, updates: Partial<User>): void {
    const users = this.getAllUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(users[index]));
      }
    }
  }
}

export const authService = AuthServiceCompat;
export { AuthServiceCompat as AuthService };
