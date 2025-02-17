import { View, Text, ScrollView, Image, Pressable } from "react-native";
import React, { useState, useCallback } from "react";
import tw from "twrnc";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome, AntDesign, MaterialIcons } from "@expo/vector-icons";

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

  const pickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setFileName(result.assets[0].fileName || "");
      setFileBase64(result.assets[0].base64 || "");
    }
  }, []);
  return (
    <View style={tw`flex-1 bg-white`}>
      <ScrollView contentContainerStyle={tw`pb-4 px-4 gap-y-9`}>
        <Text style={tw`text-3xl font-medium mt-4`}>
          Hello! Register to get started
        </Text>

        <View style={tw`gap-y-3.5 items-center`}>
        {fileBase64 ? (
          <View style={tw`items-center justify-center`}>
            <Image
              source={{
                uri: `data:image/png;base64,${fileBase64}`,
              }}
              style={tw`size-28 rounded-full`}
            />
            <Pressable
              style={tw`absolute bg-emerald-600 bottom-0 right-0 p-2 rounded-full z-10 shadow shadow-black`}
              onPress={pickImage}
            >
              <MaterialIcons name="change-circle" size={26} color="white" />
            </Pressable>
          </View>
        ) : (
          <View
            style={tw`size-28 rounded-full bg-gray-300 items-center justify-center`}
          >
            <FontAwesome name="user" size={60} color={"white"} />
            <Pressable
              style={tw`absolute bg-emerald-600 bottom-0 right-0 p-2 rounded-full z-10 shadow shadow-black`}
              onPress={pickImage}
            >
              <AntDesign name="plus" size={26} color="white" />
            </Pressable>
          </View>
        )}

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
