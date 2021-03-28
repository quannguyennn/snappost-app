import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View, StyleProp, TextStyle } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../../../recoil/theme/atoms';
import { Typography } from '../../../../theme';
import type { ThemeColors } from '../../../../types/theme';

const { FontWeights, FontSizes } = Typography;

interface GoBackHeaderProps {
  title?: string;
  onTitlePress?: () => void;
  ContentLeft?: React.FC;
  IconRight?: React.FC;
  iconSize: number;
  titleStyle?: StyleProp<TextStyle>;
  RightComponent?: React.FC;
  notSpaceBetween?: boolean;
  subTitle?: string
}

const GoBackHeader: React.FC<GoBackHeaderProps> = ({
  title,
  onTitlePress,
  ContentLeft,
  IconRight,
  iconSize,
  titleStyle,
  RightComponent,
  notSpaceBetween = false,
  subTitle
}) => {
  const theme = useRecoilValue(themeState);
  const { goBack } = useNavigation();
  const navigateBack = () => goBack();

  return (
    <View style={[styles(theme).container, notSpaceBetween ? { justifyContent: 'flex-start' } : {}]}>
      <Entypo onPress={navigateBack} name="chevron-thin-left" size={iconSize} color={theme.text01} />
      {ContentLeft && <ContentLeft />}
      <View>
        {title && (
          <Text onPress={onTitlePress} style={[styles(theme).title, titleStyle]}>
            {title}
          </Text>
        )}
        {subTitle && (
          <Text style={{ color: theme.text02, ...FontSizes.Caption }}>{subTitle}</Text>
        )}
      </View>

      {IconRight && (
        <View style={{ alignSelf: 'flex-end' }}>
          <IconRight />
        </View>
      )}
    </View>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 10,
    },
    title: {
      ...FontWeights.Bold,
      ...FontSizes.Label,
      color: theme.text01,
      marginLeft: 20,
    },
    underline: {
      marginTop: 16,
      height: 2,
      width: 20,
      borderRadius: 10,
      backgroundColor: theme.text01,
    },
  });

export default GoBackHeader;
