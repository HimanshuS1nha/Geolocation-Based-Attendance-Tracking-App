import { View, Text, ScrollView } from "react-native";
import React, { useState, useCallback } from "react";
import tw from "twrnc";

import ImagePicker from "@/components/ImagePicker";
import Input from "@/components/Input";
import Button from "@/components/Button";

const AddEmployee = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileBase64, setFileBase64] = useState("");
  const [designation, setDesignation] = useState("");

  const handleChangeText = useCallback(
    (
      type: "name" | "email" | "password" | "confirmPassword" | "designation",
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
      } else if (type === "designation") {
        setDesignation(value);
      }
    },
    []
  );
  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView contentContainerStyle={tw`pt-6 px-4 gap-y-6 items-center`}>
        <ImagePicker
          base64={fileBase64}
          setFileBase64={setFileBase64}
          setFileName={setFileName}
        />

        <Input
          placeholder="Enter employee's name"
          value={name}
          onChangeText={(text) => handleChangeText("name", text)}
        />
        <Input
          placeholder="Enter employee's email"
          value={email}
          onChangeText={(text) => handleChangeText("email", text)}
        />
        <Input
          placeholder="Enter employee's designation"
          value={designation}
          onChangeText={(text) => handleChangeText("designation", text)}
        />
        <Input
          placeholder="Enter employee's password"
          value={password}
          secureTextEntry
          onChangeText={(text) => handleChangeText("password", text)}
        />
        <Input
          placeholder="Confirm employee's password"
          value={confirmPassword}
          secureTextEntry
          onChangeText={(text) => handleChangeText("confirmPassword", text)}
        />

        <Button>Add Employee</Button>
      </ScrollView>
    </View>
  );
};

export default AddEmployee;
