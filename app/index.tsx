import { Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appearance, useColorScheme } from 'react-native';


const favicon = require("../assets/images/favicon.png");

export default function HomeScreen() {
  let colorScheme = useColorScheme();
  if(colorScheme === 'dark'){
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Text>This is the dark mode</Text>
        <Image source={favicon}/>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>Content is in safe area.</Text>
      <Image source={favicon}/>
    </SafeAreaView>
  );
}
