import { View, Text, Alert } from "react-native";
import React, { useState, useCallback } from "react";
import tw from "twrnc";
import { router, useLocalSearchParams } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ZodError } from "zod";

import Input from "@/components/Input";
import Button from "@/components/Button";

import { emailValidator } from "@/validators/email-validator";

const ForgotPassword = () => {
  const { type } = useLocalSearchParams() as { type: "company" | "employee" };

  const [email, setEmail] = useState("");

  const handleChangeEmail = useCallback((value: string) => setEmail(value), []);

  const { mutate: handleForgotPassword, isPending } = useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: async () => {
      const parsedData = await emailValidator.parseAsync({ email });

      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/api/forgot-password/${type}`,
        { ...parsedData }
      );

      return data as { message: string };
    },
    onSuccess: (data) => {
      Alert.alert("Success", data.message, [
        {
          text: "Ok",
          onPress: () =>
            router.replace({
              pathname: "/auth/verify",
              params: { type, redirectTo: "create-new-password" },
            }),
        },
      ]);
    },
    onError: (error) => {
      if (error instanceof ZodError) {
        Alert.alert("Error", error.errors[0].message);
      } else if (error instanceof AxiosError && error.response?.data.error) {
        Alert.alert("Error", error.response.data.error);
      } else {
        Alert.alert("Error", error.message);
      }
    },
  });
  return (
    <View style={tw`flex-1 bg-white px-4 gap-y-9`}>
      <Text style={tw`text-3xl font-medium mt-4`}>
        Enter your email to continue!
      </Text>

      <Input
        placeholder="Enter your email"
        value={email}
        onChangeText={handleChangeEmail}
      />

      <Button onPress={handleForgotPassword} disabled={isPending}>
        Continue
      </Button>
    </View>
  );
};

export default ForgotPassword;
