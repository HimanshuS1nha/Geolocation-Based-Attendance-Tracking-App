import { View, Text, ScrollView, Pressable } from "react-native";
import React from "react";
import tw from "twrnc";
import { Entypo } from "@expo/vector-icons";

import ProfileCard from "@/components/ProfileCard";
import Button from "@/components/Button";
import AttendanceRecordCard from "@/components/AttendanceRecordCard";

import type { AttendanceRecordType } from "@/types";

const EmployeeHome = () => {
  const dummyAttendanceRecords: AttendanceRecordType[] = [
    {
      date: "01-01-01",
      day: "Friday",
      isPresent: true,
    },
    {
      date: "02-02-01",
      day: "Saturday",
      isPresent: true,
    },
    {
      date: "03-03-01",
      day: "Saturday",
      isPresent: false,
    },
  ];
  return (
    <View style={tw`flex-1`}>
      <ScrollView contentContainerStyle={tw`py-4 px-4 gap-y-7`}>
        <ProfileCard />

        <View style={tw`gap-y-4`}>
          <View style={tw`flex-row justify-between items-center`}>
            <Text style={tw`font-medium text-base`}>Attendance History</Text>
            <Pressable style={tw`flex-row gap-x-1`}>
              <Text style={tw`text-indigo-600 font-bold`}>View All</Text>
              <Entypo name="chevron-right" size={18} color="#4F46E5" />
            </Pressable>
          </View>
          
          {dummyAttendanceRecords.map((attendanceRecord, i) => {
            return (
              <AttendanceRecordCard
                attendanceRecord={attendanceRecord}
                key={i}
              />
            );
          })}
        </View>
      </ScrollView>

      <View style={tw`flex-row gap-x-4 justify-center pb-4`}>
        <Button variant="outline" style={tw`w-[45%]`} textSize="sm">
          Scan QR Code
        </Button>
        <Button style={tw`w-[45%]`} textSize="sm">
          Start Attendance Tracking
        </Button>
      </View>
    </View>
  );
};

export default EmployeeHome;
