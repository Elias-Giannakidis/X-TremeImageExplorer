
import constants from '../const';
import {ColorSchemeName, FlexAlignType, StyleSheet} from 'react-native'

export const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: constants.COLORS.dark.background
  },
  image: {
    width: 120,
    height: 120,
    margin: 5,
    borderRadius: 8
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 50,
    backgroundColor: constants.COLORS.dark.background
  },
  navButton: {
    padding: 10
  },
  navButtonText: {
    color: constants.COLORS.dark.text,
    fontSize: 16,
  }
})

export const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: constants.COLORS.light.background
  },
  image: {
    width: 120,
    height: 120,
    margin: 5,
    borderRadius: 8
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 50,
    backgroundColor: constants.COLORS.light.background
  },
  navButton: {
    padding: 10
  },
  navButtonText: {
    color: constants.COLORS.light.text,
    fontSize: 16,
  }
})


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
      justifyContent: 'space-around',
      alignItems: 'flex-start',
      height: 50,
      width: '100%',
      backgroundColor: colors.background
    },
    navButton: {
      padding: 10
    },
    navButtonText: {
      color: colors.text,
      fontSize: 16,
    }
  })
}

