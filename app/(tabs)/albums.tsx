import { StyleSheet, useColorScheme, Text, FlatList, View } from 'react-native';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent, PanGestureHandlerStateChangeEvent, State, TextInput } from 'react-native-gesture-handler';
import { deleteCategory, getAllCategories, insertCategory } from '@/helpers/database.handler';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CategoryInterface } from '@/helpers/interfaces';
import constants from '@/helpers/const';
import Slider from '@react-native-community/slider';


const AlbumsScreen = () => {
  const [categories, setCategories] = useState<CategoryInterface[]>([])
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [clipboard, setClipboard] = useState<{category: string, indexOffset: number}>({category: "", indexOffset: 0})
  const [categoryToBeDeleted, setDeletedCategory] = useState<string>("")
  const [categoryToBeAdded, setNewCategory] = useState<CategoryInterface>({name: "", color: ""})

  let theme = useColorScheme();

  const fetchCategories = async () => {
    if(isLoading) return;

    setIsLoading(true)

    const fetchedCategories = await getAllCategories()

    setCategories(fetchedCategories.map((c) => {return {...c, hovered: false}}))
    setIsLoading(false)
  }

  const Category = (props: CategoryInterface ) => {

    const [position, setPosition] = useState<{x:number, y:number}>({x:0, y:0})
    const [positionOffset, setPositionOffset] = useState<{dx:number,dy:number}>({dx:0, dy:0})
    const [hover, setHovered] = useState<boolean>(false)

    const boxRef = useRef<View>(null) 
    
    const onGestureEvent = (event: PanGestureHandlerGestureEvent ) => {
        setPosition({
            x: event.nativeEvent.translationX - positionOffset.dx,
            y: event.nativeEvent.translationY - positionOffset.dy,
        })
    }

    const onHandlerStateChange = (event: PanGestureHandlerStateChangeEvent) => {
        const { state } = event.nativeEvent;
        switch (state) {
          case State.BEGAN:
            const x = event.nativeEvent.translationX
            const y = event.nativeEvent.translationY
            setPositionOffset({
                dx: x - position.x,
                dy: y - position.y
             })
             setHovered(!hover)
            break;
          case State.END:
            setPosition({x:0, y:0})

            boxRef.current?.measure((x, y, width, height, pageX, pageY) => {
              const dy = event.nativeEvent.translationY - positionOffset.dy
              const offset = Math.floor(dy/(height + 2))
              if(offset >= 0){
                setClipboard({category: props.name, indexOffset: offset})
              } else {
                setClipboard({category: props.name, indexOffset: offset + 1})
              }
              
            })
            
          default:
            break;
        }
    }

    const deleteCategoryHandler = async () => {
      await deleteCategory(props.name)
      console.log(`Delete category ${props.name} pressed`)
      setDeletedCategory(props.name)
    }

    const trashIcon = theme === 'dark' ? "trash" : "trash-outline"
    const styles =  StyleSheet.create({
        view: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 60,
            width: '100%',
            backgroundColor: props.color,
            padding: 3,
            margin: 2,
            borderColor: hover ? "#46a2a3" : constants.COLORS[theme || 'light'].text,
            borderWidth: hover ? 5 : 3,
            borderRadius: 6,
        },
        text: {},
        icon: {
            padding: 10
        }
    })

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
        <View style={[styles.view,{transform: [{translateX: position.x}, {translateY: position.y}]}]} ref={boxRef}>
            <Text>{props.name}</Text>
            <Ionicons size={28} style={styles.icon} name={trashIcon} onPress={deleteCategoryHandler}/>
        </View>
    </PanGestureHandler>
  );
}

