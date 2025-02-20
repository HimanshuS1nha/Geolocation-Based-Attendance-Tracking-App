import { View, Text, ScrollView, Alert } from "react-native";
import React, { useState, useCallback } from "react";
import tw from "twrnc";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { ZodError } from "zod";

import Input from "@/components/Input";
import Button from "@/components/Button";

import { changePasswordValidator } from "@/validators/change-password-validator";

const ChangeEmployeePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangeText = useCallback(
    (
      type: "oldPassword" | "newPassword" | "confirmPassword",
      value: string
    ) => {
      if (type === "oldPassword") {
        setOldPassword(value);
      } else if (type === "newPassword") {
        setNewPassword(value);
      } else if (type === "confirmPassword") {
        setConfirmPassword(value);
      }
    },
    []
  );

  const { mutate: handleChangePassword, isPending } = useMutation({
    mutationKey: ["change-password"],
    mutationFn: async () => {
      const token = SecureStore.getItem("token");
      if (!token) {
        throw new Error("Please login first");
      }

      const parsedData = await changePasswordValidator.parseAsync({
        oldPassword,
        newPassword,
        confirmPassword,
      });
      if (parsedData.newPassword !== parsedData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/api/change-password/employee`,
        { ...parsedData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data as { message: string };
    },
    onSuccess: (data) => {
      Alert.alert("Success", data.message, [
        {
          text: "Ok",
          onPress: router.back,
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
      <ScrollView contentContainerStyle={tw`pt-6 px-4 gap-y-6 items-center`}>
        <Input
          placeholder="Enter old password"
          secureTextEntry
          value={oldPassword}
          onChangeText={(text) => handleChangeText("oldPassword", text)}
        />
        <Input
          placeholder="Enter new password"
          secureTextEntry
          value={newPassword}
          onChangeText={(text) => handleChangeText("newPassword", text)}
        />
        <Input
          placeholder="Confirm new password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={(text) => handleChangeText("confirmPassword", text)}
        />

        <Button onPress={handleChangePassword} disabled={isPending}>
          Change Password
        </Button>
      </ScrollView>
    </View>
  );
};

export default ChangeEmployeePassword;
