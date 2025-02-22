import { View, Text, ScrollView, Alert } from "react-native";
import React, { useState, useCallback } from "react";
import tw from "twrnc";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ZodError } from "zod";
import { router } from "expo-router";

import ImagePicker from "@/components/ImagePicker";
import Input from "@/components/Input";
import Button from "@/components/Button";
import OAuthProviders from "@/components/OAuthProviders";

import { signupValidator } from "@/validators/signup-validator";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileBase64, setFileBase64] = useState("");

  const handleChangeText = useCallback(
    (
      type: "name" | "email" | "password" | "confirmPassword",
      value: string
    ) => {
      if (type === "name") {
        setName(value);
      } else if (type === "email") {
        setEmail(value);
      } else if (type === "password") {
        setPassword(value);
      } else if (type === "confirmPassword") {
        setConfirmPassword(value);
      }
    },
    []
  );

  const { mutate: handleSignup, isPending } = useMutation({
    mutationKey: ["signup"],
    mutationFn: async () => {
      const parsedData = await signupValidator.parseAsync({
        name,
        email,
        password,
        confirmPassword,
        fileName,
        fileBase64,
      });
      if (parsedData.password !== parsedData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/api/signup`,
        { ...parsedData }
      );

      return data as { message: string };
    },
    onSuccess: (data) => {
      Alert.alert("Success", data.message, [
        {
          text: "Ok",
          onPress: () =>
            router.push({
              pathname: "/auth/verify",
              params: {
                email,
                type: "company",
                redirectTo: "login",
              },
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
    <View style={tw`flex-1 bg-white`}>
      <ScrollView contentContainerStyle={tw`pb-4 px-4 gap-y-9`}>
        <Text style={tw`text-3xl font-medium mt-4`}>
          Hello! Register to get started
        </Text>

        <View style={tw`gap-y-3.5 items-center`}>
          <ImagePicker
            base64={fileBase64}
            setFileBase64={setFileBase64}
            setFileName={setFileName}
          />

          <Input
            placeholder="Enter company's name"
            value={name}
            onChangeText={(text) => handleChangeText("name", text)}
          />
          <Input
            placeholder="Enter company's email"
            value={email}
            onChangeText={(text) => handleChangeText("email", text)}
          />
          <Input
            placeholder="Enter company's password"
            secureTextEntry
            value={password}
            onChangeText={(text) => handleChangeText("password", text)}
          />
          <Input
            placeholder="Confirm company's password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={(text) => handleChangeText("confirmPassword", text)}
          />
        </View>

        <Button onPress={handleSignup} disabled={isPending}>
          Signup
        </Button>

        <OAuthProviders text="Or Register with" />
      </ScrollView>
    </View>
  );
};

export default Signup;
