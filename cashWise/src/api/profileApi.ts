// src/api/profileApi.ts
import { graphqlClient } from "./graphqlClient";
import { GET_USER_PROFILE, UPDATE_USER_PROFILE } from "./operations";

export type DateRangePresetApi =
  | "CURRENT_CYCLE"
  | "LAST_CYCLE"
  | "THIS_MONTH"
  | "LAST_MONTH"
  | "YEAR_TO_DATE"
  | "CUSTOM";

export interface UserProfileApi {
  userId: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  language?: string | null;

  currency: string;
  billingCycleStartDay: number;
  billingCycleTimezone: string;
  overviewDateRangePreset: DateRangePresetApi;
  budgetDateRangePreset: DateRangePresetApi;

  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserProfileInputApi {
  email?: string;
  firstName?: string;
  lastName?: string;
  language?: string;
  currency?: string;
  billingCycleStartDay?: number;
  billingCycleTimezone?: string;
  overviewDateRangePreset?: DateRangePresetApi;
  budgetDateRangePreset?: DateRangePresetApi;
}

interface GetUserProfileResponse {
  getUserProfile: UserProfileApi | null;
}

interface UpdateUserProfileResponse {
  updateUserProfile: UserProfileApi;
}

export async function apiGetUserProfile(): Promise<UserProfileApi | null> {
  const result = await graphqlClient.graphql<GetUserProfileResponse>({
    query: GET_USER_PROFILE,
  });

  if ("data" in result) {
    return result.data?.getUserProfile ?? null;
  }

  return null;
}

export async function apiUpdateUserProfile(
  input: UpdateUserProfileInputApi,
): Promise<UserProfileApi> {
  const result = await graphqlClient.graphql<UpdateUserProfileResponse>({
    query: UPDATE_USER_PROFILE,
    variables: { input },
  });

  if ("data" in result && result.data?.updateUserProfile) {
    return result.data.updateUserProfile;
  }

  throw new Error("Failed to update profile");
}
