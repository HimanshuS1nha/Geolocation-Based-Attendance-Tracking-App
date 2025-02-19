import { View, Text, ScrollView, Pressable } from "react-native";
import React from "react";
import tw from "twrnc";
import { Entypo } from "@expo/vector-icons";

import ProfileCard from "@/components/ProfileCard";
import Button from "@/components/Button";

const EmployeeHome = () => {
  return (
    <View style={tw`flex-1`}>
      <ScrollView contentContainerStyle={tw`py-4 px-4 gap-y-7`}>
        <ProfileCard />

        <View style={tw`flex-row justify-between items-center`}>
          <Text style={tw`font-medium text-base`}>Attendance History</Text>
          <Pressable style={tw`flex-row gap-x-1`}>
            <Text style={tw`text-indigo-600 font-bold`}>View All</Text>
            <Entypo name="chevron-right" size={18} color="#4F46E5" />
          </Pressable>

          {/* Show attendance records here */}
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
