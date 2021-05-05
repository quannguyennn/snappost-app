import React, { useRef } from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NodePlayerView, NodeCameraView } from 'react-native-nodemediaclient';

const Test = () => {
  return (
    <View style={{ flex: 1 }}>
      <NodePlayerView
        style={{ height: 200, width: 200, backgroundColor: 'red' }}
        ref={ref1}
        inputUrl={'https://stream.mux.com/b3D5DvMh01SbNEw1wsoXmfA0102om4dJEdKuXYQ6wMkzms.m3u8'}
        scaleMode={'ScaleAspectFit'}
        bufferTime={300}
        maxBufferTime={1000}
        autoplay={true}
      />
      <View style={{ marginTop: 20 }} />
      <NodeCameraView
        style={{ height: 200 }}
        ref={ref2}
        outputUrl={'rtmps://global-live.mux.com:443/app/e408f4c9-e8c4-8e37-a453-9a310dbb1340'}
        camera={{ cameraId: 1, cameraFrontMirror: true }}
        audio={{ bitrate: 32000, profile: 1, samplerate: 44100 }}
        video={{ preset: 12, bitrate: 400000, profile: 1, fps: 15, videoFrontMirror: false }}
        autopreview={true}
      />
      <TouchableOpacity
        style={{ marginTop: 20, padding: 10, backgroundColor: 'red' }}
        onPress={() => ref2.current.start()}>
        <Text>Start</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ marginTop: 20, padding: 10, backgroundColor: 'red' }}
        onPress={() => ref2.current.stop()}>
        <Text>Stop</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Test;
