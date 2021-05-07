import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  PermissionsAndroid,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRecoilValue } from 'recoil';
import type { AppRoutes } from '../../navigator/app-routes';
import type { AppStackParamList } from '../../navigator/app.navigator';
import { themeState } from '../../recoil/theme/atoms';
import { NodeCameraView } from 'react-native-nodemediaclient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { IconSizes } from '../../theme/Icon';
import IconButton from '../../components/shared/Iconbutton';
import type { ThemeColors } from '../../types/theme';
import LottieView from 'lottie-react-native';
import { useChangeStreamStatusMutation } from '../../graphql/mutations/changeStreamStatus.generated';
import { somethingWentWrongErrorNotification } from '../../helpers/notifications';
import { LiveStreamStatusEnum } from '../../graphql/type.interface';
import Video from 'react-native-video';
import moment, { Moment } from 'moment';
import { ThemeStatic } from '../../theme';
import { useJoinStreamMutation } from '../../graphql/mutations/joinStream.generated';
import { useLeaveStreamMutation } from '../../graphql/mutations/leaveStream.generated';
import { useOnJoinStreamSubscription } from '../../graphql/subscriptions/onJoinStream.generated';
import { useOnLeaveStreamSubscription } from '../../graphql/subscriptions/onLeaveStream.generated';
import ChatList from './ChatList';
import { useSendStreamChatMutation } from '../../graphql/mutations/sendStreamChat.generated';

