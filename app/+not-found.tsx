import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, useColorScheme, Text } from 'react-native';
import React from 'react';

const notFoundScreen = () => {
  let colorScheme = useColorScheme();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>Hello</Text>
    </SafeAreaView>
  );
}

export default notFoundScreen