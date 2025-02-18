import { View, ScrollView, Alert } from "react-native";
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

import { editCompanyProfileValidator } from "@/validators/edit-profile-validator";

const EditCompanyProfile = () => {
  const user = useUser((state) => state.user);

  const [name, setName] = useState(user?.name ?? "");
  const [fileName, setFileName] = useState("");
  const [fileBase64, setFileBase64] = useState("");

  const handleChangeName = useCallback((value: string) => setName(value), []);

  const { mutate: handleEditProfile, isPending } = useMutation({
    mutationKey: ["edit-profile"],
    mutationFn: async () => {
      const token = SecureStore.getItem("token");
      if (!token) {
        throw new Error("Please login first");
      }

      const parsedData = await editCompanyProfileValidator.parseAsync({
        name,
        fileName,
        fileBase64,
      });

      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/api/edit-profile/company`,
        { ...parsedData },
        {
          headers: { Authorization: `Bearer ${token}` },
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
        <ImagePicker
          base64={fileBase64}
          setFileName={setFileName}
          setFileBase64={setFileBase64}
        />

        <Input
          placeholder="Enter company name"
          value={name}
          onChangeText={handleChangeName}
        />

        <Button onPress={handleEditProfile} disabled={isPending}>
          Edit Profile
        </Button>
      </ScrollView>
    </View>
  );
};

export default EditCompanyProfile;
