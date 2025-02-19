import React from "react";
import { router, Stack } from "expo-router";
import { Pressable, Image } from "react-native";
import tw from "twrnc";

import { useUser } from "@/hooks/useUser";

const EmployeeStackLayout = () => {
  const user = useUser((state) => state.user);
  return (
    <Stack>
      <Stack.Screen
        name="home"
        options={{
          headerTitle: "GeoAttendance",
          headerRight: () => {
            return (
              <Pressable onPress={() => router.push("/employee/profile")}>
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
      />

      <Stack.Screen
        name="profile"
        options={{
          headerTitle: "Profile",
        }}
      />

      <Stack.Screen
        name="edit-profile"
        options={{
          headerTitle: "Edit Profile",
        }}
      />
    </Stack>
  );
};

export default EmployeeStackLayout;
