import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, useColorScheme } from 'react-native';
import React from 'react';
import FetchImages from '../components/FetchImages'

const HomeScreen = () => {
  // TODO find a different way for themes.
  let colorScheme = useColorScheme();
  if(colorScheme === 'dark'){
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <>
        <FetchImages />
        </>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FetchImages />
    </SafeAreaView>
  );
}

export default HomeScreen
