import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import TabIcon from './TabIcon';
import { useRecoilValue } from 'recoil';
import { AppRoutes } from '../app-routes';
import { themeState } from '../../recoil/theme/atoms';
import type { ThemeColors } from '../../types/theme';

const TabBarComponent = ({ navigation, descriptors, state, ...data }: any) => {
  const theme = useRecoilValue(themeState);

  return (
    <View style={styles(theme).container}>
      {state &&
        state.routes &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        state?.routes?.map((key: any, index: number) => {
          const isFocused = state.index === index;
          return (
            <>
              <TouchableOpacity
                key={'bottom-tab' + index.toString()}
                activeOpacity={0.95}
                style={styles().icon}
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                onPress={() => navigation?.navigate(key)}>
                <TabIcon route={key.name} isActive={isFocused} />
              </TouchableOpacity>
              {index === 1 ? (
                <TouchableOpacity
                  key={'bottom-tab-create' + index.toString()}
                  activeOpacity={0.95}
                  style={styles().icon}
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                  onPress={() => navigation?.navigate(AppRoutes.UPLOAD_STACK)}>
                  <TabIcon route={AppRoutes.UPLOAD_TAB} isActive={isFocused} />
                </TouchableOpacity>
              ) : null}
            </>
          );
        })}
    </View>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
      paddingVertical: 12,
      backgroundColor: theme.base,
    },
    icon: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default TabBarComponent;
