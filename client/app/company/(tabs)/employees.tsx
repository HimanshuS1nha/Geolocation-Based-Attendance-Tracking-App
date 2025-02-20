import { View, Pressable } from "react-native";
import React from "react";
import tw from "twrnc";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";

import EmployeeCard from "@/components/EmployeeCard";

import type { EmployeeType } from "@/types";

const Employees = () => {
  const dummyEmployees: EmployeeType[] = [
    {
      name: "Random Employee",
      email: "random@employee.com",
      id: "1",
      image:
        "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
      designation: "Full Stack Developer",
    },
    {
      name: "Random Employee 2",
      email: "random@employee.com",
      id: "2",
      image:
        "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg",
      designation: "Product Manager",
    },
  ];
  return (
    <View style={tw`flex-1`}>
      <FlashList
        data={dummyEmployees}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return <EmployeeCard employee={item} />;
        }}
        contentContainerStyle={tw`px-4 pt-4`}
        estimatedItemSize={50}
        numColumns={2}
        showsVerticalScrollIndicator={false}
      />

      <Pressable
        style={tw`absolute bg-emerald-600 bottom-2 right-2 p-2 rounded-lg z-10 shadow shadow-black`}
        onPress={() => router.push("/company/add-employee")}
      >
        <AntDesign name="plus" size={30} color="white" />
      </Pressable>
    </View>
  );
};

export default Employees;
