import { View, Text, ScrollView, Alert } from "react-native";
import React, { useState, useCallback } from "react";
import tw from "twrnc";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ZodError } from "zod";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

import ImagePicker from "@/components/ImagePicker";
import Input from "@/components/Input";
import Button from "@/components/Button";

import { useUser } from "@/hooks/useUser";

import { editEmployeeProfileValidator } from "@/validators/edit-profile-validator";

import type { UserType } from "@/types";

const EditEmployeeProfile = () => {
  const user = useUser((state) => state.user);
  const setUser = useUser((state) => state.setUser);
  
  const [name, setName] = useState(user?.name ?? "");
  const [designation, setDesignation] = useState(user?.designation ?? "");
  const [fileName, setFileName] = useState("");
  const [fileBase64, setFileBase64] = useState("");

  const handleChangeText = useCallback(
    (type: "name" | "designation", value: string) => {
      if (type === "name") {
        setName(value);
      } else if (type === "designation") {
        setDesignation(value);
      }
    },
    []
  );

  const { mutate: handleEditProfile, isPending } = useMutation({
    mutationKey: ["edit-profile"],
    mutationFn: async () => {
      const token = SecureStore.getItem("token");
      if (!token) {
        throw new Error("Please login first");
      }

      const parsedData = await editEmployeeProfileValidator.parseAsync({
        name,
        fileName,
        fileBase64,
        designation,
      });

      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/api/edit-profile/employee`,
        { ...parsedData },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return data as { message: string; user: UserType };
    },
    onSuccess: async (data) => {
      setUser(data.user);

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
        <ImagePicker
          base64={fileBase64}
          setFileName={setFileName}
          setFileBase64={setFileBase64}
        />

        <Input
          placeholder="Enter employee's name"
          value={name}
          onChangeText={(text) => handleChangeText("name", text)}
        />

        <Input
          placeholder="Enter employee's designation"
          value={designation}
          onChangeText={(text) => handleChangeText("designation", text)}
        />

        <Button onPress={handleEditProfile} disabled={isPending}>
          Edit Profile
        </Button>
      </ScrollView>
    </View>
  );
};

export default EditEmployeeProfile;
