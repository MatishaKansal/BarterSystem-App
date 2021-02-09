import * as React from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { createDrawerNavigator } from "react-navigation-drawer";
import { AppTabNavigator } from "./AppTabNavigator";
import CustomSideBarMenu from "./CustomSideBarMenu";
import SettingsScreen from "../screens/SettingsScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import MyBartersScreen from "../screens/MyBartersScreen";

export const AppDrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: AppTabNavigator,
    },
    Settings: {
      screen: SettingsScreen,
    },
    My_Barters: {
      screen: MyBartersScreen,
    },
  },
  {
    contentComponent: CustomSideBarMenu,
  },
  {
    initialRouteName: "Home",
  }
);
