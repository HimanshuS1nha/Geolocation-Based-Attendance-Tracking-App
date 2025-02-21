import { View, Text, ScrollView } from "react-native";
import React, { useState, useCallback } from "react";
import tw from "twrnc";
import { useLocalSearchParams } from "expo-router";

import ImagePicker from "@/components/ImagePicker";
import Input from "@/components/Input";
import Button from "@/components/Button";

import type { EmployeeType } from "@/types";

const EditEmployee = () => {
  const { email, id, image, name, designation } =
    useLocalSearchParams() as EmployeeType;

  const [newName, setNewName] = useState(name);
  const [newEmail, setNewEmail] = useState(email);
  const [fileName, setFileName] = useState("");
  const [fileBase64, setFileBase64] = useState("");
  const [newDesignation, setNewDesignation] = useState(designation ?? "");

  const handleChangeText = useCallback(
    (type: "name" | "email" | "designation", value: string) => {
      if (type === "name") {
        setNewName(value);
      } else if (type === "email") {
        setNewEmail(value);
      } else if (type === "designation") {
        setNewDesignation(value);
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
          type="edit-employee"
          image={image}
        />

        <Input
          placeholder="Enter employee's name"
          value={newName}
          onChangeText={(text) => handleChangeText("name", text)}
        />
        <Input
          placeholder="Enter employee's email"
          value={newEmail}
          onChangeText={(text) => handleChangeText("email", text)}
        />
        <Input
          placeholder="Enter employee's designation"
          value={newDesignation}
          onChangeText={(text) => handleChangeText("designation", text)}
        />

        <Button>Edit Employee</Button>
      </ScrollView>
    </View>
  );
};

export default EditEmployee;
