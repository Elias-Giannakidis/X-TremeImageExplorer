
import constants from '../const';
import {StyleSheet} from 'react-native'

export const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: constants.COLORS.dark.background
  },
  image: {
    width: 150,
    height: 150,
    margin: 5,
    // borderRadius: '8px'
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
    width: 150,
    height: 150,
    margin: 5,
    // borderRadius: '8px'
  }
})
