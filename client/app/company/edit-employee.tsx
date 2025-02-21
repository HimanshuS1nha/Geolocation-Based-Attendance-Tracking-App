import { View, ScrollView, Alert } from "react-native";
import React, { useState, useCallback } from "react";
import tw from "twrnc";
import { useLocalSearchParams } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ZodError } from "zod";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

import ImagePicker from "@/components/ImagePicker";
import Input from "@/components/Input";
import Button from "@/components/Button";

import { editEmployeeValidator } from "@/validators/edit-employee-validator";

import type { EmployeeType } from "@/types";

const EditEmployee = () => {
  const { email, id, image, name, designation } =
    useLocalSearchParams() as EmployeeType;

  const [newName, setNewName] = useState(name);
  const [newEmail, setNewEmail] = useState(email);
  const [fileName, setFileName] = useState("");
  const [fileBase64, setFileBase64] = useState("");
  const [newDesignation, setNewDesignation] = useState(designation ?? "");

  const handleChangeText = useCallback(
    (type: "name" | "email" | "designation", value: string) => {
      if (type === "name") {
        setNewName(value);
      } else if (type === "email") {
        setNewEmail(value);
      } else if (type === "designation") {
        setNewDesignation(value);
      }
    },
    []
  );

  const { mutate: handleEditEmployee, isPending } = useMutation({
    mutationKey: ["edit-employee"],
    mutationFn: async () => {
      const token = SecureStore.getItem("token");
      if (!token) {
        throw new Error("Please login first");
      }

      const parsedData = await editEmployeeValidator.parseAsync({
        name: newName,
        fileName,
        fileBase64,
        email: newEmail,
        designation: newDesignation,
      });

      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/api/edit-employee/${id}`,
        { ...parsedData },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return data as { message: string };
    },
    onSuccess: async (data) => {
      //! Invalidate get employees call
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
          setFileBase64={setFileBase64}
          setFileName={setFileName}
          type="edit-employee"
          image={image}
        />

        <Input
          placeholder="Enter employee's name"
          value={newName}
          onChangeText={(text) => handleChangeText("name", text)}
        />
        <Input
          placeholder="Enter employee's email"
          value={newEmail}
          onChangeText={(text) => handleChangeText("email", text)}
        />
        <Input
          placeholder="Enter employee's designation"
          value={newDesignation}
          onChangeText={(text) => handleChangeText("designation", text)}
        />

        <Button onPress={handleEditEmployee} disabled={isPending}>
          Edit Employee
        </Button>
      </ScrollView>
    </View>
  );
};

export default EditEmployee;
