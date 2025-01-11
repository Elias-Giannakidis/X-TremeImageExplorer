import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, useColorScheme, Text, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import FetchImages from './ImageExplorer'
import Category from '@/components/Category';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { getAllCategories } from '@/helpers/database.handler';

const AlbumsScreen = async () => {
  const [categories, setCategories] = useState<{name: string, color: string}[]>([])
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
    fetchCategories()
  },[])

  return (
    <GestureHandlerRootView>
        <FlatList  
            data={categories}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={({item}) => (
                <Category name={item.name} color={item.color}></Category>
            )}
        />
    </GestureHandlerRootView>
  );
}

export default AlbumsScreen
