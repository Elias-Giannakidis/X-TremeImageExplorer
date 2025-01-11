import React, { useEffect, useRef, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import {StyleSheet, View, Text, useColorScheme} from 'react-native'
import constants from '../helpers/const'
import { GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent, PanGestureHandlerStateChangeEvent, State } from "react-native-gesture-handler";
import {CategoryInterface} from "../helpers/interfaces"


const Category = (props: CategoryInterface) => {

    const [position, setPosition] = useState<{x:number, y:number}>({x:0, y:0})
    const [positionOffset, setPositionOffset] = useState<{dx:number,dy:number}>({dx:0, dy:0})

    const ViewRef: React.MutableRefObject<any> = useRef(null)

    const onGestureEvent = (event: PanGestureHandlerGestureEvent ) => {
        setPosition({
            x: event.nativeEvent.absoluteX - positionOffset.dx,
            y: event.nativeEvent.absoluteY - positionOffset.dy,
        })
    }

    const onHandlerStateChange = (event: PanGestureHandlerStateChangeEvent) => {
        const { state } = event.nativeEvent;
        if (state === State.BEGAN) {
            const x = event.nativeEvent.absoluteX
            const y = event.nativeEvent.absoluteY
            setPositionOffset({
                dx: x - position.x,
                dy: y - position.y
             })
        };
    }

    let theme = useColorScheme();

    const colorIcon = theme === 'dark' ? "color-palette" : "color-palette-outline"
    const styles =  StyleSheet.create({
        view: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 60,
            width: 160,
            backgroundColor: props.color,
            padding: 3,
            margin: 2,
            borderColor: constants.COLORS[theme || 'light'].text,
            borderWidth: 3,
            borderRadius: 6,
        },
        text: {},
        icon: {
            padding: 10
        }
    })

  return (
    <GestureHandlerRootView>
        <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
            <View style={[styles.view,{transform: [{translateX: position.x}, {translateY: position.y}]}]} ref={ViewRef}>
                <Text>{props.name}</Text>
                <Ionicons size={28} style={styles.icon} name={colorIcon} />;
            </View>
        </PanGestureHandler>
    </GestureHandlerRootView>
  );
}

export default Category