const AddCategoryText = () => {

  const [text, setText] = useState<string>('')
  const [isColorPickerVisible, setColorPickerVisible] = useState<boolean>(false)
  const [pickedColor, setColor] = useState<string>('#fff')

  let theme = useColorScheme();
  const colorIcon = theme === 'dark' ? "color-palette" : "color-palette-outline"
  const addIcon = theme === 'dark' ? "add-circle" : "add-circle-outline"

  const typingText = (newText: string) => {
      setText(newText)
  }

  const toggleColorPicker = () => {
      setColorPickerVisible(!isColorPickerVisible)
  }

  const picColor = (colorNumber: number) => {
      const RGB_Order_change = [
        [1, 1, 1],
        [0, 1, 1],
        [0, 1, 0],
        [1, 1, 0],
        [1, 0, 0],
        [1, 0, 1],
        [0, 0, 1],
        [0, 0, 0]
      ]
      const color_level = Math.floor(colorNumber/255)
      const color_offset = colorNumber % 255

      const firstRGB = RGB_Order_change[Math.max(Math.min(color_level,7),0)]
      const secontRGB = RGB_Order_change[Math.max(Math.min(color_level + 1,7),0)]

      const finalRGB = [0, 1, 2].map((pos) => {
        return Math.floor((firstRGB[pos] * (255 - color_offset)) + (secontRGB[pos] * color_offset))
      })

      console.log(`R: ${finalRGB[0]} G: ${finalRGB[1]} B: ${finalRGB[2]}`)

      const hexColor = finalRGB.reduce((hex, value) => {
        const hexValue = value.toString(16).padStart(2, '0')
        hex = `${hex}${hexValue}`
        return hex
      },'#')

      console.log(hexColor)

      setColor(hexColor)
  }

  const addCategory = async () => {
      const category: CategoryInterface = {
          name: text,
          color: pickedColor
      }
      if(category.name != ""){
        await insertCategory(category)
        setText("")
        setColor('#fff')
        setNewCategory(category)
      }
  }

  const styles =  StyleSheet.create({
      view: {
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          height: 60,
          width: '100%',
          backgroundColor: pickedColor,
          borderColor: constants.COLORS[theme || 'light'].text,
          borderWidth: 3,
          borderRadius: 6,
      },
      text: {
          flex: 1,
          fontSize: 18,
          textAlign: 'left',
          width: '70%',
          color: constants.COLORS[theme || 'light'].text,
          padding: 3
      },
      iconView: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: 3,
      },
      icon: {
          margin: 4,
          borderColor: constants.COLORS[theme || 'light'].text,
          borderWidth: 3,
          borderRadius: 4
      },
      container: {
        margin: 10,
      },
      slider: {
        backgroundColor: "#f20a0a",
        borderRadius: 10,
        margin: 8
      }
  })

  return (
    <View style={styles.container}>
      <View style={styles.slider}>
        <Slider 
          minimumValue={0}
          maximumValue={2039}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#FFFFFF"
          onValueChange={(value) => {picColor(value)}}
          step={1}
        />
      </View>
      <View style={styles.view}>
          <TextInput 
              style={styles.text}
              onChangeText={typingText}
              value={text}
              />
          <View style={styles.iconView}>
              <Ionicons size={30} style={styles.icon} name={colorIcon} onPress={toggleColorPicker}/>
              <Ionicons size={30} style={styles.icon} name={addIcon} onPress={addCategory}/>
          </View>
      </View>
    </View>

  )
}

  // Initialization use effect
  useEffect(() => {
    const init = async () => {
        await fetchCategories()
    }
    init()
  },[])

  // Use effect to reorder items
  useEffect(() => {
    const oldIndex = categories.reduce((acc, category, index) => {
      if(category.name === clipboard.category){
        acc = index
      }
      return acc
    },0)

    const newIndex = Math.max(Math.min(oldIndex + clipboard.indexOffset, categories.length - 1),0)

    if(clipboard.indexOffset != 0){
      const movingUp = clipboard.indexOffset < 0
      const newOrder = categories.map((_category, index) => {
        // This areas never chagne the order.
        if(index > Math.max(newIndex, oldIndex) || index < Math.min(newIndex, oldIndex)){
          return index
        }

        if(index === newIndex){
          return oldIndex
        }

        return movingUp ? index - 1 : index + 1

      })
      const newCategories = newOrder.map((i) => {return categories[i]})
      setCategories(newCategories)
    }
    
  },[clipboard])

  // Delete category use effect
  useEffect(() => {
    const newCategories = categories.filter((category) => {return category.name != categoryToBeDeleted})
    setCategories(newCategories)
  },[categoryToBeDeleted])

  // Add new category use effect
  useEffect(() => {
    if(categoryToBeAdded.name != ""){
      categories.push(categoryToBeAdded)
      // setCategories(categories)
    }
  },[categoryToBeAdded])

  const styles = StyleSheet.create({
    view: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      height: '100%',
      width: 'auto',
      backgroundColor: constants.COLORS[theme || 'light'].background,
      borderColor: constants.COLORS[theme || 'light'].text,
      borderWidth: 3,
      borderRadius: 6,
      margin: 8,
      padding: 8
    }
  })

  return (
    <GestureHandlerRootView>
      <View style={styles.view}>
        <AddCategoryText/>
        <FlatList  
            data={categories}
            keyExtractor={(item, index) => `${item.name}-${index}`}
            renderItem={({item}) => (
                <Category name={item.name} color={item.color}></Category>
            )}
            refreshing={isLoading}
        />
      </View>
    </GestureHandlerRootView>
  );
}

export default AlbumsScreen
