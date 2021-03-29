import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Bubble, BubbleProps, IMessage } from 'react-native-gifted-chat';
import posed, { Transition } from 'react-native-pose';
import { useCurrentUser } from '../../../hooks/useCurrentUser';
import { themeState } from '../../../recoil/theme/atoms';
import { ThemeStatic } from '../../../theme';

const TransitionBubble = posed.View({
  enter: { opacity: 1, x: 0 },
  exit: { opacity: 0.5, x: ({ offset }: any) => offset },
});

const CustomBubble: React.FC = (bubbleProps: any) => {
  const user = useCurrentUser();

  // @ts-ignore
  const {
    user: { _id: authorId },
    currentMessage: {
      user: { _id: currentId },
      sent,
      received,
    },
  } = bubbleProps;

  const offset = authorId === currentId ? 20 : -20;

  const renderTicks = (currentMessage: IMessage) => {
    const tickedUser = currentMessage.user._id;
    if (tickedUser === user?.id) {
      if (received) {
        return <Text style={styles.tick}>✓✓</Text>;
      } else if (sent) {
        return <Text style={styles.tick}>✓</Text>;
      }
    }
  };

  return (
    <Transition offset={offset} animateOnMount>
      <TransitionBubble key="message-bubble" style={styles.container}>
        <Bubble
          {...bubbleProps}
          // @ts-ignore
          wrapperStyle={{ right: styles.right }}
          renderTicks={renderTicks}
        />
      </TransitionBubble>
    </Transition>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tick: {
    fontSize: 10,
    paddingRight: 8,
    color: ThemeStatic.white,
  },
  right: {
    marginVertical: 4,
    backgroundColor: ThemeStatic.accent,
  },
});

export default CustomBubble;
