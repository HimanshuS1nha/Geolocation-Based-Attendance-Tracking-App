import { View, Text } from "react-native";
import React, { useState, useCallback } from "react";
import tw from "twrnc";
import { useLocalSearchParams } from "expo-router";

import Input from "@/components/Input";
import Button from "@/components/Button";

const ForgotPassword = () => {
  const { type } = useLocalSearchParams() as { type: "company" | "employee" };

  const [email, setEmail] = useState("");

  const handleChangeEmail = useCallback((value: string) => setEmail(value), []);
  return (
    <View style={tw`flex-1 bg-white px-4 gap-y-9`}>
      <Text style={tw`text-3xl font-medium mt-4`}>
        Enter your email to continue!
      </Text>

      <Input
        placeholder="Enter your email"
        value={email}
        onChangeText={handleChangeEmail}
      />

      <Button>Continue</Button>
    </View>
  );
};

export default ForgotPassword;
