import { View, Text, ScrollView, Alert, ActivityIndicator } from "react-native";
import React from "react";
import tw from "twrnc";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import * as SecureStore from "expo-secure-store";

import EmployeeCard from "@/components/EmployeeCard";

const DateWiseAttendanceHistory = () => {
  const { date } = useLocalSearchParams() as { date: string };

  const { data, isLoading, error } = useQuery({
    queryKey: ["get-date-wise-attendance-history"],
    queryFn: async () => {
      const token = SecureStore.getItem("token");
      if (!token) {
        throw new Error("Please login first");
      }

      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/api/get-attendance-history/company`,
        { date },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data as {
        attendanceRecord: {
          numberOfEmployees: number;
          presentEmployees: {
            id: string;
            name: string;
            image: string;
            designation: string;
            email: string;
          }[];
          absentEmployees: {
            id: string;
            name: string;
            image: string;
            designation: string;
            email: string;
          }[];
        };
      };
    },
  });
  if (error) {
    if (error instanceof AxiosError && error.response?.data.error) {
      Alert.alert("Error", error.response.data.error);
    } else {
      Alert.alert("Error", error.message);
    }
  }
  return (
    <View style={tw`flex-1`}>
      {isLoading ? (
        <ActivityIndicator size={40} />
      ) : data && data.attendanceRecord ? (
        <ScrollView contentContainerStyle={tw`px-4 py-4 gap-y-7`}>
          <View style={tw`bg-white p-4 shadow shadow-black rounded-lg gap-y-5`}>
            <Text style={tw`text-base font-semibold text-center`}>Summary</Text>
            <View style={tw`flex-row justify-between items-center`}>
              <Text>Total</Text>
              <Text>{data.attendanceRecord.numberOfEmployees}</Text>
            </View>

            <View style={tw`gap-y-2`}>
              <View style={tw`flex-row justify-between items-center`}>
                <Text style={tw`text-emerald-600 font-medium`}>Present</Text>
                <Text style={tw`text-rose-600 font-medium`}>Absent</Text>
              </View>
              <View style={tw`flex-row justify-between items-center`}>
                <View style={tw`h-1 bg-emerald-600 w-[80%]`} />
                <View style={tw`h-1 bg-rose-600 w-[20%]`} />
              </View>
              <View style={tw`flex-row justify-between items-center`}>
                <Text style={tw`text-emerald-600 font-medium`}>
                  {data.attendanceRecord.presentEmployees.length}
                </Text>
                <Text style={tw`text-rose-600 font-medium`}>
                  {data.attendanceRecord.absentEmployees.length}
                </Text>
              </View>
            </View>
          </View>

          <View style={tw`gap-y-4`}>
            <Text
              style={tw`text-lg text-center font-semibold text-emerald-600`}
            >
              Present Employees
            </Text>

            <View style={tw`flex-row justify-center items-center gap-4`}>
              {data.attendanceRecord.presentEmployees.map((employee, i) => {
                return (
                  <EmployeeCard
                    employee={employee}
                    key={i}
                    showOptions={false}
                  />
                );
              })}
            </View>
          </View>

          <View style={tw`gap-y-4`}>
            <Text style={tw`text-lg text-center font-semibold text-rose-600`}>
              Absent Employees
            </Text>

            <View style={tw`flex-row justify-center items-center gap-4`}>
              {data.attendanceRecord.absentEmployees.map((employee, i) => {
                return <EmployeeCard employee={employee} key={i} />;
              })}
            </View>
          </View>
        </ScrollView>
      ) : (
        <Text
          style={tw`text-rose-600 text-base text-center font-semibold mt-4`}
        >
          No data to show
        </Text>
      )}
    </View>
  );
};

export default DateWiseAttendanceHistory;
