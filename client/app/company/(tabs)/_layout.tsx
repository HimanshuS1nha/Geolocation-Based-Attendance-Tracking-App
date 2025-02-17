import { Tabs } from "expo-router";
import React from "react";
import { Pressable, Image } from "react-native";
import tw from "twrnc";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

import { useUser } from "@/hooks/useUser";

const CompanyTabsLayout = () => {
  const user = useUser((state) => state.user);
  return (
    <Tabs
      screenOptions={{
        headerTitle: "GeoAttendance",
        headerRight: () => {
          return (
            <Pressable>
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
        }}
      />
    </Tabs>
  );
};

export default CompanyTabsLayout;
