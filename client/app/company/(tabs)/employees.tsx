import { View, Pressable, Alert } from "react-native";
import React from "react";
import tw from "twrnc";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import * as SecureStore from "expo-secure-store";

import EmployeeCard from "@/components/EmployeeCard";

import type { EmployeeType } from "@/types";

const Employees = () => {
  const dummyEmployees: EmployeeType[] = [
    {
      name: "Random Employee",
      email: "random@employee.com",
      id: "1",
      image:
        "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
      designation: "Full Stack Developer",
    },
    {
      name: "Random Employee 2",
      email: "random@employee.com",
      id: "2",
      image:
        "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
      designation: "Product Manager",
    },
  ];

  const { mutate: handleDelete } = useMutation({
    mutationKey: ["delete-employee"],
    mutationFn: async (employeeId: string) => {
      const token = SecureStore.getItem("token");
      if (!token) {
        throw new Error("Please login first");
      }

      const { data } = await axios.delete(
        `${process.env.EXPO_PUBLIC_API_URL}/api/delete-employee/${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data as { message: string };
    },
    onSuccess: async (data) => {
      //! Invalidate get employess call
      Alert.alert("Success", data.message);
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.data.error) {
        Alert.alert("Error", error.response.data.error);
      } else {
        Alert.alert("Error", error.message);
      }
    },
  });
  return (
    <View style={tw`flex-1`}>
      <FlashList
        data={dummyEmployees}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return (
            <EmployeeCard
              employee={item}
              handleDelete={() => handleDelete(item.id)}
            />
          );
        }}
        contentContainerStyle={tw`px-4 pt-4`}
        estimatedItemSize={50}
        numColumns={2}
        showsVerticalScrollIndicator={false}
      />

      <Pressable
        style={tw`absolute bg-emerald-600 bottom-2 right-2 p-2 rounded-lg z-10 shadow shadow-black`}
        onPress={() => router.push("/company/add-employee")}
      >
        <AntDesign name="plus" size={30} color="white" />
      </Pressable>
    </View>
  );
};

export default Employees;
