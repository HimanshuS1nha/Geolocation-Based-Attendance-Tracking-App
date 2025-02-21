import { View, Text, Image, Pressable, Alert } from "react-native";
import React from "react";
import tw from "twrnc";
import { FontAwesome5 } from "@expo/vector-icons";

import type { EmployeeType } from "@/types";

const EmployeeCard = ({
  employee,
  handleDelete,
}: {
  employee: EmployeeType;
  handleDelete: () => void;
}) => {
  return (
    <View
      style={tw`w-[95%] mb-4 p-3.5 bg-white items-center rounded-lg shadow shadow-black gap-y-4`}
    >
      <Image
        source={{ uri: employee.image }}
        style={tw`size-20 rounded-full`}
      />

      <View style={tw`gap-y-2 items-center`}>
        <Text style={tw`text-base font-semibold text-center`}>
          {employee.name}
        </Text>
        <Text style={tw`text-gray-700`}>{employee.designation}</Text>
      </View>

      <View style={tw`flex-row gap-x-4 items-center`}>
        <Pressable>
          <FontAwesome5 name="pencil-alt" size={20} color="blue" />
        </Pressable>
        <Pressable
          onPress={() =>
            Alert.alert("Warning", `Do you want to delete ${employee.name}`, [
              {
                text: "No",
              },
              {
                text: "Yes",
                onPress: handleDelete,
              },
            ])
          }
        >
          <FontAwesome5 name="trash" size={20} color="red" />
        </Pressable>
      </View>
    </View>
  );
};

export default EmployeeCard;
