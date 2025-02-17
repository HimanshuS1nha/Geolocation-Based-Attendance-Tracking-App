import { View, Text, Image } from "react-native";
import React from "react";
import tw from "twrnc";

import { useUser } from "@/hooks/useUser";

const ProfileCard = () => {
  const user = useUser((state) => state.user);
  return (
    <View
      style={tw`flex-row items-center gap-x-4 p-4 bg-indigo-600 rounded-xl`}
    >
      <Image
        source={{
          uri: user?.image,
        }}
        style={tw`size-16 rounded-lg`}
      />

      <View style={tw`gap-y-1.5`}>
        <Text style={tw`text-white text-2xl font-bold`}>{user?.name}</Text>
        <Text style={tw`text-gray-300`}>{user?.email}</Text>
      </View>
    </View>
  );
};

export default ProfileCard;
