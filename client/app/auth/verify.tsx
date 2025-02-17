import { View, Text, Pressable } from "react-native";
import React, { useState, useCallback } from "react";
import tw from "twrnc";
import { useLocalSearchParams } from "expo-router";

import Input from "@/components/Input";
import Button from "@/components/Button";

const Verify = () => {
  const { email, type } = useLocalSearchParams() as {
    email: string;
    type: "company" | "employee";
  };

  const [otp, setOtp] = useState("");

  const handleChangeText = useCallback((value: string) => setOtp(value), []);
  return (
    <View style={tw`flex-1 bg-white px-4 gap-y-7`}>
      <Text style={tw`text-3xl font-medium mt-4`}>
        Verify your email to continue!
      </Text>

      <View style={tw`gap-y-2.5`}>
        <Input
          placeholder="Enter otp"
          value={otp}
          onChangeText={handleChangeText}
          maxLength={6}
        />

        <View style={tw`items-end`}>
          <Pressable>
            <Text style={tw`font-medium text-indigo-600`}>Resend OTP</Text>
          </Pressable>
        </View>
      </View>

      <Button>Verify</Button>
    </View>
  );
};

export default Verify;
