import { View, Text, Modal } from "react-native";
import React, { useState } from "react";
import tw from "twrnc";
import { Picker } from "@react-native-picker/picker";

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
  return (
    <Modal visible={isVisible} animationType="fade" transparent>
      <View style={tw`flex-1 bg-gray-100/50`}>
        <View style={tw`bg-white shadow shadow-black items-center p-4 gap-y-6`}>
          <Text style={tw`text-2xl text-indigo-600 font-semibold`}>
            Filters
          </Text>

          <View style={tw`w-full rounded-full border border-black`}>
            <Picker
              mode="dropdown"
              onValueChange={(value: string) => setValue(value)}
              selectedValue={value}
            >
              <Picker.Item label="Select a designation" value={""} />
              <Picker.Item
                label="Full Stack Developer"
                value={"Full Stack Developer"}
              />
              <Picker.Item label="Product Manager" value={"Product Manager"} />
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
        </View>
      </View>
    </Modal>
  );
};

export default EmployeesFiltersModal;
