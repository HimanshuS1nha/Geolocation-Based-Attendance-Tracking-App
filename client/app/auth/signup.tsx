import { View, Text, ScrollView } from "react-native";
import React, { useState, useCallback } from "react";
import tw from "twrnc";

import Input from "@/components/Input";
import Button from "@/components/Button";
import OAuthProviders from "@/components/OAuthProviders";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileBase64, setFileBase64] = useState("");

  const handleChangeText = useCallback(
    (
      type: "name" | "email" | "password" | "confirmPassword",
      value: string
    ) => {
      if (type === "name") {
        setName(value);
      } else if (type === "email") {
        setEmail(value);
      } else if (type === "password") {
        setPassword(value);
      } else if (type === "confirmPassword") {
        setConfirmPassword(value);
      }
    },
    []
  );
  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView contentContainerStyle={tw`pb-4 px-4 gap-y-9`}>
        <Text style={tw`text-3xl font-medium mt-4`}>
          Hello! Register to get started
        </Text>

        <View style={tw`gap-y-3.5 items-center`}>
          <Input
            placeholder="Enter company's name"
            value={name}
            onChangeText={(text) => handleChangeText("name", text)}
          />
          <Input
            placeholder="Enter company's email"
            value={email}
            onChangeText={(text) => handleChangeText("email", text)}
          />
          <Input
            placeholder="Enter company's password"
            secureTextEntry
            value={password}
            onChangeText={(text) => handleChangeText("password", text)}
          />
          <Input
            placeholder="Confirm company's password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={(text) => handleChangeText("confirmPassword", text)}
          />
        </View>

        <Button>Signup</Button>

        <OAuthProviders text="Or Register with" />
      </ScrollView>
    </View>
  );
};

export default Signup;
