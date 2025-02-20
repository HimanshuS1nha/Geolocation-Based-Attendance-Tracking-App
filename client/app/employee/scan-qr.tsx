import { View, Text, Alert } from "react-native";
import React, { useState, useCallback } from "react";
import tw from "twrnc";
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useIsFocused } from "@react-navigation/native";

import Button from "@/components/Button";

const ScanQR = () => {
  const isFocused = useIsFocused();
  const [permission, requestPermission] = useCameraPermissions();

  const [scanned, setScanned] = useState(false);

  const handleBarCodeScanned = useCallback((result: BarcodeScanningResult) => {
    setScanned(true);
    Alert.alert("Success", "Scanned successfully");
  }, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={tw`mt-4 gap-y-6 items-center`}>
        <Text style={tw`text-rose-600 font-medium`}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission}>Grant Permission</Button>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-white`}>
      {isFocused && (
        <CameraView
          style={tw`w-full h-[60%] mt-[25%] items-center justify-center`}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        >
          <View style={tw`w-60 h-56 items-center justify-center`}>
            <View
              style={tw`border-l-4 border-t-4 border-white w-12 h-12 absolute top-0 left-0`}
            ></View>
            <View
              style={tw`border-r-4 border-t-4 border-white w-12 h-12 absolute top-0 right-0`}
            ></View>
            <View
              style={tw`border-r-4 border-b-4 border-white w-12 h-12 absolute bottom-0 right-0`}
            ></View>
            <View
              style={tw`border-l-4 border-b-4 border-white w-12 h-12 absolute bottom-0 left-0`}
            ></View>
          </View>
        </CameraView>
      )}

      <View style={tw`items-center mt-6`}>
        <Button
          style={tw`px-4 py-2 rounded-full`}
          onPress={() => {
            setScanned(false);
          }}
          disabled={!scanned}
          textSize="sm"
        >
          Scan Again
        </Button>
      </View>
    </View>
  );
};

export default ScanQR;
