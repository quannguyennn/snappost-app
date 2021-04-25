import { Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ThemeStatic, Typography } from '../../theme';
import { useNavigation } from '@react-navigation/core';
import { AppRoutes } from '../../navigator/app-routes';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../recoil/theme/atoms';

const { FontWeights, FontSizes } = Typography;

export type TransformTextProps = {
  text: string;
  username?: string;
  color?: string;
};

const TransformText: React.FC<TransformTextProps> = ({ text, username, color }) => {
  const { navigate } = useNavigation();
  const theme = useRecoilValue(themeState);

  const [elements, setElements] = useState<Element[]>([]);
  const [init, setInit] = useState(true);

  const textColor = color ? color : theme.text01;

  const transformText = (str: string) => {
    const elements: Element[] = [];
    if (!str.includes('@')) {
      elements.push(<Text style={{ color: textColor, marginRight: 4 }}>{str}</Text>);
    } else {
      const rawWords = str.split(' ');
      const words = [];
      let rawPointer = 0;
      while (rawPointer < rawWords.length) {
        if (rawWords[rawPointer].startsWith('@')) {
          words.push(rawWords[rawPointer] + rawWords[rawPointer + 1]);
          rawPointer += 2;
        } else {
          words.push(rawWords[rawPointer]);
          rawPointer++;
        }
      }

      let pointer = 0;

      while (pointer < words.length) {
        //not a mention
        if (!words[pointer].startsWith('@')) {
          elements.push(<Text style={{ color: textColor, marginRight: 4 }}>{words[pointer]}</Text>);
          pointer++;
        } else {
          //maybe a mention
          if (words[pointer].match(/#{5}\d{1,100000000000}#{5}/g)) {
            const chars = words[pointer].split('');

            let charPointer = 0;
            while (charPointer < chars.length) {
              const char = chars[charPointer];
              if (char !== '@') {
                charPointer++;
              } else {
                if (chars[charPointer + 1] === '[' && chars[charPointer + 2] === '@') {
                  //get ] index
                  const closeMentionSymbolIndex = chars.findIndex((char) => char === ']');
                  const idSymbolIndex: number[] = [];
                  chars.map((item, index) => {
                    if (item === '#') {
                      idSymbolIndex.push(index);
                    }
                  });
                  const lastSymbolIndex = idSymbolIndex.find((el) => closeMentionSymbolIndex + 5 < el);
                  //substring from @[@ ... ]
                  const mentionUser = '@' + words[pointer].substring(charPointer + 3, closeMentionSymbolIndex);
                  const mentionUserId = words[pointer].substring(closeMentionSymbolIndex + 6, lastSymbolIndex);
                  const temp1 = [...elements];
                  elements.push(
                    <TouchableOpacity
                      style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}
                      onPress={() => navigate(AppRoutes.PROFILE_VIEW_SCREEN, { userId: Number(mentionUserId) })}>
                      <Text style={{ color: ThemeStatic.accent, marginRight: 4, fontSize: 15, fontWeight: 'bold' }}>
                        {mentionUser}
                      </Text>
                    </TouchableOpacity>,
                  );
                  setElements(temp1);

                  charPointer += idSymbolIndex[idSymbolIndex.length - 1];
                }
              }
              charPointer++;
            }
          } else {
            //not a mention
            elements.push(<Text style={{ color: textColor, marginRight: 4 }}>{words[pointer]}</Text>);
            pointer++;
          }
          pointer++;
        }
      }
    }
    setElements([...elements]);
  };

  useEffect(() => {
    if (init) {
      transformText(text);
      setInit(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, init]);

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
      }}>
      {/* <Text style={{ ...FontWeights.Regular, ...FontSizes.Body, color: theme.text01, marginRight: 4 }}>{username}</Text> */}

      {elements.map((item) => item)}
    </View>
  );
};

export default TransformText;
