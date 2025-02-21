import { View, Text, Modal, Alert, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import tw from "twrnc";
import { Picker } from "@react-native-picker/picker";
import * as SecureStore from "expo-secure-store";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

import Button from "@/components/Button";

const EmployeesFiltersModal = ({
  isVisible,
  setIsVisible,
  designation,
  setDesignation,
}: {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  designation: string;
  setDesignation: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [value, setValue] = useState(designation);

  const { data, isLoading, error } = useQuery({
    queryKey: ["get-designations"],
    queryFn: async () => {
      const token = SecureStore.getItem("token");
      if (!token) {
        throw new Error("Please login first");
      }

      const { data } = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/api/get-designations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data as { designations: string[] };
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
    <Modal visible={isVisible} animationType="fade" transparent>
      <View style={tw`flex-1 bg-gray-100/50`}>
        <View style={tw`bg-white shadow shadow-black items-center p-4 gap-y-6`}>
          <Text style={tw`text-2xl text-indigo-600 font-semibold`}>
            Filters
          </Text>

          {isLoading ? (
            <ActivityIndicator size={30} color={"#4F46E5"} />
          ) : (
            <>
              <View style={tw`w-full rounded-full border border-black`}>
                <Picker
                  mode="dropdown"
                  onValueChange={(value: string) => setValue(value)}
                  selectedValue={value}
                >
                  <Picker.Item label="Select a designation" value={""} />
                  {data?.designations.map((designation) => {
                    return (
                      <Picker.Item
                        label={designation}
                        value={designation}
                        key={designation}
                      />
                    );
                  })}
                </Picker>
              </View>

              <View style={tw`gap-y-1.5 w-full`}>
                <Button
                  textSize="sm"
                  onPress={() => {
                    setDesignation(value);
                    setIsVisible(false);
                  }}
                >
                  Apply
                </Button>
                <Button
                  style={tw`bg-rose-600`}
                  textSize="sm"
                  onPress={() => {
                    setDesignation("");
                    setIsVisible(false);
                  }}
                >
                  Remove
                </Button>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default EmployeesFiltersModal;
