
import constants from '../helpers/const';
import {ColorSchemeName, FlexAlignType, StyleSheet} from 'react-native'

export const getStyle = (props: {theme: ColorSchemeName, screenWidth: number, columns: number}) => {
  const colors = props.theme === 'dark' ? constants.COLORS.dark : constants.COLORS.light

  const margin = 5
  const imageSideDimension = Math.floor(props.screenWidth / props.columns) - 2 * margin

  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background
    },
    image: {
      width: imageSideDimension,
      height: imageSideDimension,
      margin: margin,
      borderRadius: 8
    },
    navBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 80,
      backgroundColor: colors.background,
      padding: 3,
      margin: 2,
      borderColor: colors.text,
      borderWidth: 3,
      borderRadius: 6,
    },
    navButton: {
      padding: 10
    },
    navButtonText: {
      color: colors.text,
      fontSize: 16,
    },
    menuIcon: {
      width: 60,
      height: 60,
    },
    iconContainer: {
      padding: 2,
      borderColor: colors.text,
      borderWidth: 3,
      borderRadius: 6,
      backgroundColor: '#fff'
    }
  })
}

