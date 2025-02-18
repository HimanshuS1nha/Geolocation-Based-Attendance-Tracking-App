import { View, Text, Modal, Pressable, Alert } from "react-native";
import React, { useState, useCallback } from "react";
import tw from "twrnc";
import { Entypo } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import * as Location from "expo-location";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ZodError } from "zod";

import Input from "@/components/Input";
import Button from "@/components/Button";

import { useOfficeLocationModal } from "@/hooks/useOfficeLocationModal";

import { addOfficeLocatioValidator } from "@/validators/add-office-location-validator";

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

  const { mutate: handleAddOfficeLocation, isPending } = useMutation({
    mutationKey: ["add-office-location"],
    mutationFn: async () => {
      const token = SecureStore.getItem("token");
      if (!token) {
        throw new Error("Please login first");
      }

      const parsedData = await addOfficeLocatioValidator.parseAsync({
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      });

      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/api/add-office-location`,
        { ...parsedData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return data as { message: string };
    },
    onSuccess: (data) => {
      Alert.alert("Success", data.message, [
        {
          text: "Ok",
          onPress: () => setIsVisible(false),
        },
      ]);
    },
    onError: (error) => {
      if (error instanceof ZodError) {
        Alert.alert("Error", error.errors[0].message);
      } else if (error instanceof AxiosError && error.response?.data.error) {
        Alert.alert("Error", error.response.data.error);
      } else {
        Alert.alert("Error", error.message);
      }
    },
  });

  const handleUseCurrentLocation = useCallback(async () => {
    const permission = await Location.getForegroundPermissionsAsync();
    if (permission.granted) {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      setLatitude(location.coords.latitude.toString());
      setLongitude(location.coords.longitude.toString());

      handleAddOfficeLocation();
    } else {
      Alert.alert(
        "Error",
        "Location permission is required for this feature to work."
      );
    }
  }, []);
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
            <Button disabled={isPending}>Add/Update Location</Button>
            <Button variant="outline" disabled={isPending}>
              Use My Current Location
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default OfficeLocationModal;
