// src/api/profileApi.ts
import { graphqlClient } from './graphqlClient';
import { GET_USER_PROFILE, UPSERT_USER_PROFILE } from './operations';

export interface UserProfileApi {
  id: string;
  email: string;
  createdAt: string;
  currency?: string | null;
  defaultDateRangePreset?: string | null;
  language?: string | null;
  firstName?: string | null;
  lastName?: string | null;
}

export interface UpsertUserProfileInputApi {
  currency?: string;
  defaultDateRangePreset?: string;
  language?: string;
  firstName?: string;
  lastName?: string;
}

interface GetUserProfileResponse {
  getUserProfile: UserProfileApi | null;
}

export async function apiGetUserProfile(): Promise<UserProfileApi | null> {
  const result = await graphqlClient.graphql<GetUserProfileResponse>({
    query: GET_USER_PROFILE,
  });

  if ('data' in result) {
    return result.data?.getUserProfile ?? null;
  }

  return null;
}

export async function apiUpsertUserProfile(
  input: UpsertUserProfileInputApi,
): Promise<UserProfileApi> {
  await graphqlClient.graphql({
    query: UPSERT_USER_PROFILE,
    variables: { input },
  });
  const updated = await apiGetUserProfile();
  if (!updated) throw new Error('Profile not found after update');
  return updated;
}
