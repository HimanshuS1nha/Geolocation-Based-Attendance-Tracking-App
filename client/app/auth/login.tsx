import { View, Text, Pressable, Image, Alert } from "react-native";
import React, { useState, useCallback } from "react";
import tw from "twrnc";
import { useLocalSearchParams, router } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ZodError } from "zod";
import * as SecureStore from "expo-secure-store";

import Input from "@/components/Input";
import Button from "@/components/Button";
import OAuthProviders from "@/components/OAuthProviders";

import { useUser } from "@/hooks/useUser";

import { loginValidator } from "@/validators/login-validator";

import type { UserType } from "@/types";

const Login = () => {
  const { type } = useLocalSearchParams() as { type: "employee" | "company" };
  const setUser = useUser((state) => state.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleChangeText = useCallback(
    (type: "email" | "password", value: string) => {
      if (type === "email") {
        setEmail(value);
      } else if (type === "password") {
        setPassword(value);
      }
    },
    []
  );

  const { mutate: handleLogin, isPending } = useMutation({
    mutationKey: ["signup"],
    mutationFn: async () => {
      const parsedData = await loginValidator.parseAsync({
        email,
        password,
      });

      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/api/login/${type}`,
        { ...parsedData }
      );

      return data as { message: string; user: UserType; token: string };
    },
    onSuccess: (data) => {
      Alert.alert("Success", data.message, [
        {
          text: "Ok",
          onPress: async () => {
            await SecureStore.setItemAsync("token", data.token);
            setUser(data.user);
            router.dismissAll();
            if (data.user.type === "company") {
              router.replace("/company/home");
            } else if (data.user.type === "employee") {
              router.replace("/employee/home");
            }
          },
        },
      ]);
    },
    onError: (error) => {
      if (error instanceof ZodError) {
        Alert.alert("Error", error.errors[0].message);
      } else if (error instanceof AxiosError && error.response?.data.error) {
        Alert.alert("Error", error.response.data.error);
        if (error.response.status === 403) {
          router.push({
            pathname: "/auth/verify",
            params: {
              email,
              type,
            },
          });
        }
      } else {
        Alert.alert("Error", error.message);
      }
    },
  });
  return (
    <View style={tw`flex-1 bg-white px-4 gap-y-9`}>
      <Text style={tw`text-3xl font-medium mt-4`}>
        Welcome back! Glad to see you, Again!
      </Text>

      <View style={tw`gap-y-3.5`}>
        <Input
          placeholder="Enter your email"
          value={email}
          onChangeText={(text) => handleChangeText("email", text)}
        />
        <Input
          placeholder="Enter your password"
          value={password}
          onChangeText={(text) => handleChangeText("password", text)}
          secureTextEntry
        />
        <View style={tw`items-end`}>
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/auth/forgot-password",
                params: { type },
              })
            }
          >
            <Text style={tw`text-indigo-600 font-bold`}>Forgot Password?</Text>
          </Pressable>
        </View>
      </View>

      <Button onPress={handleLogin} disabled={isPending}>
        Login
      </Button>

      {type === "company" && (
        <>
          <OAuthProviders text="Or Login with" />
          <View style={tw`justify-center items-center flex-row gap-x-1`}>
            <Text>Don&apos;t have an account?</Text>
            <Pressable
              onPress={() => router.push({ pathname: "/auth/signup" })}
              disabled={isPending}
            >
              <Text
                style={tw`${
                  isPending ? "text-indigo-400" : "text-indigo-600"
                } text-base font-semibold`}
              >
                Signup
              </Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
};

export default Login;
