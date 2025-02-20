import { View, Text, ScrollView } from "react-native";
import React, { useState, useCallback } from "react";
import tw from "twrnc";

import Input from "@/components/Input";
import Button from "@/components/Button";

const ChangeCompanyPassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangeText = useCallback(
    (
      type: "oldPassword" | "newPassword" | "confirmPassword",
      value: string
    ) => {
      if (type === "oldPassword") {
        setOldPassword(value);
      } else if (type === "newPassword") {
        setNewPassword(value);
      } else if (type === "confirmPassword") {
        setConfirmPassword(value);
      }
    },
    []
  );
  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView contentContainerStyle={tw`pt-6 px-4 gap-y-6 items-center`}>
        <Input
          placeholder="Enter old password"
          secureTextEntry
          value={oldPassword}
          onChangeText={(text) => handleChangeText("oldPassword", text)}
        />
        <Input
          placeholder="Enter new password"
          secureTextEntry
          value={newPassword}
          onChangeText={(text) => handleChangeText("newPassword", text)}
        />
        <Input
          placeholder="Confirm new password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={(text) => handleChangeText("confirmPassword", text)}
        />

        <Button>Change Password</Button>
      </ScrollView>
    </View>
  );
};

export default ChangeCompanyPassword;
