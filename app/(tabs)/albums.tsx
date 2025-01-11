import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, useColorScheme, Text, FlatList, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import FetchImages from './ImageExplorer'
import Category from '@/components/Category';
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import { getAllCategories } from '@/helpers/database.handler';

const AlbumsScreen = () => {
  const [categories, setCategories] = useState<{name: string, color: string}[]>([])
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  let colorScheme = useColorScheme();

  const fetchCategories = async () => {
    if(isLoading) return;

    setIsLoading(true)

    const fetchedCategories = await getAllCategories()

    setCategories(fetchedCategories)
    setIsLoading(false)
  }

  useEffect(() => {
    const init = async () => {
        await fetchCategories()
    }
    init()
  },[])

  return (
    <GestureHandlerRootView>
        <FlatList  
            data={categories}
            keyExtractor={(item, index) => `${item.name}-${index}`}
            renderItem={({item}) => (
                <Category name={item.name} color={item.color}></Category>
            )}
            refreshing={isLoading}
        />
    </GestureHandlerRootView>
  );
}

export default AlbumsScreen
