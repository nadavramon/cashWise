import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { signUp } from 'aws-amplify/auth';
import { AuthStackParamList } from '../../navigation/AuthStack';

type Props = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSignUp = async () => {
    if (!username || !email || !password) {
      Alert.alert('Missing fields', 'Please fill all fields.');
      return;
    }

    try {
      setSubmitting(true);
      await signUp({
        username: username.trim(),
        password,
        options: {
          userAttributes: {
            email: email.trim(),
          },
        },
      });

      Alert.alert(
        'Account created',
        'Enter the confirmation code we just emailed you.',
      );
      navigation.navigate('ConfirmSignUp', { username: username.trim() });
    } catch (err: any) {
      console.error('SignUp error', err);
      Alert.alert('Sign up failed', err.message || 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create account</Text>

      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        placeholder="yourname"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="you@example.com"
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
          title={submitting ? 'Signing up...' : 'Sign Up'}
          onPress={handleSignUp}
          disabled={submitting}
        />
      </View>

      <TouchableOpacity
        style={{ marginTop: 16 }}
        onPress={() => navigation.navigate('SignIn')}
      >
        <Text style={styles.link}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
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
    color: '#0066cc',
    textAlign: 'center',
  },
});
