import { Text, Image, View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, useColorScheme } from 'react-native';
import { useEffect, useState } from 'react';
import React from 'react';
import * as MediaLibrary from 'expo-media-library';

const FetchImages = () => {
  const [images, setImages] = useState<string[]>([])
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false)

  useEffect(() => {
    const fetchImages = async () => {
      // Request media library permissions
      const {status} = await MediaLibrary.requestPermissionsAsync();
      if(status != 'granted'){
        console.log("Permission to access media library denied")
        return;
      }
      setPermissionGranted(true)

      // Fetch all assets (images)
      const assets = await MediaLibrary.getAssetsAsync({
        mediaType: MediaLibrary.MediaType.photo, // Fetch only photos
      });

      // Map URIs from assets
      const imageUris = assets.assets.map(asset => asset.uri);
      setImages(imageUris);

    }

    fetchImages();
  },[])

  // Write this text if the permissions are denied
  if (!permissionGranted) {
    return <Text>Permission is required to access images.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text>Image URIs:</Text>
      <FlatList
        data={images}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.image} />
        )}
      />
    </View>
  );
}

const HomeScreen = () => {
  let colorScheme = useColorScheme();
  const favicon = require("../assets/images/favicon.png");
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: 200,
    height: 200,
    margin: 5
  }
})
