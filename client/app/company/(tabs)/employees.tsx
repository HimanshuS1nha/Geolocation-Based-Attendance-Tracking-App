import { View, Pressable, Alert, ActivityIndicator, Text } from "react-native";
import React, { useEffect } from "react";
import tw from "twrnc";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import * as SecureStore from "expo-secure-store";

import EmployeeCard from "@/components/EmployeeCard";

import { useEmployees } from "@/hooks/useEmployees";

import type { EmployeeType } from "@/types";

const Employees = () => {
  const { employees, setEmployees } = useEmployees();

  const { data, isLoading, error } = useQuery({
    queryKey: [`get-employee-${employees.length}`],
    queryFn: async () => {
      const token = SecureStore.getItem("token");
      if (!token) {
        throw new Error("Please login first");
      }

      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/api/get-employees`,
        { skip: employees.length },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data as { employees: EmployeeType[] };
    },
  });
  if (error) {
    if (error instanceof AxiosError && error.response?.data.error) {
      Alert.alert("Error", error.response.data.error);
    } else {
      Alert.alert("Error", error.message);
    }
  }

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

      return { ...data, employeeId } as { message: string; employeeId: string };
    },
    onSuccess: async (data) => {
      setEmployees(
        employees.filter((employee) => employee.id !== data.employeeId)
      );
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

  useEffect(() => {
    if (data) {
      setEmployees(data.employees);
    }
  }, [data]);
  return (
    <View style={tw`flex-1`}>
      {isLoading ? (
        <ActivityIndicator size={45} color={"#4F46E5"} />
      ) : employees.length > 0 ? (
        <FlashList
          data={employees}
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
      ) : (
        <Text style={tw`text-rose-600 font-semibold text-base`}>
          No data to show
        </Text>
      )}

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
