import { View, Text, Modal, Pressable } from "react-native";
import React, { useState, useCallback } from "react";
import tw from "twrnc";
import { Entypo } from "@expo/vector-icons";

import Input from "./Input";
import Button from "./Button";

import { useOfficeLocationModal } from "@/hooks/useOfficeLocationModal";

const OfficeLocationModal = () => {
  const { isVisible, setIsVisible } = useOfficeLocationModal();

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const handleChangeText = useCallback(
    (type: "latitude" | "longitude", value: string) => {
      if (type === "latitude") {
        setLatitude(value);
      } else if (type === "longitude") {
        setLongitude(value);
      }
    },
    []
  );
  return (
    <Modal visible={isVisible} transparent animationType="fade">
      <View style={tw`flex-1 justify-center items-center bg-gray-100/70`}>
        <View
          style={tw`bg-white p-4 items-center rounded-xl w-[80%] gap-y-5 shadow shadow-black`}
        >
          <Pressable
            style={tw`absolute top-2.5 right-2.5`}
            onPress={() => setIsVisible(false)}
          >
            <Entypo name="cross" size={24} color="black" />
          </Pressable>

          <Text style={tw`text-lg font-medium mt-2.5`}>
            Add/Update Office Location
          </Text>

          <View style={tw`gap-y-3 w-full`}>
            <Input
              placeholder="Enter latitude"
              value={latitude}
              onChangeText={(text) => handleChangeText("latitude", text)}
              style={tw`py-4`}
            />
            <Input
              placeholder="Enter longitude"
              value={longitude}
              onChangeText={(text) => handleChangeText("longitude", text)}
              style={tw`py-4`}
            />
          </View>

          <View style={tw`gap-y-3 w-full`}>
            <Button>Add/Update Location</Button>
            <Button variant="outline">Use My Current Location</Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default OfficeLocationModal;
