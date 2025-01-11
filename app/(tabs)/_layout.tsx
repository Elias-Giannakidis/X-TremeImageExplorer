import { Tabs } from 'expo-router';
import React from 'react';
import { type ComponentProps } from 'react';
import { useColorScheme } from 'react-native';
import constants from "../../helpers/const"
import Ionicons from '@expo/vector-icons/Ionicons';
import { type IconProps } from '@expo/vector-icons/build/createIconSet';

export default function TabLayout() {
    const colorScheme = useColorScheme();
    return (
        <Tabs
        screenOptions={{
          tabBarActiveTintColor: constants.COLORS[colorScheme ?? 'light'].tint,
          headerShown: false,
        }}>
            <Tabs.Screen
                name='index'
                options={{
                    title: 'Home',
                    tabBarIcon: ({color, focused}) => (
                        <TabBarIcon name={focused ? 'home' : 'home-outline'} color = {color} />
                    )
                }}
            />

            <Tabs.Screen
                name='ImageExplorer'
                options={{
                    title: 'View',
                    tabBarIcon: ({color, focused}) => (
                        <TabBarIcon name={focused ? 'images' : 'images-outline'} color = {color}/>
                    )
                }}
            />

            <Tabs.Screen 
                name='albums'
                options={{
                    title: 'albums',
                    tabBarIcon: ({color, focused}) => (
                        <TabBarIcon name={focused ? 'albums' : 'albums-outline'} color = {color}/>
                    )
                }}
            />

        </Tabs>
    )
}

function TabBarIcon({ style, ...rest }: IconProps<ComponentProps<typeof Ionicons>['name']>) {
    return <Ionicons size={28} style={[{ marginBottom: -3 }, style]} {...rest} />;
  }