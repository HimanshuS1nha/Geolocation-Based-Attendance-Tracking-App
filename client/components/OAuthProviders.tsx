import { View, Text, Pressable, Image } from "react-native";
import React from "react";
import tw from "twrnc";

const OAuthProviders = ({ text }: { text: string }) => {
  return (
    <View style={tw`items-center gap-y-6`}>
      <View style={tw`flex-row gap-x-4 items-center`}>
        <View style={tw`h-[0.5px] w-[32%] bg-black`} />
        <Text className="text-center text-gray-700 font-medium">{text}</Text>
        <View style={tw`h-[0.5px] w-[32%] bg-black`} />
      </View>

      <View style={tw`flex-row justify-between items-center w-[90%]`}>
        <Pressable style={tw`border border-gray-400 px-4 py-2.5 rounded-lg`}>
          <Image
            source={require("../assets/images/apple.png")}
            style={tw`w-7 h-7`}
          />
        </Pressable>
        <Pressable style={tw`border border-gray-400 px-4 py-2.5 rounded-lg`}>
          <Image
            source={require("../assets/images/google.png")}
            style={tw`w-7 h-7`}
          />
        </Pressable>
        <Pressable style={tw`border border-gray-400 px-4 py-2.5 rounded-lg`}>
          <Image
            source={require("../assets/images/facebook.png")}
            style={tw`w-7 h-7`}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default OAuthProviders;
