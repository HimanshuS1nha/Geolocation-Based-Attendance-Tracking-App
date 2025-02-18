import { View, ScrollView, Alert } from "react-native";
import React, { useState, useCallback } from "react";
import tw from "twrnc";
import { useMutation } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import axios, { AxiosError } from "axios";
import { ZodError } from "zod";
import { router } from "expo-router";

import ImagePicker from "@/components/ImagePicker";
import Input from "@/components/Input";
import Button from "@/components/Button";

import { addEmployeeValidator } from "@/validators/add-employee-validator";

const AddEmployee = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileBase64, setFileBase64] = useState("");
  const [designation, setDesignation] = useState("");

  const handleChangeText = useCallback(
    (
      type: "name" | "email" | "password" | "confirmPassword" | "designation",
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
      } else if (type === "designation") {
        setDesignation(value);
      }
    },
    []
  );

  const { mutate: handleAddEmployee, isPending } = useMutation({
    mutationKey: ["add-employee"],
    mutationFn: async () => {
      const token = SecureStore.getItem("token");
      if (!token) {
        throw new Error("Please login first");
      }

      const parsedData = await addEmployeeValidator.parseAsync({
        name,
        email,
        password,
        confirmPassword,
        fileName,
        fileBase64,
        designation,
      });
      if (parsedData.password !== parsedData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/api/add-employee`,
        { ...parsedData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data as { message: string };
    },
    onSuccess: async (data) => {
      //! Invalidate get employees query
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
          type="add-employee"
        />

        <Input
          placeholder="Enter employee's name"
          value={name}
          onChangeText={(text) => handleChangeText("name", text)}
        />
        <Input
          placeholder="Enter employee's email"
          value={email}
          onChangeText={(text) => handleChangeText("email", text)}
        />
        <Input
          placeholder="Enter employee's designation"
          value={designation}
          onChangeText={(text) => handleChangeText("designation", text)}
        />
        <Input
          placeholder="Enter employee's password"
          value={password}
          secureTextEntry
          onChangeText={(text) => handleChangeText("password", text)}
        />
        <Input
          placeholder="Confirm employee's password"
          value={confirmPassword}
          secureTextEntry
          onChangeText={(text) => handleChangeText("confirmPassword", text)}
        />

        <Button onPress={handleAddEmployee} disabled={isPending}>
          Add Employee
        </Button>
      </ScrollView>
    </View>
  );
};

export default AddEmployee;
