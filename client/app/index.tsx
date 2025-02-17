import { router, useRootNavigationState } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import tw from "twrnc";

import { useUser } from "@/hooks/useUser";

export default function Index() {
  const rootNavigationState = useRootNavigationState();
  const user = useUser((state) => state.user);

  useEffect(() => {
    if (rootNavigationState?.key) {
      if (user) {
        if (user.type === "company") {
          router.replace("/company/home");
        } else if (user.type === "employee") {
          router.replace("/employee/home");
        }
      } else {
        router.replace("/onboarding");
      }
    }
  }, [rootNavigationState?.key]);
  return (
    <View style={tw`flex-1 items-center justify-center bg-white gap-y-8`}>
      <Text style={tw`text-3xl font-bold`}>GeoAttendance</Text>

      <ActivityIndicator size={45} color={"#4F46E5"} />
    </View>
  );
}
