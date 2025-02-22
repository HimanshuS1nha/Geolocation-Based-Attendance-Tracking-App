import { View, Text } from "react-native";
import React, { useState, useCallback } from "react";
import tw from "twrnc";

import Input from "@/components/Input";
import Button from "@/components/Button";

const CreateNewPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangeText = useCallback(
    (type: "newPassword" | "confirmPassword", value: string) => {
      if (type === "newPassword") {
        setNewPassword(value);
      } else if (type === "confirmPassword") {
        setConfirmPassword(value);
      }
    },
    []
  );
  return (
    <View style={tw`flex-1 bg-white px-4 gap-y-9`}>
      <Text style={tw`text-3xl font-medium mt-4`}>
        Create your new password here!
      </Text>

      <View style={tw`gap-y-3.5`}>
        <Input
          placeholder="Enter new password"
          value={newPassword}
          onChangeText={(text) => handleChangeText("newPassword", text)}
        />
        <Input
          placeholder="Confirm new password"
          value={confirmPassword}
          onChangeText={(text) => handleChangeText("confirmPassword", text)}
        />
      </View>

      <Button>Create</Button>
    </View>
  );
};

export default CreateNewPassword;
