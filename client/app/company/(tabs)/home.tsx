import { View, Alert } from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import tw from "twrnc";
import * as SecureStore from "expo-secure-store";

import ProfileCard from "@/components/ProfileCard";
import Button from "@/components/Button";

import { useUser } from "@/hooks/useUser";
import { useOfficeLocationModal } from "@/hooks/useOfficeLocationModal";

import { socket } from "@/libs/socket";

const CompanyHome = () => {
  const user = useUser((state) => state.user);
  const setIsOfficeLocationModalVisible = useOfficeLocationModal(
    (state) => state.setIsVisible
  );

  const [isTakingAttendance, setIsTakingAttendance] = useState(
    socket.connected
  );

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
      <View style={tw`flex-1 pt-4 pb-8 px-4 gap-y-7`}>
        <ProfileCard />
      </View>

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
