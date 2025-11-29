import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useAuth } from './AuthContext';
import {
  apiGetUserProfile,
  apiUpsertUserProfile,
  UserProfileApi,
  UpsertUserProfileInputApi,
} from '../api/profileApi';

export interface UserProfile {
  id: string;
  email: string;
  createdAt: string;
  currency?: string;
  defaultDateRangePreset?: string;
  language?: string;
  firstName?: string;
  lastName?: string;
}

interface ProfileContextValue {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  saveProfile: (patch: UpsertUserProfileInputApi) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(
  undefined,
);

export const useProfile = (): ProfileContextValue => {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error('useProfile must be used within ProfileProvider');
  }
  return ctx;
};

const mapApiToProfile = (p: UserProfileApi): UserProfile => ({
  id: p.id,
  email: p.email,
  createdAt: p.createdAt,
  currency: p.currency ?? undefined,
  defaultDateRangePreset: p.defaultDateRangePreset ?? undefined,
  language: p.language ?? undefined,
  firstName: p.firstName ?? undefined,
  lastName: p.lastName ?? undefined,
});

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { userId } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshProfile = async () => {
    if (!userId) {
      setProfile(null);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const p = await apiGetUserProfile();
      if (p) {
        setProfile(mapApiToProfile(p));
      } else {
        setProfile(null);
      }
    } catch (e: any) {
      console.error('Failed to load profile', e);
      setError(e?.message ?? 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const saveProfile = async (patch: UpsertUserProfileInputApi) => {
    if (!userId) throw new Error('Not signed in');

    try {
      setError(null);
      const updated = await apiUpsertUserProfile(patch);
      setProfile(mapApiToProfile(updated));
    } catch (e: any) {
      console.error('Failed to save profile', e);
      setError(e?.message ?? 'Failed to save profile');
      throw e;
    }
  };

  return (
    <ProfileContext.Provider
      value={{ profile, loading, error, refreshProfile, saveProfile }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
