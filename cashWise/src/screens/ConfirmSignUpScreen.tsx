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
import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import { AuthStackParamList } from '../navigation/AuthStack';

type Props = NativeStackScreenProps<AuthStackParamList, 'ConfirmSignUp'>;

const ConfirmSignUpScreen: React.FC<Props> = ({ route, navigation }) => {
  const { username } = route.params;
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  const handleConfirm = async () => {
    if (!code.trim()) {
      Alert.alert('Missing code', 'Please enter the confirmation code.');
      return;
    }

    try {
      setSubmitting(true);
      await confirmSignUp({
        username,
        confirmationCode: code.trim(),
      });
      Alert.alert('Confirmed', 'Your account is confirmed. Please sign in.');
      navigation.navigate('SignIn');
    } catch (err: any) {
      console.error('ConfirmSignUp error', err);
      Alert.alert('Confirmation failed', err.message || 'Please check the code.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      await resendSignUpCode({ username });
      Alert.alert('Code sent', 'A new confirmation code has been emailed to you.');
    } catch (err: any) {
      console.error('Resend error', err);
      Alert.alert('Resend failed', err.message || 'Try again later.');
    } finally {
      setResending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm account</Text>
      <Text style={styles.subtitle}>Enter the code sent to {username}</Text>

      <Text style={styles.label}>Confirmation Code</Text>
      <TextInput
        style={styles.input}
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        placeholder="123456"
      />

      <View style={{ marginTop: 16 }}>
        <Button
          title={submitting ? 'Confirming...' : 'Confirm'}
          onPress={handleConfirm}
          disabled={submitting}
        />
      </View>

      <TouchableOpacity style={{ marginTop: 16 }} onPress={handleResend} disabled={resending}>
        <Text style={styles.link}>
          {resending ? 'Resending...' : 'Resend code'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ConfirmSignUpScreen;

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
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
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
