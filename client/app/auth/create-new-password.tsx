import { View, Text, Alert } from "react-native";
import React, { useState, useCallback } from "react";
import tw from "twrnc";
import { useLocalSearchParams } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ZodError } from "zod";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

import Input from "@/components/Input";
import Button from "@/components/Button";

import { createNewPasswordValidator } from "@/validators/create-new-password-validator";

const CreateNewPassword = () => {
  const { type } = useLocalSearchParams() as { type: "company" | "employee" };

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangeText = useCallback(
    (type: "newPassword" | "confirmPassword", value: string) => {
      if (type === "newPassword") {
        setNewPassword(value);
      } else if (type === "confirmPassword") {
        setConfirmPassword(value);
      }
    },
    []
  );

  const { mutate: handleCreateNewPassword, isPending } = useMutation({
    mutationKey: ["create-new-password"],
    mutationFn: async () => {
      const token = SecureStore.getItem("password-change-token");
      if (!token) {
        throw new Error("Invalid attempt to change password");
      }

      const parsedData = await createNewPasswordValidator.parseAsync({
        newPassword,
        confirmPassword,
      });
      if (parsedData.confirmPassword !== parsedData.newPassword) {
        throw new Error("Passwords do not match");
      }

      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/api/create-new-password/${type}`,
        { parsedData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data as { message: string };
    },
    onSuccess: async (data) => {
      await SecureStore.deleteItemAsync("password-change-token");
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
        Alert.alert("Error", error.message);
      }
    },
  });
  return (
    <View style={tw`flex-1 bg-white px-4 gap-y-9`}>
      <Text style={tw`text-3xl font-medium mt-4`}>
        Create your new password here!
      </Text>

      <View style={tw`gap-y-3.5`}>
        <Input
          placeholder="Enter new password"
          value={newPassword}
          onChangeText={(text) => handleChangeText("newPassword", text)}
        />
        <Input
          placeholder="Confirm new password"
          value={confirmPassword}
          onChangeText={(text) => handleChangeText("confirmPassword", text)}
        />
      </View>

      <Button onPress={handleCreateNewPassword} disabled={isPending}>
        Create
      </Button>
    </View>
  );
};

export default CreateNewPassword;
