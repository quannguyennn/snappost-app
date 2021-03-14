import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { Text, SafeAreaView } from 'react-native';
import { ProfileStackParamList } from '../../navigator/profile.navigator';
import { AppRoutes } from '../../navigator/app-routes';

const SettingScreen = React.memo(() => {
  const { params } = useRoute<RouteProp<ProfileStackParamList, AppRoutes.SETTING>>();
  return (
    <SafeAreaView>
      <Text>{params?.name}</Text>
    </SafeAreaView>
  );
});

export default SettingScreen;
