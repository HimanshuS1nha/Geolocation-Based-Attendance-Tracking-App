import { View, Text, Pressable, Alert } from "react-native";
import React, { useState, useCallback } from "react";
import tw from "twrnc";
import { useLocalSearchParams } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ZodError } from "zod";
import { router } from "expo-router";

import Input from "@/components/Input";
import Button from "@/components/Button";

import { emailValidator } from "@/validators/email-validator";
import { verifyOtpValidator } from "@/validators/verify-otp-validator";

const Verify = () => {
  const { email, type } = useLocalSearchParams() as {
    email: string;
    type: "company" | "employee";
  };

  const [otp, setOtp] = useState("");

  const handleChangeText = useCallback((value: string) => setOtp(value), []);

  const { mutate: handleResendOtp, isPending: resendOtpPending } = useMutation({
    mutationKey: ["resend-otp"],
    mutationFn: async () => {
      const parsedData = await emailValidator.parseAsync({ email });

      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/api/resend-otp/${type}`,
        { ...parsedData }
      );

      return data as { message: string };
    },
    onSuccess: (data) => {
      Alert.alert("Success", data.message);
    },
    onError: (error) => {
      if (error instanceof ZodError) {
        Alert.alert("Error", error.errors[0].message);
      } else if (error instanceof AxiosError && error.response?.data.error) {
        Alert.alert("Error", error.response.data.error);
      } else {
        Alert.alert("Error", "Some error occured. Please try again later!");
      }
    },
  });

  const { mutate: handleVerifyOtp, isPending: verifyOtpPending } = useMutation({
    mutationKey: ["verify-otp"],
    mutationFn: async () => {
      const parsedData = await verifyOtpValidator.parseAsync({ email, otp });

      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/api/verify-otp/${type}`,
        { ...parsedData }
      );

      return data as { message: string };
    },
    onSuccess: (data) => {
      Alert.alert("Success", data.message, [
        {
          text: "Ok",
          onPress: () => {
            router.dismissAll();
            router.push({ pathname: "/auth/login", params: { type } });
          },
        },
      ]);
    },
    onError: (error) => {
      if (error instanceof ZodError) {
        Alert.alert("Error", error.errors[0].message);
      } else if (error instanceof AxiosError && error.response?.data.error) {
        Alert.alert("Error", error.response.data.error);
      } else {
        Alert.alert("Error", "Some error occured. Please try again later!");
      }
    },
  });
  return (
    <View style={tw`flex-1 bg-white px-4 gap-y-7`}>
      <Text style={tw`text-3xl font-medium mt-4`}>
        Verify your email to continue!
      </Text>

      <View style={tw`gap-y-2.5`}>
        <Input
          placeholder="Enter otp"
          value={otp}
          onChangeText={handleChangeText}
          maxLength={6}
          keyboardType="number-pad"
        />

        <View style={tw`items-end`}>
          <Pressable
            onPress={() => handleResendOtp()}
            disabled={resendOtpPending || verifyOtpPending}
          >
            <Text
              style={tw`font-medium ${
                resendOtpPending ? "text-indigo-400" : "text-indigo-600"
              }`}
            >
              {resendOtpPending ? "Please wait..." : "Resend OTP"}
            </Text>
          </Pressable>
        </View>
      </View>

      <Button
        onPress={handleVerifyOtp}
        disabled={resendOtpPending || verifyOtpPending}
      >
        Verify
      </Button>
    </View>
  );
};

export default Verify;
