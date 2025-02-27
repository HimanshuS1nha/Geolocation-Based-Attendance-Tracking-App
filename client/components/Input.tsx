import { StyleProp, TextInput, TextInputProps } from "react-native";
import React from "react";
import tw from "twrnc";

const Input = ({
  onChangeText,
  style,
  value,
  placeholder,
  secureTextEntry,
  maxLength,
  keyboardType,
}: {
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  style?: StyleProp<TextInputProps>;
  secureTextEntry?: boolean;
  maxLength?: number;
  keyboardType?: "number-pad";
}) => {
  return (
    <TextInput
      style={[tw`bg-gray-200 px-3 py-5 rounded-lg w-full`, style]}
      value={value}
      placeholder={placeholder}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      maxLength={maxLength}
      keyboardType={keyboardType}
    />
  );
};

export default Input;
