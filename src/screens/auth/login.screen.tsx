import React, { memo, useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Platform, Image } from 'react-native';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import TermsAndConditionsBottomSheet from './components/TermsAndConditionsBottomSheet';
import type { Modalize } from 'react-native-modalize';
import Typography from '../../theme/Typography';
import { Images } from '../../assets1/icons';
import ConfirmationModal from '../../components/shared/ComfirmationModal';
import type { AuthLoginScreenProp } from '../../navigator/auth.navigator';
import { ThemeStatic } from '../../theme';
import type { ThemeColors } from '../../types/theme';
import Button from '../../components/shared/controls/Button';
import ZaloKit, { Constants } from 'react-native-zalo-kit';
import { useLoginWithSnsMutation } from '../../graphql/mutations/loginWithSNS.generated';
import { somethingWentWrongErrorNotification } from '../../helpers/notifications';
import { useUpdateUserInfoMutation } from '../../graphql/mutations/updateUserInfo.generated';
import { themeState } from '../../recoil/theme/atoms';
import { isLoginState } from '../../recoil/auth/atoms';
import { MeDocument } from '../../graphql/queries/me.generated';
import { saveToken } from '../../helpers/storage';
import LottieView from 'lottie-react-native';

const { FontWeights, FontSizes } = Typography;
type Props = {
  navigation: AuthLoginScreenProp;
  route: any;
};

const LoginScreen = memo<Props>(() => {
  const theme = useRecoilValue(themeState);
  const [initializing, setInitializing] = useState<boolean>(true);
  const [termsConfirmationModal, setTermsConfirmationModal] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const setIsLogin = useSetRecoilState(isLoginState);

  const termsAndConditionsBottomSheetRef = useRef<Modalize>(null);

  const [loginWithSns, { loading: loginLoading }] = useLoginWithSnsMutation({
    onCompleted: (res) => {
      if (res.loginWithSNS.user.isNew) {
        termsConfirmationToggle();
      } else {
        setIsLogin(true);
        // navigate(AppRoutes.APP);
      }
    },
    onError: (err) => {
      console.log('loginWithSns', err);
      setIsLogin(false);
      somethingWentWrongErrorNotification();
    },
    update: async (proxy, { data, errors }) => {
      if (data?.loginWithSNS?.user) {
        const user = data?.loginWithSNS?.user;
        await saveToken({
          accessToken: data.loginWithSNS.accessToken ?? '',
          refreshToken: data.loginWithSNS.refreshToken ?? '',
        });
        proxy.writeQuery({
          query: MeDocument,
          data: {
            me: user,
          },
        });
        if (errors) {
          return;
        }
      }
    },
  });

  const [updateUser, { loading: loadingUpdate }] = useUpdateUserInfoMutation({
    onCompleted: (res) => {
      termsConfirmationToggle();
      setIsLogin(true);
    },
    onError: (err) => {
      console.log('updateUser', err);
      setIsLogin(false);
      somethingWentWrongErrorNotification();
    },
  });

  const getApplicationHashKey = async () => {
    try {
      await ZaloKit.getApplicationHashKey();

      /*
      returns: 'application hash key'
    */
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setInitializing(false);
    if (Platform.OS === 'android') {
      getApplicationHashKey();
    }
  }, []);

  const termsConfirmationToggle = () => {
    setTermsConfirmationModal(!termsConfirmationModal);
  };

  const processNewUser = () => {
    updateUser({
      variables: {
        input: {
          isNew: false,
        },
      },
    });
  };

  const handleZaloLogin = async () => {
    try {
      setGoogleLoading(true);

      const oauthCode = await ZaloKit.login(Constants.AUTH_VIA_APP_OR_WEB);
      if (oauthCode) {
        const user = await ZaloKit.getUserProfile();
        loginWithSns({
          variables: {
            input: {
              zaloId: user.id,
              avatarUrl: user.picture.data.url,
              name: user.name,
            },
          },
        });
      }

      setGoogleLoading(false);
    } catch ({ message }) {
      setGoogleLoading(false);
    }
  };

  let content = <LottieView source={require('../../assets1/loading.json')} autoPlay loop />;

  if (!initializing) {
    content = (
      <>
        <View style={styles(theme).content}>
          <Text style={styles(theme).titleText}>Snappost</Text>
          <Text style={styles(theme).subtitleText}>
            Welcome to an open source social media where you are more than a statistics
          </Text>
        </View>
        <View style={styles(theme).banner}>
          <Image source={Images.loginBanner} />
          <View>
            <Button
              Icon={Images.zalo}
              label="Sign in with Zalo"
              onPress={handleZaloLogin}
              containerStyle={styles(theme).loginButton}
              labelStyle={styles(theme).loginButtonText}
              indicatorColor={ThemeStatic.accent}
              loading={googleLoading || loginLoading || loadingUpdate}
            />
            <TouchableOpacity
              // @ts-ignore
              onPress={termsAndConditionsBottomSheetRef.current ? termsAndConditionsBottomSheetRef.current.open : null}
              style={styles(theme).terms}>
              <Text style={styles(theme).termsText}>Terms and conditions</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }

  return (
    <View style={styles(theme).container}>
      {content}
      <TermsAndConditionsBottomSheet ref={termsAndConditionsBottomSheetRef} />
      <ConfirmationModal
        label="Confirm"
        title="Terms and Conditions"
        description={'By clicking confirm you agree to our terms and conditions'}
        color={ThemeStatic.accent}
        isVisible={termsConfirmationModal}
        toggle={termsConfirmationToggle}
        onConfirm={processNewUser}
      />
    </View>
  );
});

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.base,
    },
    content: {
      marginTop: responsiveHeight(8),
      marginHorizontal: 20,
    },
    titleText: {
      ...FontWeights.Bold,
      ...FontSizes.Heading,
      color: theme.text01,
    },
    subtitleText: {
      ...FontWeights.Light,
      ...FontSizes.Label,
      marginTop: 10,
      color: theme.text02,
    },
    banner: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: responsiveHeight(Platform.select({ ios: 10, android: 12 }) || 0),
      paddingBottom: 16,
    },

    loginButton: {
      height: 44,
      width: responsiveWidth(90),
      alignSelf: 'center',
      marginBottom: 10,
      borderWidth: Platform.select({ ios: StyleSheet.hairlineWidth, android: 0.8 }),
      borderColor: theme.accent,
      backgroundColor: theme.base,
    },
    loginButtonText: {
      ...FontWeights.Regular,
      ...FontSizes.Body,
      marginLeft: 10,
      color: theme.text01,
    },
    appleSignIn: {
      height: 44,
      width: responsiveWidth(90),
      marginBottom: 10,
    },
    loadingAppleLogin: {
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
    },
    terms: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    termsText: {
      ...FontWeights.Light,
      ...FontSizes.Body,
      color: theme.text02,
    },
  });
export default LoginScreen;
