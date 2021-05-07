import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  OnNewStreamChatSubscriptionResponse,
  useOnNewStreamChatSubscription,
} from '../../graphql/subscriptions/onNewStreamChat.generated';
import { ThemeStatic } from '../../theme';

export type ChatListProps = {
  streamId: number;
  onCloseKeyboard: () => void;
};

const ChatList: React.FC<ChatListProps> = ({ onCloseKeyboard, streamId }) => {
  const [chats, setChats] = useState<OnNewStreamChatSubscriptionResponse['onNewStreamChat'][]>([]);

  useOnNewStreamChatSubscription({
    variables: { streamId },
    onSubscriptionData: ({ subscriptionData }) => {
      if (subscriptionData.error) {
        console.log('sub stream chat', subscriptionData.error);
      } else {
        const temp = [...chats];
        temp.push(subscriptionData.data?.onNewStreamChat as OnNewStreamChatSubscriptionResponse['onNewStreamChat']);
        setChats(temp);
      }
    },
  });

  return (
    <Pressable onPress={onCloseKeyboard} style={styles.container}>
      <FlatList
        nestedScrollEnabled
        data={chats}
        inverted
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30, flexDirection: 'column-reverse' }}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity style={styles.chatItem} onPress={onCloseKeyboard}>
              {item.isSystem ? (
                <Text style={styles.name}>{item.chat}</Text>
              ) : (
                <>
                  <FastImage source={{ uri: item.avatar ?? '' }} style={styles.avatar} />
                  <View>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.chat}>{item.chat}</Text>
                  </View>
                </>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 350,
    marginBottom: 20,
    justifyContent: 'flex-end',
    position: 'relative',
    height: 350,
  },
  chatItem: {
    marginTop: 20,
    flexDirection: 'row',
  },
  avatar: {
    height: 44,
    width: 44,
    borderRadius: 44,
    marginRight: 8,
  },
  name: {
    fontSize: 14,
    color: ThemeStatic.white,
    fontWeight: '600',
  },
  chat: {
    color: ThemeStatic.white,
  },
});

export default ChatList;
