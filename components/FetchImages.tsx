import { Text, Image, View, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import React from 'react';
import * as MediaLibrary from 'expo-media-library';
import {styles} from "../styles/fetchImages"
import {getAllAssets, initDB, storeNewAssets} from '../helpers/ImageStorage.helper'

const PAGINATION = 50

const FetchImages = () => {
  const [images, setImages] = useState<string[]>([])
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false)

  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchImages = async (after: string | null) => {
    // Check fetching images is needed
    if(!hasNextPage || isLoading) return;

    // Set the images are loading because that fetch images do.
    setIsLoading(true)

    // Fetch assets with pagination
    const assets = await MediaLibrary.getAssetsAsync({
      mediaType: MediaLibrary.MediaType.photo,
      first: PAGINATION, // Fetch pagination images per request
      after: after !== null ? after : undefined, // Use the cursor for pagination
    });

    // Update the state with new images
    const newImageUris: string[] = assets.assets.map(asset => asset.uri);

    // Remove duplication
    const newImageUniqueUris: string[] = newImageUris.reduce((acc, uri) => {
      // Check if the uri exists in the new images array
      const uriExistsInNewImages = acc.some((element: string) => element === uri)
      // Check if the uri exists in the old images array
      const uriExistInPreviousImages = images.some((element: string) => element === uri)
      // Push the unique image uris
      acc = !uriExistsInNewImages && !uriExistInPreviousImages ? [...acc, uri] : acc
      return acc
    },[] as string[])

    setImages(prevImages => [...prevImages, ...newImageUniqueUris]);

    // Update the cursor and pagination state
    setEndCursor(assets.endCursor);
    setHasNextPage(assets.hasNextPage);

    // The images have stoped been loading.
    setIsLoading(false);

  }

  useEffect(() => {
    const init = async () => {

        await initDB()

        // Request media library permissions
        const {status} = await MediaLibrary.requestPermissionsAsync();
        if(status != 'granted'){
          console.log("Permission to access media library denied")
          return;
        }
        setPermissionGranted(true)

        fetchImages(null);
    }

    // Fetch initial images
    init()
  },[])

  // Write this text if the permissions are denied
  if (!permissionGranted) {
    return <Text>Permission is required to access images.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text >Image Gallery</Text>
      <FlatList
        data={images}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.image} />
        )}
        numColumns = {1}
        onEndReached={() => fetchImages(endCursor)} // Load more when reaching the end
        onEndReachedThreshold={0.5} // Trigger when 50% away from the bottom
        ListFooterComponent={
          isLoading ? <Text>Loading more images...</Text> : null
        }
      />
    </View>
  );
}

export default FetchImages

