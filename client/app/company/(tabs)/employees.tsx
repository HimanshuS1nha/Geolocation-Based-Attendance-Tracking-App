import {
  View,
  Pressable,
  Alert,
  ActivityIndicator,
  Text,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import tw from "twrnc";
import { AntDesign } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";

import EmployeeCard from "@/components/EmployeeCard";
import EmployeesFiltersModal from "@/components/EmployeesFiltersModal";

import { useUser } from "@/hooks/useUser";
import { useEmployees } from "@/hooks/useEmployees";

import type { EmployeeType } from "@/types";

const Employees = () => {
  const user = useUser((state) => state.user);
  const { employees, setEmployees } = useEmployees();

  const [isVisible, setIsVisible] = useState(false);
  const [designation, setDesignation] = useState("");

  const filteredEmployees = employees.filter((employee) =>
    designation.length > 0 ? employee.designation === designation : true
  );

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [`get-employee`],
    queryFn: async () => {
      const token = SecureStore.getItem("token");
      if (!token) {
        throw new Error("Please login first");
      }

      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/api/get-employees`,
        { skip: employees.length, designation },
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
    onSuccess: (data) => {
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
      setEmployees([...employees, ...data.employees]);
    }
  }, [data]);
  return (
    <View style={tw`flex-1`}>
      <Stack.Screen
        options={{
          headerRight: (props) => {
            return (
              <View style={tw`flex-row gap-x-4 items-center`} {...props}>
                <Pressable
                  onPress={() => {
                    if (employees.length > 0) {
                      setIsVisible(true);
                    } else {
                      Alert.alert(
                        "Error",
                        "Please add atleast one employee first"
                      );
                    }
                  }}
                >
                  <Ionicons name="options-outline" size={26} color="black" />
                </Pressable>
                <Pressable onPress={() => router.push("/company/profile")}>
                  <Image
                    source={{
                      uri: user?.image,
                    }}
                    style={tw`size-9 rounded-full mr-2`}
                  />
                </Pressable>
              </View>
            );
          },
        }}
      />

      <EmployeesFiltersModal
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        designation={designation}
        setDesignation={setDesignation}
      />

      {isLoading ? (
        <ActivityIndicator size={40} style={tw`mt-4`} color={"#4F46E5"} />
      ) : filteredEmployees.length > 0 ? (
        <FlashList
          data={filteredEmployees}
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
          onEndReached={refetch}
        />
      ) : (
        <Text
          style={tw`text-rose-600 text-center mt-4 font-semibold text-base`}
        >
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
