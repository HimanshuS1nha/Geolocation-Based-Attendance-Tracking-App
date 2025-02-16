import { Text, Pressable, StyleProp, PressableProps } from "react-native";
import React from "react";
import tw from "twrnc";

const Button = ({
  variant = "default",
  textSize = "default",
  disabled,
  children,
  onPress,
  style,
}: {
  variant?: "default" | "outline";
  textSize?: "default" | "sm";
  disabled?: boolean;
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<PressableProps>;
}) => {
  return (
    <Pressable
      style={[
        tw`${
          variant === "default"
            ? disabled
              ? "bg-indigo-400"
              : "bg-indigo-600"
            : disabled
            ? "border border-indigo-400"
            : "border border-indigo-600"
        } items-center justify-center w-full py-3 rounded-full`,
        style,
      ]}
      disabled={disabled}
      onPress={onPress}
    >
      <Text
        style={tw`${
          variant === "default" ? "text-white" : "text-indigo-600"
        } font-medium ${textSize === "default" ? "text-base" : "text-sm"}`}
      >
        {disabled ? "Please wait..." : children}
      </Text>
    </Pressable>
  );
};

export default Button;
