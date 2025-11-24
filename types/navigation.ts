import { NavigatorScreenParams } from '@react-navigation/native';

export type BottomTabParamList = {
  Home: undefined;
  Download: undefined;
  Library: undefined;
};

export type RootStackParamList = {
  BottomTabs: NavigatorScreenParams<BottomTabParamList>;
};
