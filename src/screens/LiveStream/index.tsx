import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import React, { useEffect, useRef, useState } from 'react';
import { Modal, PermissionsAndroid, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRecoilValue } from 'recoil';
import type { AppRoutes } from '../../navigator/app-routes';
import type { AppStackParamList } from '../../navigator/app.navigator';
import { themeState } from '../../recoil/theme/atoms';
import { NodePlayerView, NodeCameraView } from 'react-native-nodemediaclient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { IconSizes } from '../../theme/Icon';
import IconButton from '../../components/shared/Iconbutton';
import type { ThemeColors } from '../../types/theme';
import LottieView from 'lottie-react-native';
import { useChangeStreamStatusMutation } from '../../graphql/mutations/changeStreamStatus.generated';
import { somethingWentWrongErrorNotification } from '../../helpers/notifications';
import { LiveStreamStatusEnum } from '../../graphql/type.interface';

const LiveStreamScreen: React.FC = () => {
  const {
    params: { streamId, isOwner, viewUrl, streamUrl },
  } = useRoute<RouteProp<AppStackParamList, AppRoutes.LIVE_STREAM_VIEW_SCREEN>>();
  const theme = useRecoilValue(themeState);
  const { goBack } = useNavigation();
  const styles = useStyle(theme);

  const [flash, setFlash] = useState(false);
  const [isLive, setIsLive] = useState(false);

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
      if (
        granted['android.permission.CAMERA'] === 'granted' &&
        granted['android.permission.RECORD_AUDIO'] === 'granted'
      ) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const viewerRef = useRef(null);
  const streamerRef = useRef(null);

  const [changeStatus, { loading: changeLoad }] = useChangeStreamStatusMutation({
    onError: (err) => {
      console.log('change stream status', err);
      somethingWentWrongErrorNotification();
    },
    onCompleted: (res) => {
      if (res.changeStreamStatus.status === LiveStreamStatusEnum.ACTIVE) {
        streamerRef.current.start();
        setIsLive(true);
      } else {
        streamerRef.current.stop();
        setIsLive(false);
        goBack();
      }
    },
  });

  const handleStartStream = () => {
    changeStatus({ variables: { id: streamId, status: LiveStreamStatusEnum.ACTIVE } });
  };

  const handleStopStream = () => {
    if (!isLive) {
      goBack();
    } else {
      changeStatus({ variables: { id: streamId, status: LiveStreamStatusEnum.STOP } });
    }
  };

  return (
    <View style={styles.container}>
      <Modal animationType="fade" visible={changeLoad} transparent>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <LottieView
              style={{ height: 160, width: 160 }}
              source={require('../../assets1/start-stream.json')}
              autoPlay
              loop
            />
            <Text style={{ color: theme.white, fontSize: 16, marginTop: 30 }}>Analyzing stream health...</Text>
          </View>
        </View>
      </Modal>
      {isOwner ? (
        <View style={styles.cameraContainer}>
          <NodeCameraView
            style={{ flex: 1 }}
            ref={streamerRef}
            outputUrl={streamUrl}
            camera={{ cameraId: 1, cameraFrontMirror: true }}
            audio={{ bitrate: 60000, profile: 1, samplerate: 48000 }}
            video={{ preset: 12, bitrate: 720000, profile: 2, fps: 30, videoFrontMirror: false }}
            autopreview={true}
            denose
            smoothSkinLevel={3}
          />
          <View style={styles.cameraHelperContainer}>
            <View style={styles.cameraHelper}>
              <IconButton
                onPress={handleStopStream}
                Icon={() => <MaterialIcons name="close" size={IconSizes.x8} color={theme.white} />}
              />
              {isLive && (
                <LottieView style={{ height: 100 }} source={require('../../assets1/live.json')} autoPlay loop />
              )}
            </View>
            <View style={styles.cameraHelper}>
              <IconButton
                onPress={() => {
                  streamerRef.current.switchCamera();
                }}
                Icon={() => <MaterialIcons name="switch-camera" size={IconSizes.x8} color={theme.white} />}
              />
              {!isLive && (
                <TouchableOpacity onPress={handleStartStream} style={styles.startButtonContainer}>
                  <View style={styles.startButton}>
                    <LottieView source={require('../../assets1/go-live.json')} autoPlay loop />
                  </View>
                </TouchableOpacity>
              )}

              <IconButton
                onPress={() => {
                  setFlash(!flash);
                  streamerRef.current.flashEnable(!flash);
                }}
                Icon={() => (
                  <MaterialIcons name={flash ? 'flash-off' : 'flash-on'} size={IconSizes.x8} color={theme.white} />
                )}
              />
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.cameraContainer}>
          <NodePlayerView
            style={{ height: '100%', width: '100%' }}
            ref={viewerRef}
            inputUrl={viewUrl}
            // scaleMode={'ScaleToFill'}
            bufferTime={100}
            maxBufferTime={300}
            autoplay={true}
          />
          <View style={styles.cameraHelperContainer}>
            <View style={styles.cameraHelper}>
              <IconButton
                onPress={() => {
                  goBack();
                }}
                Icon={() => <MaterialIcons name="close" size={IconSizes.x8} color={theme.white} />}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const useStyle = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.base,
    },
    cameraContainer: {
      flex: 1,
    },
    cameraHelperContainer: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      justifyContent: 'space-between',
      paddingVertical: 44,
      paddingHorizontal: 10,
    },
    cameraHelper: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    startButtonContainer: {
      borderWidth: 4,
      borderRadius: 100,
      borderColor: theme.white,
    },
    startButton: {
      padding: 12,
      backgroundColor: theme.white,
      margin: 2,
      borderRadius: 100,
      width: 60,
      height: 60,
      alignSelf: 'center',
    },
  });

export default LiveStreamScreen;
