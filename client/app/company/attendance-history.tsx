import { View, Text, Alert, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import tw from "twrnc";
import { FlashList } from "@shopify/flash-list";
import * as SecureStore from "expo-secure-store";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

import AttendanceRecordCard from "@/components/AttendanceRecordCard";

import type { AttendanceRecordType } from "@/types";

const CompanyAttendanceHistory = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecordType[]
  >([]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["get-attendance-history"],
    queryFn: async () => {
      const token = SecureStore.getItem("token");
      if (!token) {
        throw new Error("Please login first");
      }

      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/api/get-attendance-history/company`,
        {
          skip: attendanceRecords.length,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data as { attendanceRecords: AttendanceRecordType[] };
    },
  });
  if (error) {
    if (error instanceof AxiosError && error.response?.data.error) {
      Alert.alert("Error", error.response.data.error);
    } else {
      Alert.alert("Error", error.message);
    }
  }

  useEffect(() => {
    if (data) {
      setAttendanceRecords((prev) => [...prev, ...data.attendanceRecords]);
    }
  }, [data]);
  return (
    <View style={tw`flex-1`}>
      {isLoading ? (
        <ActivityIndicator size={40} color={"#4F46E5"} style={tw`mt-4`} />
      ) : attendanceRecords.length > 0 ? (
        <FlashList
          data={attendanceRecords}
          keyExtractor={(item) => item.date}
          renderItem={({ item }) => {
            return (
              <AttendanceRecordCard attendanceRecord={item} type="company" />
            );
          }}
          contentContainerStyle={tw`p-4`}
          estimatedItemSize={50}
          onEndReached={refetch}
        />
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

export default CompanyAttendanceHistory;
