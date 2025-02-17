import { Stack } from "expo-router";
import React from "react";

const CompanyStackLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      <Stack.Screen
        name="add-employee"
        options={{
          headerTitle: "Add Employee",
        }}
      />

      <Stack.Screen
        name="profile"
        options={{
          headerTitle: "Profile",
        }}
      />
    </Stack>
  );
};

export default CompanyStackLayout;
