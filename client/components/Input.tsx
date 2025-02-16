import { StyleProp, TextInput, TextInputProps } from "react-native";
import React from "react";
import tw from "twrnc";

const Input = ({
  onChangeText,
  style,
  value,
  placeHolder,
  secureTextEntry,
}: {
  value: string;
  placeHolder: string;
  onChangeText: (text: string) => void;
  style?: StyleProp<TextInputProps>;
  secureTextEntry?: boolean;
}) => {
  return (
    <TextInput
      style={[tw`bg-gray-200 px-3 py-5 rounded-lg`, style]}
      value={value}
      placeholder={placeHolder}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
    />
  );
};

export default Input;
