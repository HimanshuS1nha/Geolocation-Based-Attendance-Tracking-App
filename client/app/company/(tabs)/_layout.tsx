import { Tabs } from "expo-router";
import React from "react";

const CompanyTabsLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="employees" />
    </Tabs>
  );
};

export default CompanyTabsLayout;
