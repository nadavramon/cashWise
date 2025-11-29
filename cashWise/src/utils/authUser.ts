export function extractUserId(user: any | null): string | null {
  if (!user) return null;

  // Amplify v6 getCurrentUser() format
  if (typeof user.userId === 'string') return user.userId;

  // Older Amplify user format
  if (user.attributes?.sub) return user.attributes.sub;

  // Fallback: some configs use username as identifier
  if (typeof user.username === 'string') return user.username;

  return null;
}

export function extractUserEmail(user: any | null): string | null {
  if (!user) return null;

  // Amplify v6
  if (typeof user.signInDetails?.loginId === 'string') {
    return user.signInDetails.loginId;
  }

  // Older Amplify user format
  if (user.attributes?.email) return user.attributes.email;

  return null;
}

export function extractUsername(user: any | null): string | null {
  if (!user) return null;

  if (typeof user.username === 'string') return user.username;
  if (typeof user.signInDetails?.loginId === 'string') {
    return user.signInDetails.loginId;
  }
  if (user.attributes?.preferred_username) return user.attributes.preferred_username;

  return null;
}
