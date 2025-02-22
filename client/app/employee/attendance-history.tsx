import { View, Text, ScrollView } from "react-native";
import React from "react";
import tw from "twrnc";

import AttendanceRecordCard from "@/components/AttendanceRecordCard";

import type { AttendanceRecordType } from "@/types";

const AttendanceHistory = () => {
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
      <ScrollView contentContainerStyle={tw`py-4 px-4 gap-y-4`}>
        {dummyAttendanceRecords.map((attendanceRecord, i) => {
          return (
            <AttendanceRecordCard attendanceRecord={attendanceRecord} key={i} />
          );
        })}
      </ScrollView>
    </View>
  );
};

export default AttendanceHistory;
