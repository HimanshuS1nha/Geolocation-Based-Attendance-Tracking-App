import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import tw from "twrnc";
import { Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

import ProfileCard from "@/components/ProfileCard";
import Button from "@/components/Button";
import AttendanceRecordCard from "@/components/AttendanceRecordCard";

import { socket } from "@/libs/socket";

import type { AttendanceRecordType } from "@/types";

const LOCATION_TASK_NAME = "background-location-task";

TaskManager.defineTask(
  LOCATION_TASK_NAME,
  // @ts-ignore
  ({
    data,
    error,
  }: {
    data?: { locations: { latitude: number; longitude: number }[] };
    error?: any;
  }) => {
    if (error) {
      Alert.alert("Error", "Some error occured. Please try again later!");
      return;
    }
    if (data) {
      const { locations } = data;
      if (!socket.connected) {
        const token = SecureStore.getItem("token");
        socket.auth = { token };
        socket.connect();
      }

      locations.forEach((location) => {
        socket.emit("send-location", {
          latitude: location.latitude,
          longitude: location.longitude,
        });
      });
    }
  }
);

const EmployeeHome = () => {
  const [isTrackingAttendance, setIsTrackingAttendance] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["get-attendance-history-for-homepage"],
    queryFn: async () => {
      const token = SecureStore.getItem("token");
      if (!token) {
        throw new Error("Please login first");
      }

      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/api/get-attendance-history/employee`,
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

  const handleStartAttendanceTracking = useCallback(async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      socket.auth = { token };
      socket.connect();

      const foregroundLocationPermission =
        await Location.getForegroundPermissionsAsync();
      if (!foregroundLocationPermission.granted) {
        return Alert.alert(
          "Error",
          "Location permission is required for this feature to work."
        );
      }

      const backgroundLocationPermission =
        await Location.getBackgroundPermissionsAsync();
      if (!backgroundLocationPermission.granted) {
        return Alert.alert(
          "Error",
          "Location permission is required for this feature to work."
        );
      }

      Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Highest,
        distanceInterval: 1,
        timeInterval: 5000,
        foregroundService: {
          notificationTitle: "Background location tracking",
          notificationBody: "We are tracking your location in the background.",
        },
      });

      setIsTrackingAttendance(true);
    } catch {
      Alert.alert("Error", "Some error occured. Please try again later!");
    }
  }, []);

  const handleStopAttendanceTracking = useCallback(() => {
    socket.disconnect();

    Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  }, []);

  const handleSocketError = useCallback(({ error }: { error: string }) => {
    Alert.alert("Error", error);
  }, []);

  useEffect(() => {
    Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME).then((res) =>
      setIsTrackingAttendance(res)
    );
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
      <ScrollView contentContainerStyle={tw`py-4 px-4 gap-y-7`}>
        <ProfileCard />

        <View style={tw`gap-y-4`}>
          <View style={tw`flex-row justify-between items-center`}>
            <Text style={tw`font-medium text-base`}>Attendance History</Text>
            <Pressable
              style={tw`flex-row gap-x-1`}
              onPress={() => router.push("/employee/attendance-history")}
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

      <View style={tw`flex-row gap-x-4 justify-center pb-4`}>
        <Button
          variant="outline"
          style={tw`w-[45%]`}
          textSize="sm"
          onPress={() => router.push("/employee/scan-qr")}
        >
          Scan QR Code
        </Button>
        <Button
          style={tw`w-[45%] ${
            isTrackingAttendance ? "bg-rose-600" : "bg-indigo-600"
          }`}
          textSize="sm"
          onPress={
            isTrackingAttendance
              ? handleStopAttendanceTracking
              : handleStartAttendanceTracking
          }
        >
          {isTrackingAttendance
            ? "Stop Attendance Tracking"
            : "Start Attendance Tracking"}
        </Button>
      </View>
    </View>
  );
};

export default EmployeeHome;
