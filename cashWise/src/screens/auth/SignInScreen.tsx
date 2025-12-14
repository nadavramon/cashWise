import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { signIn, getCurrentUser, resendSignUpCode } from "aws-amplify/auth";
import { AuthStackParamList } from "../../navigation/AuthStack";
import { useAuth } from "../../context/AuthContext";

type Props = NativeStackScreenProps<AuthStackParamList, "SignIn">;

const SignInScreen: React.FC<Props> = ({ navigation }) => {
  const { setUser } = useAuth();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSignIn = async () => {
    if (!usernameOrEmail || !password) {
      Alert.alert(
        "Missing fields",
        "Please enter username/email and password.",
      );
      return;
    }

    try {
      setSubmitting(true);
      const result = await signIn({
        username: usernameOrEmail.trim(),
        password,
        options: {
          authFlowType: "USER_PASSWORD_AUTH",
        },
      });

      if (result.isSignedIn) {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      }
      // App.tsx will switch to the main tabs when user is set
    } catch (err: any) {
      console.error("SignIn error", err);
      if (err?.name === "UserNotConfirmedException") {
        try {
          await resendSignUpCode({ username: usernameOrEmail.trim() });
        } catch (resendErr) {
          console.error("Resend code error", resendErr);
        }
        Alert.alert(
          "Confirm your account",
          "Enter the confirmation code we emailed you.",
        );
        navigation.navigate("ConfirmSignUp", {
          username: usernameOrEmail.trim(),
        });
      } else {
        Alert.alert("Sign in failed", err.message || "Check your credentials.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>cashWise</Text>

      <Text style={styles.label}>Username or Email</Text>
      <TextInput
        style={styles.input}
        value={usernameOrEmail}
        autoCapitalize="none"
        onChangeText={setUsernameOrEmail}
        placeholder="yourname or you@example.com"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="••••••••"
      />

      <View style={{ marginTop: 16 }}>
        <Button
          title={submitting ? "Signing in..." : "Sign In"}
          onPress={handleSignIn}
          disabled={submitting}
        />
      </View>

      <TouchableOpacity
        style={{ marginTop: 16 }}
        onPress={() => navigation.navigate("SignUp")}
      >
        <Text style={styles.link}>Don&apos;t have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  link: {
    color: "#0066cc",
    textAlign: "center",
  },
});
