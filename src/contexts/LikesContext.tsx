import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { sessionStore } from '../services/sessionStore';

interface LikesContextType {
  likedItems: Set<string>;
  toggleLike: (itemId: string) => void;
  isLiked: (itemId: string) => boolean;
}

const LikesContext = createContext<LikesContextType | undefined>(undefined);

const STORAGE_PREFIX = 'joybor_liked_ids_';

function storageKey(): string {
  const token = sessionStore.getAccess();
  if (!token) return `${STORAGE_PREFIX}guest`;
  try {
    const payload = JSON.parse(atob(token.split('.')[1] || '')) as { user_id?: number };
    if (payload.user_id != null) return `${STORAGE_PREFIX}${payload.user_id}`;
  } catch {
    // fall through
  }
  return `${STORAGE_PREFIX}guest`;
}

function loadIds(): Set<string> {
  try {
    const raw = sessionStorage.getItem(storageKey());
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(Array.isArray(arr) ? arr.map(String) : []);
  } catch {
    return new Set();
  }
}

function saveIds(ids: Set<string>) {
  sessionStorage.setItem(storageKey(), JSON.stringify(Array.from(ids)));
}

export const LikesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [likedItems, setLikedItems] = useState<Set<string>>(() => loadIds());

  useEffect(() => {
    setLikedItems(loadIds());
  }, []);

  const toggleLike = useCallback((itemId: string) => {
    setLikedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      saveIds(next);
      return next;
    });
  }, []);

  const isLiked = useCallback(
    (itemId: string) => likedItems.has(itemId),
    [likedItems]
  );

  return (
    <LikesContext.Provider value={{ likedItems, toggleLike, isLiked }}>
      {children}
    </LikesContext.Provider>
  );
};

export const useLikes = () => {
  const context = useContext(LikesContext);
  if (context === undefined) {
    throw new Error('useLikes must be used within a LikesProvider');
  }
  return context;
};
