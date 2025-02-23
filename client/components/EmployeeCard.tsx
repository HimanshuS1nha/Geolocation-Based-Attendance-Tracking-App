import {
  View,
  Text,
  Image,
  Pressable,
  Alert,
  StyleProp,
  PressableProps,
} from "react-native";
import React from "react";
import tw from "twrnc";
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";

import type { EmployeeType } from "@/types";

const EmployeeCard = ({
  employee,
  handleDelete,
  showOptions = true,
  style,
}: {
  employee: EmployeeType;
  handleDelete?: () => void;
  showOptions?: boolean;
  style?: StyleProp<PressableProps>;
}) => {
  return (
    <Pressable
      style={[
        tw`w-[95%] mb-4 p-3.5 bg-white items-center rounded-lg shadow shadow-black gap-y-4`,
        style,
      ]}
      onPress={() =>
        router.push({
          pathname: "/company/employee-wise-attendance-history",
          params: { id: employee.id, name: employee.name },
        })
      }
    >
      <Image
        source={{ uri: employee.image }}
        style={tw`size-20 rounded-full`}
      />

      <View style={tw`gap-y-2 items-center`}>
        <Text style={tw`font-semibold text-center`}>{employee.name}</Text>
        <Text style={tw`text-gray-700`}>{employee.designation}</Text>
      </View>

      {showOptions && (
        <View style={tw`flex-row gap-x-4 items-center`}>
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/company/edit-employee",
                params: {
                  id: employee.id,
                  name: employee.name,
                  designation: employee.designation,
                  email: employee.email,
                  image: employee.image,
                },
              })
            }
          >
            <FontAwesome5 name="pencil-alt" size={20} color="blue" />
          </Pressable>
          <Pressable
            onPress={() =>
              Alert.alert(
                "Warning",
                `Do you want to delete ${employee.name}?`,
                [
                  {
                    text: "No",
                  },
                  {
                    text: "Yes",
                    onPress: handleDelete,
                  },
                ]
              )
            }
          >
            <FontAwesome5 name="trash" size={20} color="red" />
          </Pressable>
        </View>
      )}
    </Pressable>
  );
};

export default EmployeeCard;
