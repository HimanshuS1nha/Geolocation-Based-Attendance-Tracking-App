import React from "react";
import { Stack } from "expo-router";
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
      />
    </Stack>
  );
};

export default EmployeeStackLayout;
