import { View, Text, ScrollView } from "react-native";
import React, { useState, useCallback } from "react";
import tw from "twrnc";

import ImagePicker from "@/components/ImagePicker";
import Input from "@/components/Input";
import Button from "@/components/Button";

import { useUser } from "@/hooks/useUser";

const EditEmployeeProfile = () => {
  const user = useUser((state) => state.user);

  const [name, setName] = useState(user?.name ?? "");
  const [designation, setDesignation] = useState(user?.designation ?? "");
  const [fileName, setFileName] = useState("");
  const [fileBase64, setFileBase64] = useState("");

  const handleChangeText = useCallback(
    (type: "name" | "designation", value: string) => {
      if (type === "name") {
        setName(value);
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
          setFileName={setFileName}
          setFileBase64={setFileBase64}
        />

        <Input
          placeholder="Enter employee's name"
          value={name}
          onChangeText={(text) => handleChangeText("name", text)}
        />

        <Input
          placeholder="Enter employee's designation"
          value={designation}
          onChangeText={(text) => handleChangeText("designation", text)}
        />

        <Button>Edit Profile</Button>
      </ScrollView>
    </View>
  );
};

export default EditEmployeeProfile;
