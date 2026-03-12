import { db, isFirebaseConfigured } from './firebase.config';
import type { Asset } from '../types';

/**
 * Firestore Asset Service
 * Handles reading and writing user assets to Firestore.
 * Falls back to localStorage when Firebase is not configured.
 */

const ASSETS_KEY = 'honor_assets';

// ─── Firestore helpers ────────────────────────────────────────────────────────

async function firestoreGetUserAssets(userId: string): Promise<Asset[] | null> {
  try {
    const { doc, getDoc } = await import('firebase/firestore');
    const ref = doc(db, 'user_assets', userId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return (snap.data().assets as Asset[]) || [];
    }
    return null;
  } catch (e) {
    console.error('[Firestore] getUserAssets error:', e);
    return null;
  }
}

async function firestoreSetUserAssets(userId: string, assets: Asset[]): Promise<boolean> {
  try {
    const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
    const ref = doc(db, 'user_assets', userId);
    await setDoc(ref, { assets, updatedAt: serverTimestamp() }, { merge: true });
    return true;
  } catch (e) {
    console.error('[Firestore] setUserAssets error:', e);
    return false;
  }
}

// ─── localStorage helpers ─────────────────────────────────────────────────────

function localGetUserAssets(userId: string): Asset[] {
  const raw = localStorage.getItem(ASSETS_KEY);
  const all = raw ? JSON.parse(raw) : {};
  return all[userId] || [];
}

function localSetUserAssets(userId: string, assets: Asset[]): void {
  const raw = localStorage.getItem(ASSETS_KEY);
  const all = raw ? JSON.parse(raw) : {};
  all[userId] = assets;
  localStorage.setItem(ASSETS_KEY, JSON.stringify(all));
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Get user assets — tries Firestore first, falls back to localStorage.
 */
export async function getUserAssetsAsync(userId: string): Promise<Asset[]> {
  if (isFirebaseConfigured) {
    const fsAssets = await firestoreGetUserAssets(userId);
    if (fsAssets !== null) {
      // Keep localStorage in sync for offline reads
      localSetUserAssets(userId, fsAssets);
      return fsAssets;
    }
  }
  return localGetUserAssets(userId);
}

/**
 * Save user assets — writes to Firestore AND localStorage.
 */
export async function updateUserAssetsAsync(userId: string, assets: Asset[]): Promise<void> {
  // Always write to localStorage immediately (instant UI update)
  localSetUserAssets(userId, assets);

  // Also persist to Firestore if configured
  if (isFirebaseConfigured) {
    const ok = await firestoreSetUserAssets(userId, assets);
    if (!ok) {
      console.warn('[FirestoreAssetService] Firestore write failed — data saved to localStorage only.');
    }
  }
}

/**
 * Sync helper: push existing localStorage assets to Firestore.
 * Useful for migrating existing users on first load.
 */
export async function syncLocalToFirestore(userId: string): Promise<void> {
  if (!isFirebaseConfigured) return;
  const local = localGetUserAssets(userId);
  if (local.length === 0) return;

  const remote = await firestoreGetUserAssets(userId);
  // Only push if Firestore has no data yet
  if (remote === null || remote.length === 0) {
    await firestoreSetUserAssets(userId, local);
    console.log(`[FirestoreAssetService] Migrated ${local.length} assets for user ${userId}`);
  }
}
