import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text } from 'react-native';
import DefaultNavigator from './src/navigation/DefaultNavigator';
import NavigationAdmin from './src/navigation/NavigationAdmin';
import NavigationBarbero from './src/navigation/NavigationBarbero';
import NavigationUsuario from './src/navigation/NavigationUsuario';
import useAuth from './src/hooks/useAuth';
import { AuthProvider } from './src/contexts/AuthContext';
import FlashMessage from 'react-native-flash-message';
import Constants from 'expo-constants';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <FlashMessage position="top" style={{ paddingTop: Constants.statusBarHeight }} />
          <MainNavigator />
        </NavigationContainer>
      </GestureHandlerRootView>
    </AuthProvider>
  );
};

function MainNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Loading...</Text>
    </View>
  );

  if (!user) return <DefaultNavigator />;

  switch (user.role) {
    case 1:
      return <NavigationAdmin />;
    case 2:
      return <NavigationBarbero />;
    case 3:
      return <NavigationUsuario />;
    default:
      return <DefaultNavigator />;
  }
}
