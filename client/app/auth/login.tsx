import { View, Text, Pressable, Image } from "react-native";
import React, { useState, useCallback } from "react";
import tw from "twrnc";
import { useLocalSearchParams, router } from "expo-router";

import Input from "@/components/Input";
import Button from "@/components/Button";

const Login = () => {
  const { type } = useLocalSearchParams() as { type: "employee" | "company" };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleChangeText = useCallback(
    (type: "email" | "password", value: string) => {
      if (type === "email") {
        setEmail(value);
      } else if (type === "password") {
        setPassword(value);
      }
    },
    []
  );
  return (
    <View style={tw`flex-1 bg-white px-4 gap-y-9`}>
      <Text style={tw`text-3xl font-medium mt-4`}>
        Welcome back! Glad to see you, Again!
      </Text>

      <View style={tw`gap-y-3.5`}>
        <Input
          placeHolder="Enter your email"
          value={email}
          onChangeText={(text) => handleChangeText("email", text)}
        />
        <Input
          placeHolder="Enter your password"
          value={password}
          onChangeText={(text) => handleChangeText("password", text)}
          secureTextEntry
        />
        <View style={tw`items-end`}>
          <Text style={tw`text-gray-500 font-bold`}>Forgot Password?</Text>
        </View>
      </View>

      <Button>Login</Button>

      <View style={tw`items-center gap-y-6`}>
        <View style={tw`flex-row gap-x-4 items-center`}>
          <View style={tw`h-[0.5px] w-[32%] bg-black`} />
          <Text className="text-center text-gray-700 font-medium">
            Or Login with
          </Text>
          <View style={tw`h-[0.5px] w-[32%] bg-black`} />
        </View>

        <View style={tw`flex-row justify-between items-center w-[90%]`}>
          <Pressable style={tw`border border-gray-400 px-4 py-2.5 rounded-lg`}>
            <Image
              source={require("../../assets/images/apple.png")}
              style={tw`w-7 h-7`}
            />
          </Pressable>
          <Pressable style={tw`border border-gray-400 px-4 py-2.5 rounded-lg`}>
            <Image
              source={require("../../assets/images/google.png")}
              style={tw`w-7 h-7`}
            />
          </Pressable>
          <Pressable style={tw`border border-gray-400 px-4 py-2.5 rounded-lg`}>
            <Image
              source={require("../../assets/images/facebook.png")}
              style={tw`w-7 h-7`}
            />
          </Pressable>
        </View>
      </View>

      {type === "company" && (
        <View style={tw`justify-center items-center flex-row gap-x-1`}>
          <Text>Don&apos;t have an account?</Text>
          <Pressable>
            <Text style={tw`text-indigo-600 text-base font-semibold`}>
              Signup
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default Login;
