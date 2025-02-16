import { View, Text, Image } from "react-native";
import React from "react";
import tw from "twrnc";
import { router } from "expo-router";

import Button from "@/components/Button";

const Onboarding = () => {
  return (
    <View style={tw`bg-white flex-1 gap-y-6 items-center pt-12`}>
      <View style={tw`mt-2 gap-y-2.5`}>
        <Text style={tw`text-center text-3xl font-bold`}>GeoAttendance</Text>
        <Text style={tw`text-center text-gray-700`}>
          Easy way to Record & Track Attendance
        </Text>
      </View>

      <Image
        source={require("../assets/images/onboarding.png")}
        style={tw`w-[90%] h-[60%]`}
        resizeMode="stretch"
      />

      <View style={tw`flex-row gap-x-4 items-center`}>
        <Button
          variant="outline"
          textSize="sm"
          style={tw`w-[45%]`}
          onPress={() =>
            router.push({
              pathname: "/auth/login",
              params: { type: "employee" },
            })
          }
        >
          Continue as Employee
        </Button>
        <Button
          style={tw`w-[45%]`}
          textSize="sm"
          onPress={() =>
            router.push({
              pathname: "/auth/login",
              params: { type: "company" },
            })
          }
        >
          Continue as Company
        </Button>
      </View>
    </View>
  );
};

export default Onboarding;
