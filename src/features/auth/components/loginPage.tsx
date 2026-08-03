// src/app/auth/login.tsx

import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import {
  saveAuthSession,
} from '@/features/auth/storage/authStorage';

import {
  saveProfile,
} from '@/features/profile/storage/profileStorage';

import type {
  ProfileRole,
  UserProfile,
} from '@/features/profile/types/profile.types';

const DEMO_OTP = '123456';
const ADMIN_PHONE = '9876543210';
const RESEND_SECONDS = 30;

type LoginStep =
  | 'phone'
  | 'otp';

function getDigits(
  value: string,
): string {
  return value.replace(/\D/g, '');
}

function formatPhoneNumber(
  value: string,
): string {
  const digits = getDigits(value).slice(
    0,
    10,
  );

  if (digits.length <= 5) {
    return digits;
  }

  return `${digits.slice(
    0,
    5,
  )} ${digits.slice(5)}`;
}

function formatTimer(
  seconds: number,
): string {
  const minutes = Math.floor(
    seconds / 60,
  );

  const remainingSeconds =
    seconds % 60;

  return `${String(minutes).padStart(
    2,
    '0',
  )}:${String(
    remainingSeconds,
  ).padStart(2, '0')}`;
}

export default function LoginScreen() {
  const router = useRouter();

  const otpInputRef =
    useRef<TextInput>(null);

  const [step, setStep] =
    useState<LoginStep>('phone');

  const [phone, setPhone] =
    useState('');

  const [otp, setOtp] =
    useState('');

  const [isLoading, setIsLoading] =
    useState(false);

  const [
    resendSeconds,
    setResendSeconds,
  ] = useState(RESEND_SECONDS);

  const normalizedPhone =
    useMemo(
      () => getDigits(phone),
      [phone],
    );

  const isValidPhone =
    normalizedPhone.length === 10;

  const isValidOtp =
    otp.length === 6;

  useEffect(() => {
    if (
      step !== 'otp' ||
      resendSeconds <= 0
    ) {
      return;
    }

    const timer = setInterval(() => {
      setResendSeconds(
        (current) =>
          Math.max(
            current - 1,
            0,
          ),
      );
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [
    step,
    resendSeconds,
  ]);

  const sendOtp =
    async () => {
      if (!isValidPhone) {
        Toast.show({
          type: 'error',
          text1:
            'Invalid phone number',
          text2:
            'Enter a valid 10-digit mobile number.',
          position: 'top',
        });

        return;
      }

      try {
        setIsLoading(true);

        // Replace with backend API later.
        await new Promise<void>(
          (resolve) => {
            setTimeout(
              resolve,
              600,
            );
          },
        );

        setOtp('');
        setResendSeconds(
          RESEND_SECONDS,
        );
        setStep('otp');

        setTimeout(() => {
          otpInputRef.current?.focus();
        }, 250);

        Toast.show({
          type: 'success',
          text1: 'OTP sent',
          text2:
            'Use 123456 for testing.',
          position: 'top',
          visibilityTime: 1800,
        });
      } catch (error) {
        console.error(
          'Send OTP failed:',
          error,
        );

        Toast.show({
          type: 'error',
          text1:
            'Unable to send OTP',
        });
      } finally {
        setIsLoading(false);
      }
    };

  const verifyOtp =
    async () => {
      if (!isValidOtp) {
        Toast.show({
          type: 'error',
          text1: 'Invalid OTP',
          text2:
            'Enter the 6-digit OTP.',
          position: 'top',
        });

        return;
      }

      try {
        setIsLoading(true);

        if (otp !== DEMO_OTP) {
          Toast.show({
            type: 'error',
            text1: 'Incorrect OTP',
            text2:
              'Use 123456 for testing.',
            position: 'top',
          });

          return;
        }

        const role: ProfileRole =
          normalizedPhone ===
          ADMIN_PHONE
            ? 'admin'
            : 'reader';

        const userId =
          `${role}-${normalizedPhone}`;

        const profile: UserProfile =
          {
            id: userId,
            name:
              role === 'admin'
                ? 'Admin User'
                : 'Reader User',
            phone:
              normalizedPhone,
            email: '',
            role,
            profileImage: '',
            locationName:
              'Tamil Nadu',
          };

        await Promise.all([
          saveAuthSession({
            isAuthenticated:
              true,
            userId,
            phone:
              normalizedPhone,
            loggedInAt:
              new Date().toISOString(),
          }),

          saveProfile(profile),
        ]);

        Toast.show({
          type: 'success',
          text1:
            role === 'admin'
              ? 'Admin login successful'
              : 'Login successful',
          text2:
            role === 'admin'
              ? 'Admin access enabled.'
              : 'Logged in as Reader.',
          position: 'top',
          visibilityTime: 1400,
        });

        router.replace('/');
      } catch (error) {
        console.error(
          'OTP verification failed:',
          error,
        );

        Toast.show({
          type: 'error',
          text1: 'Login failed',
          text2:
            'Unable to complete sign in.',
        });
      } finally {
        setIsLoading(false);
      }
    };

  const resendOtp =
    async () => {
      if (
        resendSeconds > 0 ||
        isLoading
      ) {
        return;
      }

      await sendOtp();
    };

  const changePhoneNumber =
    () => {
      setOtp('');
      setStep('phone');
      setResendSeconds(
        RESEND_SECONDS,
      );
    };

  return (
    <SafeAreaView
      edges={[
        'top',
        'bottom',
      ]}
      className="flex-1 bg-[#F7F9FC]"
    >
      <KeyboardAvoidingView
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent:
              'center',
            paddingHorizontal: 18,
            paddingVertical: 30,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={
            false
          }
        >
          <View className="mx-auto w-full max-w-[500px]">
            <AppLogo />

            <View className="mt-8 rounded-[20px] border border-slate-200 bg-white px-5 py-8 shadow-sm md:px-8">
              {step === 'phone' ? (
                <PhoneStep
                  phone={phone}
                  isLoading={
                    isLoading
                  }
                  isValidPhone={
                    isValidPhone
                  }
                  onPhoneChange={(
                    value,
                  ) => {
                    setPhone(
                      getDigits(
                        value,
                      ).slice(
                        0,
                        10,
                      ),
                    );
                  }}
                  onSubmit={() => {
                    void sendOtp();
                  }}
                />
              ) : (
                <OtpStep
                  ref={otpInputRef}
                  otp={otp}
                  phone={
                    normalizedPhone
                  }
                  isLoading={
                    isLoading
                  }
                  isValidOtp={
                    isValidOtp
                  }
                  resendSeconds={
                    resendSeconds
                  }
                  onOtpChange={
                    setOtp
                  }
                  onVerify={() => {
                    void verifyOtp();
                  }}
                  onResend={() => {
                    void resendOtp();
                  }}
                  onChangePhone={
                    changePhoneNumber
                  }
                />
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function AppLogo() {
  return (
    <View className="flex-row items-center justify-center">
      <View className="h-11 w-11 items-center justify-center rounded-xl bg-[#F44336]">
        <Text className="text-xl font-black text-white">
          J
        </Text>
      </View>

      <View className="ml-3 flex-row">
        <Text className="text-[22px] font-black text-[#0F172A]">
          Just Go
        </Text>

        <Text className="ml-1.5 text-[22px] font-black text-[#F44336]">
          Real
        </Text>
      </View>
    </View>
  );
}

type PhoneStepProps = {
  phone: string;
  isLoading: boolean;
  isValidPhone: boolean;
  onPhoneChange: (
    value: string,
  ) => void;
  onSubmit: () => void;
};

function PhoneStep({
  phone,
  isLoading,
  isValidPhone,
  onPhoneChange,
  onSubmit,
}: PhoneStepProps) {
  return (
    <>
      <View className="items-center">
        <View className="h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
          <Ionicons
            name="call-outline"
            size={25}
            color="#F44336"
          />
        </View>

        <Text className="mt-5 text-center text-[22px] font-black text-[#0F172A]">
          Welcome to Just Go Real
        </Text>

        <Text className="mt-2 text-center text-sm leading-5 text-slate-500">
          Enter your phone number to get started
        </Text>
      </View>

      <View className="mt-7">
        <Text className="mb-2 text-sm font-black text-[#0F172A]">
          Phone Number
        </Text>

        <View className="flex-row gap-3">
          <View className="h-14 min-w-[58px] items-center justify-center rounded-xl border border-slate-200 bg-[#F8FAFC] px-3">
            <Text className="text-sm font-bold text-slate-600">
              +91
            </Text>
          </View>

          <TextInput
            value={formatPhoneNumber(
              phone,
            )}
            onChangeText={
              onPhoneChange
            }
            placeholder="98765 43210"
            placeholderTextColor="#94A3B8"
            keyboardType="phone-pad"
            maxLength={11}
            className="h-14 flex-1 rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 text-sm font-semibold text-[#0F172A]"
          />
        </View>

        <Pressable
          onPress={onSubmit}
          disabled={
            !isValidPhone ||
            isLoading
          }
          className={`mt-5 h-14 flex-row items-center justify-center rounded-xl bg-[#F44336] active:opacity-80 ${
            !isValidPhone ||
            isLoading
              ? 'opacity-50'
              : ''
          }`}
        >
          {isLoading ? (
            <ActivityIndicator
              color="#FFFFFF"
            />
          ) : (
            <>
              <Text className="text-sm font-black text-white">
                Send OTP
              </Text>

              <Ionicons
                name="arrow-forward"
                size={18}
                color="#FFFFFF"
                style={{
                  marginLeft: 8,
                }}
              />
            </>
          )}
        </Pressable>

        <Text className="mx-auto mt-5 max-w-[360px] text-center text-xs leading-5 text-slate-400">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </View>
    </>
  );
}

type OtpStepProps = {
  otp: string;
  phone: string;
  isLoading: boolean;
  isValidOtp: boolean;
  resendSeconds: number;
  onOtpChange: (
    value: string,
  ) => void;
  onVerify: () => void;
  onResend: () => void;
  onChangePhone: () => void;
};

const OtpStep = forwardRef<
  TextInput,
  OtpStepProps
>(function OtpStep(
  {
    otp,
    phone,
    isLoading,
    isValidOtp,
    resendSeconds,
    onOtpChange,
    onVerify,
    onResend,
    onChangePhone,
  },
  ref,
) {
  const focusOtpInput = () => {
    if (
      typeof ref !== 'function' &&
      ref?.current
    ) {
      ref.current.focus();
    }
  };

  return (
    <>
      <View className="items-center">
        <Text className="mt-5 text-center text-[22px] font-black text-[#0F172A]">
          Verify OTP
        </Text>

        <Text className="mt-2 text-center text-sm leading-5 text-slate-500">
          We sent a 6-digit code to +91{' '}
          {formatPhoneNumber(
            phone,
          )}
        </Text>

        <Pressable
          onPress={
            onChangePhone
          }
          className="mt-2"
        >
          <Text className="text-xs font-bold text-[#F44336]">
            Change number
          </Text>
        </Pressable>
      </View>

      <Pressable
        onPress={
          focusOtpInput
        }
        className="mt-7 flex-row justify-center gap-2"
      >
        {Array.from({
          length: 6,
        }).map(
          (_, index) => {
            const digit =
              otp[index] ?? '';

            const isActive =
              index ===
                otp.length &&
              otp.length < 6;

            return (
              <View
                key={index}
                className={`h-14 w-11 items-center justify-center rounded-xl border bg-[#F8FAFC] md:w-12 ${
                  isActive
                    ? 'border-[#F44336]'
                    : 'border-slate-200'
                }`}
              >
                <Text className="text-xl font-black text-[#0F172A]">
                  {digit}
                </Text>
              </View>
            );
          },
        )}
      </Pressable>

      <View className="items-center">
        <TextInput
          ref={ref}
          value={otp}
          onChangeText={(value) => {
            onOtpChange(
              getDigits(value).slice(0, 6),
            );
          }}
          keyboardType="number-pad"
          maxLength={6}
          autoFocus
          caretHidden
          showSoftInputOnFocus
          style={{
            position: 'absolute',
            alignSelf: 'center',
            width: 2,
            height: 2,
            opacity: 0.01,
            top: 0,
            left: '50%',
            transform: [
              {
                translateX: -1,
              },
            ],
          }}
        />
      </View>

      <Pressable
        onPress={onVerify}
        disabled={
          !isValidOtp ||
          isLoading
        }
        className={`mt-6 h-14 flex-row items-center justify-center rounded-xl bg-[#F44336] active:opacity-80 ${
          !isValidOtp ||
          isLoading
            ? 'opacity-50'
            : ''
        }`}
      >
        {isLoading ? (
          <ActivityIndicator
            color="#FFFFFF"
          />
        ) : (
          <>
            <Text className="text-sm font-black text-white">
              Verify
            </Text>

            <Ionicons
              name="arrow-forward"
              size={18}
              color="#FFFFFF"
              style={{
                marginLeft: 8,
              }}
            />
          </>
        )}
      </Pressable>

      <View className="mt-5 items-center">
        <Pressable
          onPress={onResend}
          disabled={
            resendSeconds > 0 ||
            isLoading
          }
        >
          <Text
            className={`text-sm font-bold ${
              resendSeconds > 0
                ? 'text-slate-400'
                : 'text-[#F44336]'
            }`}
          >
            Resend OTP
          </Text>
        </Pressable>

        {resendSeconds > 0 ? (
          <Text className="mt-1.5 text-xs text-slate-400">
            in{' '}
            {formatTimer(
              resendSeconds,
            )}
          </Text>
        ) : (
          <Text className="mt-1.5 text-xs text-slate-400">
            You can request a new OTP
          </Text>
        )}
      </View>

      <View className="mt-5 rounded-xl bg-red-50 p-3">
        <Text className="text-center text-xs font-bold text-red-600">
          Testing OTP: 123456
        </Text>
      </View>
    </>
  );
});