import React, { useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { responsiveWidth } from 'react-native-responsive-dimensions'; 
import { useRecoilState, useRecoilValue } from 'recoil';
import Checkbox from 'react-native-modest-checkbox';

import { themeState, themeTypeState } from '../../../recoil/theme/atoms';
import { useNavigation } from '@react-navigation/core';
import type { ThemeColors, ThemeVariantType } from '../../../types/theme';
import { saveThemeType, storage } from '../../../helpers/storage';
import { AppRoutes } from '../../../navigator/app-routes';
import { useApolloClient } from '@apollo/client';
import Typography from '../../../theme/Typography';
import BottomSheetHeader from '../../../components/shared/layout/headers/BottomSheetHeader';
import Option from '../../../components/shared/controls/Option';
import { Theme, ThemeStatic, ThemeVariant } from '../../../theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { IconSizes } from '../../../theme/Icon';

const { FontWeights, FontSizes } = Typography;

interface SettingsBottomSheetProps {
  ref: React.Ref<any>;
  onBlockListPress: () => void;
  onAboutPress: () => void;
}

const SettingsBottomSheet: React.FC<SettingsBottomSheetProps> = React.forwardRef(
  ({ onBlockListPress, onAboutPress }, ref) => {
    const [theme, setTheme] = useRecoilState(themeState);
    const [themeType, setThemeType] = useRecoilState(themeTypeState);

    const [isChecked, setIsChecked] = useState(false);

    // const client = useApolloClient();
    const { navigate } = useNavigation();

    useEffect(() => {
      setIsChecked(themeType === ThemeVariant.dark);
    }, []);

    const onChange = ({ checked }: { checked: boolean }) => {
      if (checked) {
        toggleTheme(ThemeVariant.dark);
      } else {
        toggleTheme(ThemeVariant.light);
      }
      setIsChecked(checked);
    };

    const toggleTheme = async (type: string) => {
      setTheme(Theme[type].colors);
      setThemeType(type);
      await saveThemeType(type);
    };

    // const handleLogout = async () => {
    //   await storage.clearStorage();
    //   client.resetStore().finally(() => {
    //     //
    //   });
    //   navigate(AppRoutes.AUTH);
    // };

    return (
      <Modalize
        ref={ref}
        scrollViewProps={{ showsVerticalScrollIndicator: false }}
        modalStyle={styles(theme).container}
        adjustToContentHeight>
        <BottomSheetHeader heading="Settings" subHeading="Themes and options" />
        <View style={styles().content}>
          <Option label="Blocked users" iconName="ios-list" onPress={onBlockListPress} />
          <Option iconName="ios-color-palette">
            <Checkbox
              labelBefore
              checked={isChecked}
              label="Dark Mode"
              onChange={onChange}
              labelStyle={styles(theme).label}
              checkedComponent={<MaterialIcons name="done" size={IconSizes.x6} color={ThemeStatic.accent} />}
              uncheckedComponent={<MaterialIcons name="done" size={IconSizes.x6} color={ThemeStatic.text02} />}
            />
          </Option>
          <Option label="About" iconName="ios-information-circle-outline" onPress={onAboutPress} />
          <Option label="Logout" iconName="ios-log-out" />
        </View>
      </Modalize>
    );
  },
);

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: theme.base,
    },
    content: {
      paddingTop: 20,
      paddingBottom: 20,
    },
    label: {
      ...FontWeights.Light,
      ...FontSizes.Body,
      width: responsiveWidth(74),
      color: theme.text01,
    },
  });

export default SettingsBottomSheet;
