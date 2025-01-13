import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, useColorScheme, Text } from 'react-native';
import React from 'react';
import FetchImages from './ImageExplorer'

const HomeScreen = () => {

  const style = StyleSheet.create({
    text: {
      fontSize: 85,
      marginTop: 60,
      color: '#f0c7dd',
    }
  })
  let colorScheme = useColorScheme();
  return (
    <SafeAreaView >
      <Text style={style.text}>Welcome</Text>
    </SafeAreaView>
  );
}

export default HomeScreen
