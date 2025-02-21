import { Tabs } from "expo-router";
import React from "react";
import { Pressable, Image, View } from "react-native";
import tw from "twrnc";
import { Ionicons, FontAwesome, AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";

import { useUser } from "@/hooks/useUser";

const CompanyTabsLayout = () => {
  const user = useUser((state) => state.user);
  return (
    <Tabs
      screenOptions={{
        headerTitle: "GeoAttendance",
        headerRight: () => {
          return (
            <Pressable onPress={() => router.push("/company/profile")}>
              <Image
                source={{
                  uri: user?.image,
                }}
                style={tw`size-9 rounded-full mr-2`}
              />
            </Pressable>
          );
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ size, color }) => {
            return <Ionicons name="home-sharp" size={size} color={color} />;
          },
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="employees"
        options={{
          tabBarIcon: ({ size, color }) => {
            return <FontAwesome name="users" size={size} color={color} />;
          },
          title: "Employees",
          headerRight: (props) => {
            return (
              <View style={tw`flex-row gap-x-4 items-center`} {...props}>
                <Pressable>
                  <Ionicons name="options-outline" size={26} color="black" />
                </Pressable>
                <Pressable onPress={() => router.push("/company/profile")}>
                  <Image
                    source={{
                      uri: user?.image,
                    }}
                    style={tw`size-9 rounded-full mr-2`}
                  />
                </Pressable>
              </View>
            );
          },
        }}
      />
    </Tabs>
  );
};

export default CompanyTabsLayout;
