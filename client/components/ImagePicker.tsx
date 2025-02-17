import { View, Text, Image, Pressable } from "react-native";
import React, { useCallback } from "react";
import tw from "twrnc";
import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import * as ExpoImagePicker from "expo-image-picker";

const ImagePicker = ({
  base64,
  setFileBase64,
  setFileName,
}: {
  base64: string;
  setFileName: React.Dispatch<React.SetStateAction<string>>;
  setFileBase64: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const pickImage = useCallback(async () => {
    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setFileName(result.assets[0].fileName || "");
      setFileBase64(result.assets[0].base64 || "");
    }
  }, []);
  return (
    <>
      {base64 ? (
        <View style={tw`items-center justify-center`}>
          <Image
            source={{
              uri: `data:image/png;base64,${base64}`,
            }}
            style={tw`size-28 rounded-full`}
          />
          <Pressable
            style={tw`absolute bg-emerald-600 bottom-0 right-0 p-2 rounded-full z-10 shadow shadow-black`}
            onPress={pickImage}
          >
            <MaterialIcons name="change-circle" size={26} color="white" />
          </Pressable>
        </View>
      ) : (
        <View
          style={tw`size-28 rounded-full bg-gray-300 items-center justify-center`}
        >
          <FontAwesome name="user" size={60} color={"white"} />
          <Pressable
            style={tw`absolute bg-emerald-600 bottom-0 right-0 p-2 rounded-full z-10 shadow shadow-black`}
            onPress={pickImage}
          >
            <AntDesign name="plus" size={26} color="white" />
          </Pressable>
        </View>
      )}
    </>
  );
};

export default ImagePicker;
