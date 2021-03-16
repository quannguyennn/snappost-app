import React, { useContext } from 'react';
import { Image, Linking, StyleSheet, Text, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { ThemeStatic, Typography } from '../../../theme';
import Button from '../../../components/shared/controls/Button';
import BottomSheetHeader from '../../../components/shared/layout/headers/BottomSheetHeader';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../../recoil/theme/atoms';
import type { ThemeColors } from '../../../types/theme';

const { FontWeights, FontSizes } = Typography;
// const {
//   author: { url },
//   repository,
//   version,
// } = Config;

// @ts-ignore
const AboutAction = ({ iconName, label, onPress }) => {
  const theme = useRecoilValue(themeState);

  const Icon = () => <AntDesign name={iconName} size={20} color={ThemeStatic.accent} />;

  return (
    <Button
      loading={false}
      Icon={Icon}
      label={label}
      onPress={onPress}
      labelStyle={styles(theme).aboutActionLabel}
      containerStyle={styles(theme).aboutActionContainer}
    />
  );
};

interface AboutBottomSheetProps {
  ref: React.Ref<any>;
}

const AboutBottomSheet: React.FC<AboutBottomSheetProps> = React.forwardRef((_, ref) => {
  const theme = useRecoilValue(themeState);

  const openLink = (url: string) => {
    try {
      Linking.openURL(url);
    } catch {}
  };

  return (
    <Modalize
      //@ts-ignore
      ref={ref}
      scrollViewProps={{ showsVerticalScrollIndicator: false }}
      modalStyle={styles(theme).container}
      adjustToContentHeight>
      <BottomSheetHeader heading="About" subHeading="About Proximity" />
      <View style={styles().content}>
        <Image source={require('../../../assets/images/proximity-logo.png')} style={styles().logoImage} />
        {/*<Text style={styles(theme).versionText}>{version}</Text>*/}
        <Text style={styles(theme).aboutText}>
          Snappost is an Open Source social media app I designed and developed in my free time, this app is fully open
          source and doesn't use your data against you in any shape or form. The code for mobile apps is open-source on
          Github.
        </Text>
        <Text style={styles(theme).aboutText}>
          Curious how I build this? which tech stack I used? Feel free to leave me message, I'm always excited to talk
          about new technologies with new people
        </Text>

        <View style={styles().actions}>
          <AboutAction iconName="link" label="Contact me" onPress={() => null} />

          <AboutAction iconName="github" label="Source code" onPress={() => null} />
        </View>
      </View>
    </Modalize>
  );
});

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: theme.base,
      marginTop: responsiveHeight(8),
    },
    content: {
      flex: 1,
      paddingTop: 20,
      marginBottom: responsiveHeight(10),
    },
    logoImage: {
      resizeMode: 'contain',
      height: 40,
      width: '100%',
      marginTop: 20,
      marginBottom: 10,
      alignSelf: 'center',
    },
    versionText: {
      ...FontWeights.Light,
      ...FontSizes.Label,
      alignSelf: 'center',
      color: theme.text02,
    },
    aboutText: {
      ...FontWeights.Light,
      ...FontSizes.Body,
      marginVertical: 20,
      alignSelf: 'center',
      textAlign: 'justify',
      color: theme.text01,
    },
    actions: {
      marginTop: 10,
    },
    aboutActionLabel: {
      marginLeft: 10,
      color: theme.accent,
    },
    aboutActionContainer: {
      marginVertical: 10,
      backgroundColor: 'transparent',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.accent,
    },
  });

export default AboutBottomSheet;
