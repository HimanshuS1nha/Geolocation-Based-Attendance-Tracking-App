import { View, Text, Pressable } from "react-native";
import React, { useMemo } from "react";
import tw from "twrnc";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { router } from "expo-router";

import { useUser } from "@/hooks/useUser";

import type { AttendanceRecordType } from "@/types";

const AttendanceRecordCard = ({
  attendanceRecord,
  type = "employee",
}: {
  attendanceRecord: AttendanceRecordType;
  type?: "employee" | "company";
}) => {
  const user = useUser((state) => state.user);

  const days = useMemo(
    () => [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    []
  );
  return (
    <Pressable
      style={tw`bg-white p-3 rounded-lg shadow shadow-black flex-row justify-between items-center mb-4`}
      onPress={() =>
        user?.type === "company" &&
        router.push({
          pathname: "/company/date-wise-attendance-history",
          params: {
            date: attendanceRecord.date,
          },
        })
      }
    >
      <View>
        <Text style={tw`text-base font-semibold`}>{attendanceRecord.date}</Text>
        <Text style={tw`text-gray-700 text-xs`}>
          {days[attendanceRecord.day]}
        </Text>
      </View>

      <View style={tw`items-end`}>
        {type === "company" ? (
          <Text style={tw`text-emerald-600 font-medium`}>
            Present: {attendanceRecord.present} of {attendanceRecord.total}
          </Text>
        ) : (
          <View style={tw`flex-row gap-x-2 items-center`}>
            <Text
              style={tw`${
                attendanceRecord.isPresent
                  ? "text-emerald-600"
                  : "text-rose-600"
              } font-semibold`}
            >
              {attendanceRecord.isPresent ? "Present" : "Absent"}
            </Text>

            {attendanceRecord.isPresent ? (
              <AntDesign name="checkcircle" size={18} color="#059669" />
            ) : (
              <Entypo name="circle-with-cross" size={18} color="#E11D48" />
            )}
          </View>
        )}
        {attendanceRecord.timeSpent && (
          <Text style={tw`text-xs font-semibold`}>
            Time Spent: {attendanceRecord.timeSpent} hrs
          </Text>
        )}
      </View>
    </Pressable>
  );
};

export default AttendanceRecordCard;