const LiveStreamScreen: React.FC = () => {
  const {
    params: { streamId, isOwner, viewUrl, streamUrl },
  } = useRoute<RouteProp<AppStackParamList, AppRoutes.LIVE_STREAM_VIEW_SCREEN>>();
  const theme = useRecoilValue(themeState);
  const { goBack } = useNavigation();
  const styles = useStyle(theme);

  const [flash, setFlash] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [startTime, setStartTime] = useState<Moment>();
  const [currentTime, setCurrentTime] = useState<Moment>();
  const [viewer, setViewer] = useState<number[]>([]);
  const [focus, setFocus] = useState(false);
  const [chat, setChat] = useState('');

  const [join] = useJoinStreamMutation({
    onError: (err) => console.log('join stream', err),
  });

  const [leave] = useLeaveStreamMutation({
    onError: (err) => console.log('leave stream', err),
    onCompleted: () => {
      goBack();
    },
  });

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
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
    }
  };

  useEffect(() => {
    if (!isOwner) {
      join({ variables: { id: streamId } });
    }
  }, [streamId, join, isOwner]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestCameraPermission();
    }
  }, []);

  useEffect(() => {
    let timeout: number;
    if (isLive) {
      timeout = setTimeout(() => {
        setCurrentTime(moment(currentTime)?.add(1, 'second'));
      }, 1000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [isLive, currentTime]);

  const viewerRef = useRef(null);
  const streamerRef = useRef(null);

  const [changeStatus, { loading: changeLoad }] = useChangeStreamStatusMutation({
    onError: (err) => {
      console.log('change stream status', err);
      somethingWentWrongErrorNotification();
    },
    onCompleted: (res) => {
      if (res.changeStreamStatus.status === LiveStreamStatusEnum.ACTIVE) {
        streamerRef?.current?.start();
        setStartTime(moment());
        setCurrentTime(moment());
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

  useOnJoinStreamSubscription({
    variables: { streamId },
    fetchPolicy: 'no-cache',
    onSubscriptionData: ({ subscriptionData }) => {
      if (subscriptionData.error) {
        console.log('sub join stream', subscriptionData.error);
      } else {
        const temp = [...viewer];
        temp.push(subscriptionData.data?.onJoinStream?.userId ?? 0);
        setViewer(temp);
        if (isOwner) {
          sendChat({
            variables: {
              streamId,
              isSystem: true,
              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
              chat: `${subscriptionData.data?.onJoinStream?.name ?? ''} has join the stream`,
            },
          });
        }
      }
    },
  });

  useOnLeaveStreamSubscription({
    variables: { streamId },
    fetchPolicy: 'no-cache',
    onSubscriptionData: ({ subscriptionData }) => {
      if (subscriptionData.error) {
        console.log('sub leave stream', subscriptionData.error);
      } else {
        const temp = [...viewer];
        for (let i = 0; i < temp.length; i++) {
          if (temp[i] === subscriptionData.data?.onLeaveStream.userId) {
            temp.splice(i, 1);
            break;
          }
        }
        setViewer(temp);
      }
    },
  });

  const onCloseKeyboard = () => {
    setFocus(false);
    Keyboard.dismiss();
  };

  const [sendChat] = useSendStreamChatMutation({
    onError: (err) => {
      console.log('stream chat', err);
    },
    onCompleted: () => {
      setFocus(false);
      setChat('');
      Keyboard.dismiss();
    },
  });

  const handleSendChat = () => {
    if (chat.trim() !== '') {
      sendChat({ variables: { streamId, chat, isSystem: false } });
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Modal animationType="fade" visible={changeLoad} transparent>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' }}>
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
            style={{ height: '100%' }}
            ref={streamerRef}
            outputUrl={streamUrl}
            camera={{ cameraId: 1, cameraFrontMirror: true }}
            audio={{ bitrate: 60000, profile: 1, samplerate: 48000 }}
            video={{ preset: 12, bitrate: 720000, profile: 2, fps: 30, videoFrontMirror: false }}
            autopreview={true}
            denose
            smoothSkinLevel={3}
          />

          <Pressable
            onPress={() => {
              setFocus(false);
              Keyboard.dismiss();
            }}
            style={styles.cameraHelperContainer}>
            <View style={styles.cameraHelper}>
              <View>
                <IconButton
                  style={{ marginBottom: 24 }}
                  onPress={handleStopStream}
                  Icon={() => <MaterialIcons name="close" size={IconSizes.x8} color={theme.white} />}
                />
                <IconButton
                  style={{ marginBottom: 24 }}
                  onPress={() => {
                    setFlash(!flash);
                    streamerRef.current.flashEnable(!flash);
                  }}
                  Icon={() => (
                    <MaterialIcons name={flash ? 'flash-off' : 'flash-on'} size={IconSizes.x8} color={theme.white} />
                  )}
                />
                <IconButton
                  onPress={() => {
                    streamerRef.current.switchCamera();
                  }}
                  Icon={() => <MaterialIcons name="switch-camera" size={IconSizes.x8} color={theme.white} />}
                />
              </View>

              {isLive && (
                <View style={{ flexDirection: 'row' }}>
                  <View style={styles.liveText}>
                    <Text style={{ color: theme.white }}>{`LIVE | ${moment(currentTime?.diff(startTime)).format(
                      'mm:ss',
                    )}`}</Text>
                  </View>

                  <View style={styles.watching}>
                    <MaterialIcons name={'remove-red-eye'} size={IconSizes.x3} color={theme.white} />
                    <Text style={{ color: ThemeStatic.white, marginLeft: 4 }}>{viewer.length}</Text>
                  </View>
                </View>
              )}
            </View>
            <View style={isLive ? { alignSelf: 'center', width: '100%' } : { alignSelf: 'center' }}>
              {!isLive ? (
                <TouchableOpacity onPress={handleStartStream} style={styles.startButtonContainer}>
                  <View style={styles.startButton}>
                    <LottieView source={require('../../assets1/go-live.json')} autoPlay loop />
                  </View>
                </TouchableOpacity>
              ) : (
                <View
                  style={{
                    paddingBottom: focus ? 28 : 0,
                    width: '100%',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                  }}>
                  <ChatList streamId={streamId} onCloseKeyboard={onCloseKeyboard} />
                  <View style={styles.inputContainer}>
                    <TextInput
                      value={chat}
                      onFocus={() => setFocus(true)}
                      placeholderTextColor={theme.white}
                      placeholder="Talk something..."
                      style={styles.input}
                      onChangeText={(text) => setChat(text)}
                    />
                    <TouchableOpacity onPress={handleSendChat}>
                      <MaterialIcons name="send" size={IconSizes.x6} color={theme.white} />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </Pressable>
        </View>
      ) : (
        <View style={styles.playerContainer}>
          <Video
            source={{ uri: viewUrl }}
            style={{ height: Dimensions.get('window').height }}
            ref={viewerRef}
            muted={false}
            volume={10}
            resizeMode="cover"
            controls={false}
            ignoreSilentSwitch={'ignore'}
          />
          <Pressable
            onPress={() => {
              setFocus(false);
              Keyboard.dismiss();
            }}
            style={styles.cameraHelperContainer}>
            <View style={styles.cameraHelper}>
              <IconButton
                onPress={() => {
                  leave({ variables: { id: streamId } });
                }}
                Icon={() => <MaterialIcons name="close" size={IconSizes.x8} color={theme.white} />}
              />
            </View>
            <View style={{ alignSelf: 'center', width: '100%' }}>
              <View
                style={{
                  paddingBottom: focus ? 28 : 0,
                  width: '100%',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                }}>
                <ChatList streamId={streamId} onCloseKeyboard={onCloseKeyboard} />
                <View style={styles.inputContainer}>
                  <TextInput
                    value={chat}
                    onFocus={() => setFocus(true)}
                    placeholderTextColor={theme.white}
                    placeholder="Talk something..."
                    style={styles.input}
                    onChangeText={(text) => setChat(text)}
                  />
                  <TouchableOpacity onPress={handleSendChat}>
                    <MaterialIcons name="send" size={IconSizes.x6} color={theme.white} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Pressable>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const useStyle = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: ThemeStatic.black,
    },
    playerContainer: {
      flex: 1,
      justifyContent: 'flex-start',
    },
    cameraContainer: {
      flex: 1,
    },
    liveText: {
      backgroundColor: 'red',
      color: theme.white,
      paddingVertical: 4,
      borderRadius: 3,
      width: 110,
      alignItems: 'center',
      justifyContent: 'center',
    },
    watching: {
      backgroundColor: ThemeStatic.translucent,
      paddingVertical: 4,
      borderRadius: 3,
      marginLeft: 6,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      width: 50,
    },
    cameraHelperContainer: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      justifyContent: 'space-between',
      paddingVertical: 20,
      paddingHorizontal: 10,
      zIndex: 10,
    },
    cameraHelper: {
      flexDirection: 'row-reverse',
      alignItems: 'flex-start',
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
    inputContainer: {
      width: '100%',
      borderColor: theme.white,
      borderWidth: 1,
      borderRadius: 24,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 8,
      height: 50,
    },
    input: {
      width: '90%',
      color: theme.white,
      height: '100%',
    },
  });

export default LiveStreamScreen;
