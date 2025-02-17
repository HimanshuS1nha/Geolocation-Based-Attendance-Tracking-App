import { View, Text } from "react-native";
import React from "react";
import tw from "twrnc";

import ProfileCard from "@/components/ProfileCard";
import Button from "@/components/Button";

const CompanyHome = () => {
  return (
    <View style={tw`flex-1`}>
      <View style={tw`flex-1 pt-4 pb-8 px-4 gap-y-7`}>
        <ProfileCard />
      </View>

      <View style={tw`pb-2 px-2 items-center`}>
        <Button>Start Taking Attendance</Button>
      </View>
    </View>
  );
};

export default CompanyHome;
