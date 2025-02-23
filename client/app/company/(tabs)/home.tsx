import {
  View,
  Text,
  Alert,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import tw from "twrnc";
import * as SecureStore from "expo-secure-store";
import { Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

import ProfileCard from "@/components/ProfileCard";
import AttendanceRecordCard from "@/components/AttendanceRecordCard";
import Button from "@/components/Button";

import { useUser } from "@/hooks/useUser";
import { useOfficeLocationModal } from "@/hooks/useOfficeLocationModal";

import { socket } from "@/libs/socket";

import type { AttendanceRecordType } from "@/types";

const CompanyHome = () => {
  const user = useUser((state) => state.user);
  const setIsOfficeLocationModalVisible = useOfficeLocationModal(
    (state) => state.setIsVisible
  );

  const [isTakingAttendance, setIsTakingAttendance] = useState(
    socket.connected
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ["get-attendance-history-for-homepage"],
    queryFn: async () => {
      const token = SecureStore.getItem("token");
      if (!token) {
        throw new Error("Please login first");
      }

      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/api/get-attendance-history/company`,
        {
          take: 3,
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

  const handleStartTakingAttendance = useCallback(() => {
    try {
      if (!user?.hasAddedOfficeLocation) {
        return setIsOfficeLocationModalVisible(true);
      }

      const token = SecureStore.getItem("token");
      socket.auth = { token };

      socket.connect();
      setIsTakingAttendance(true);
    } catch {
      Alert.alert("Error", "Some error occured. Please try again later!");
    }
  }, [user]);

  const handleStopTakingAttendance = useCallback(() => {
    socket.disconnect();
    setIsTakingAttendance(false);
  }, []);

  const handleSocketError = useCallback(({ error }: { error: string }) => {
    Alert.alert("Error", error);
  }, []);

  useEffect(() => {
    if (socket.connected) {
      socket.on("error", handleSocketError);
    }

    return () => {
      socket.off("error", handleSocketError);
    };
  }, [socket.connected]);
  return (
    <View style={tw`flex-1`}>
      <ScrollView contentContainerStyle={tw`flex-1 pt-4 pb-8 px-4 gap-y-7`}>
        <ProfileCard />

        <View>
          <View style={tw`flex-row justify-between items-center mb-4`}>
            <Text style={tw`font-medium text-base`}>Attendance History</Text>
            <Pressable
              style={tw`flex-row gap-x-1`}
              onPress={() => router.push("/company/attendance-history")}
            >
              <Text style={tw`text-indigo-600 font-bold`}>View All</Text>
              <Entypo name="chevron-right" size={18} color="#4F46E5" />
            </Pressable>
          </View>

          {isLoading ? (
            <ActivityIndicator size={30} color={"#4F46E5"} />
          ) : data && data.attendanceRecords.length > 0 ? (
            data?.attendanceRecords.map((attendanceRecord, i) => {
              return (
                <AttendanceRecordCard
                  attendanceRecord={attendanceRecord}
                  key={i}
                  type="company"
                />
              );
            })
          ) : (
            <Text
              style={tw`text-rose-600 text-base text-center font-semibold mt-4`}
            >
              No data to show
            </Text>
          )}
        </View>
      </ScrollView>

      <View style={tw`pb-2 px-2 items-center`}>
        <Button
          style={tw`${isTakingAttendance ? "bg-rose-600" : "bg-indigo-600"}`}
          onPress={
            isTakingAttendance
              ? handleStopTakingAttendance
              : handleStartTakingAttendance
          }
        >
          {isTakingAttendance
            ? "Stop Taking Attendance"
            : "Start Taking Attendance"}
        </Button>
      </View>
    </View>
  );
};

export default CompanyHome;
