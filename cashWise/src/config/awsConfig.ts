// cashWise/src/awsConfig.ts
import type { ResourcesConfig } from "aws-amplify";

const awsConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.EXPO_PUBLIC_USER_POOL_ID!,
      userPoolClientId: process.env.EXPO_PUBLIC_USER_POOL_CLIENT_ID!,
      loginWith: {
        username: true,
        email: true,
      },
    },
  },
  API: {
    GraphQL: {
      endpoint: process.env.EXPO_PUBLIC_GRAPHQL_ENDPOINT!,
      region: process.env.EXPO_PUBLIC_AWS_REGION!,
      defaultAuthMode: "userPool", // because AppSync uses your Cognito user pool
    },
  },
};

export default awsConfig;
