import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, useColorScheme } from 'react-native';
import React from 'react';
import FetchImages from '../components/FetchImages'


const HomeScreen = () => {
  let colorScheme = useColorScheme();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FetchImages theme={colorScheme} />
    </SafeAreaView>
  );
}

export default HomeScreen
