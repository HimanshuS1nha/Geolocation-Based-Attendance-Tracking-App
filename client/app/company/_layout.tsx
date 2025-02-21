import { Stack } from "expo-router";
import React from "react";

import OfficeLocationModal from "@/components/OfficeLocationModal";

const CompanyStackLayout = () => {
  return (
    <>
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

        <Stack.Screen
          name="edit-profile"
          options={{
            headerTitle: "Edit Profile",
          }}
        />

        <Stack.Screen
          name="change-password"
          options={{
            headerTitle: "Change Password",
          }}
        />

        <Stack.Screen
          name="edit-employee"
          options={{
            headerTitle: "Edit Employee",
          }}
        />
      </Stack>

      <OfficeLocationModal />
    </>
  );
};

export default CompanyStackLayout;
