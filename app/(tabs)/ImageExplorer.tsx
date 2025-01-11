import { Text, Image, View, FlatList, useColorScheme, ColorSchemeName, Dimensions, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import React from 'react';
import * as MediaLibrary from 'expo-media-library';
import {getStyle} from "../../styles/fetchImages.styles"
import {initDB, storeNewAssets} from '../../helpers/database.handler'
import constants from "../../helpers/const"
import { PanGestureHandler } from 'react-native-gesture-handler';

const darkMenuIcon = require("../../assets/images/menu_dark.png")
const lightMenuIcon = require("../../assets/images/menu_light.png")

const PAGINATION = constants.PAGINATION

const FetchImages: React.FC = () => {
  let theme = useColorScheme();

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

    await storeNewAssets(assets.assets)

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

  const removeImage = (uri: string) => {
    const newImages = images.filter((image) => {return image != uri})
    setImages(newImages)
  }

  useEffect(() => {
    const init = async () => {
        // initialize the database
        await initDB()

        // Request media library permissions
        const {status} = await MediaLibrary.requestPermissionsAsync();
        if(status != 'granted'){
          console.log("Permission to access media library denied")
          return;
        }
        setPermissionGranted(true)

        // Start fetching images
        fetchImages(null);
    }

    // Fetch initial images
    init()
  },[])

  // Write this text if the permissions are denied
  if (!permissionGranted) {
    return <Text>Permission is required to access images.</Text>;
  }

  // Calculation of image columns
  const screenWidth = Dimensions.get('window').width
  const numColumns = 4
  const styles = getStyle({theme: theme, screenWidth: screenWidth, columns: numColumns})

  const menuIcon = theme === 'dark' ? darkMenuIcon : lightMenuIcon

  const categories: string[] = ["category1", "category2", "Elias Yo", "New Category", "AllCategories", "Zouzouno-category"]
  return (
    <View style={styles.container}>

      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <View style={styles.iconContainer}>
          <Image source={menuIcon} style={styles.menuIcon}/>
        </View>
        <FlatList 
          data={categories}
          // style={styles.navBar} 
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={(item) => (
            <TouchableOpacity onPress={() => console.log(item)} style={styles.navButton}>
             <Text style={styles.navButtonText}>{item.item}</Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={true}
          horizontal={true}
        />
      </View>

      <FlatList
        data={images}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderItem={({ item }) => (
            <TouchableOpacity onPress={() => removeImage(item)}>
                <Image source={{ uri: item }} style={styles.image} />
            </TouchableOpacity>
        )}
        numColumns = {numColumns}
        onEndReached={() => fetchImages(endCursor)} // Load more when reaching the end
        onEndReachedThreshold={0.5} // Trigger when 50% away from the bottom
        refreshing={isLoading}
        ListFooterComponent={
          isLoading ? <Text>Loading more images...</Text> : null
        }
      />
    </View>
  );
}

export default FetchImages

