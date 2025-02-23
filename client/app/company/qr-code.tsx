import { View, Text, ActivityIndicator, Alert } from "react-native";
import React from "react";
import tw from "twrnc";
import QRCode from "react-native-qrcode-svg";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import * as SecureStore from "expo-secure-store";
import Button from "@/components/Button";

const QrCode = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["get-qr-code"],
    queryFn: async () => {
      const token = SecureStore.getItem("token");
      if (!token) {
        throw new Error("Please login first");
      }

      const { data } = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/api/get-qr-code`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data as { qrToken: string };
    },
  });
  if (error) {
    if (error instanceof AxiosError && error.response?.data.error) {
      Alert.alert("Error", error.response.data.error);
    } else {
      Alert.alert("Error", error.message);
    }
  }
  return (
    <View style={tw`flex-1 justify-center items-center gap-y-7`}>
      {isLoading ? (
        <ActivityIndicator size={40} color={"#4F46E5"} />
      ) : data && data.qrToken ? (
        <>
          <View style={tw`gap-y-1.5 items-center`}>
            <Text style={tw`text-2xl font-bold text-indigo-600`}>QR Code</Text>
            <Text>Use this for marking offsite attendance!</Text>
          </View>

          <View style={tw`bg-white p-2`}>
            <QRCode value={data.qrToken} size={200} />
          </View>

          <Button onPress={refetch} disabled={isLoading} textSize="sm">
            Refresh QR Code
          </Button>
        </>
      ) : (
        <Text style={tw`text-base text-center text-rose-600 font-semibold`}>
          Some error occured. Please try again later!
        </Text>
      )}
    </View>
  );
};

export default QrCode;
