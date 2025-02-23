import { View, Text } from "react-native";
import React from "react";
import tw from "twrnc";
import QRCode from "react-native-qrcode-svg";

const QrCode = () => {
  return (
    <View style={tw`flex-1 justify-center items-center gap-y-7`}>
      <View style={tw`gap-y-1.5 items-center`}>
        <Text style={tw`text-2xl font-bold text-indigo-600`}>QR Code</Text>
        <Text style={tw`text-rose-500`}>
          Use this for marking offsite attendance!
        </Text>
      </View>

      <View style={tw`bg-white p-2`}>
        <QRCode value={"XYZ"} size={200} />
      </View>
    </View>
  );
};

export default QrCode;
