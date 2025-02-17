import { View, Text, Image, Pressable } from "react-native";
import React, { useMemo } from "react";
import tw from "twrnc";
import {
  Entypo,
  MaterialCommunityIcons,
  FontAwesome5,
  AntDesign,
} from "@expo/vector-icons";

import { useUser } from "@/hooks/useUser";

const CompanyProfile = () => {
  const user = useUser((state) => state.user);
  const deleteUser = useUser((state) => state.deleteUser);

  const options = useMemo(
    () => [
      {
        title: "Update Office Location",
        Icon: Entypo,
        iconName: "location-pin",
        onPress: () => {},
        variant: "default",
      },
      {
        title: "Get QR Code",
        Icon: AntDesign,
        iconName: "qrcode",
        onPress: () => {},
        variant: "default",
      },
      {
        title: "Edit Profile",
        Icon: FontAwesome5,
        iconName: "user-alt",
        onPress: () => {},
        variant: "default",
      },
      {
        title: "Change Password",
        Icon: Entypo,
        iconName: "lock",
        onPress: () => {},
        variant: "default",
      },
      {
        title: "Logout",
        Icon: MaterialCommunityIcons,
        iconName: "logout",
        onPress: () => {},
        variant: "destructive",
      },
    ],
    []
  );
  return (
    <View style={tw`flex-1 bg-white pt-4 gap-y-8`}>
      <View style={tw`items-center gap-y-3`}>
        <Image
          source={{
            uri: user?.image,
          }}
          style={tw`size-32 rounded-full`}
        />
        <Text style={tw`text-2xl font-bold`}>{user?.name}</Text>
      </View>

      <View style={tw`px-4 gap-y-6`}>
        {options.map((option) => {
          return (
            <Pressable
              key={option.title}
              style={tw`flex-row justify-between items-center`}
              onPress={option.onPress}
            >
              <View style={tw`flex-row gap-x-4 items-center`}>
                <View
                  style={tw`${
                    option.variant === "default"
                      ? "bg-indigo-600"
                      : "bg-rose-600"
                  } p-1.5 rounded-full`}
                >
                  <option.Icon
                    name={option.iconName as any}
                    size={24}
                    color={"white"}
                  />
                </View>
                <Text
                  style={tw`font-semibold text-base ${
                    option.variant === "default"
                      ? "text-black"
                      : "text-rose-600"
                  }`}
                >
                  {option.title}
                </Text>
              </View>
              <Entypo
                name="triangle-right"
                size={30}
                color={option.variant === "default" ? "#4F46E5" : "#E11D48"}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default CompanyProfile;
