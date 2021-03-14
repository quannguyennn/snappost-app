import { useMemo } from 'react';
import { Dimensions } from 'react-native';

const useDimensions = () =>
  useMemo(() => {
    const windowHeight = Dimensions.get('window').height;
    const windowWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('screen').height;
    const screenWidth = Dimensions.get('screen').width;
    return { windowHeight, windowWidth, screenHeight, screenWidth };
  }, []);

export default useDimensions;
