import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRecoilValue } from 'recoil';
import Foundation from 'react-native-vector-icons/Foundation';
import { Mention, MentionInput, Tag } from 'react-native-complete-mentions';
import GoBackHeader from '../../../components/shared/layout/headers/GoBackHeader';
import { AppRoutes } from '../../../navigator/app-routes';
import type { UploadStackParamList } from '../../../navigator/upload.navigator';
import { themeState } from '../../../recoil/theme/atoms';
import { Typography, ThemeStatic } from '../../../theme';
import { IconSizes } from '../../../theme/Icon';
import type { ThemeColors } from '../../../types/theme';
import { useFileUpload } from '../../../hooks/useFileUpload';
import type { Media } from '../../../graphql/type.interface';
import { useCreatePostMutation } from '../../../graphql/mutations/createPost.generated';
import {
  postUploadedNotification,
  somethingWentWrongErrorNotification,
  uploadErrorNotification,
} from '../../../helpers/notifications';
import { SearchUserQueryResponse, useSearchUserLazyQuery } from '../../../graphql/queries/searchUser.generated';
import FastImage from 'react-native-fast-image';
import useDebounce from '../../../screens/ExploreScreen/hooks/useDebounce';
import { BarIndicator } from 'react-native-indicators';

const { FontSizes } = Typography;

function UserSuggestion({ data, onPress }: { data: any; onPress: () => void }) {
  const theme = useRecoilValue(themeState);
  const styles = useStyle(theme);

  return (
    <TouchableOpacity onPress={onPress} style={styles.userSuggestionContainer}>
      <FastImage source={{ uri: data.avatarFilePath ?? '' }} style={styles.suggessAvatar} />
      <View style={{ justifyContent: 'space-between' }}>
        <Text style={{ color: theme.text01 }}>{data.name}</Text>
        <Text style={{ color: theme.text02 }}>{data.name}</Text>
      </View>
    </TouchableOpacity>
  );
}

const CaptionScreen = React.memo(() => {
  const [uploadMedia] = useFileUpload();

  const {
    params: { medias },
  } = useRoute<RouteProp<UploadStackParamList, AppRoutes.CAPTION_SCREEN>>();
  const theme = useRecoilValue(themeState);
  const styles = useStyle(theme);
  const { navigate } = useNavigation();

  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [extractValue, setExtractValue] = useState('');
  const [tracking, setTracking] = useState(false);
  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebounce(keyword, 150);

  const [searchUser, { data: fetchUser, loading: searchLoading, fetchMore }] = useSearchUserLazyQuery({});

  const currentPage =
    Number(fetchUser?.searchUser?.meta.currentPage) >= 0 ? Number(fetchUser?.searchUser?.meta.currentPage) : 1;
  const totalPages =
    Number(fetchUser?.searchUser?.meta.totalPages) >= 0 ? Number(fetchUser?.searchUser?.meta.totalPages) : 2;

  const suggestedUsers = fetchUser?.searchUser?.items;

  useEffect(() => {
    if (keyword.trim()) {
      searchUser({
        variables: {
          keyword: debouncedKeyword,
          isRestricted: true,
          limit: 20,
          page: 1,
        },
      });
    }
  }, [debouncedKeyword]);

  const loadMore = () => {
    if (Number(currentPage) < Number(totalPages)) {
      fetchMore &&
        fetchMore({
          variables: { limit: 15, page: currentPage + 1 },
          updateQuery: (prev: SearchUserQueryResponse, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return prev;
            }
            const prevItem = prev?.searchUser?.items ? prev?.searchUser?.items : [];
            const nextItem = fetchMoreResult.searchUser?.items ? fetchMoreResult.searchUser?.items : [];
            return Object.assign({}, prev, {
              searchUser: {
                items: [...prevItem, ...nextItem],
                meta: fetchMoreResult.searchUser?.meta,
                __typename: 'UserConnection',
              },
            });
          },
        });
    }
  };

  const [createPost, { loading: createLoading }] = useCreatePostMutation({
    onCompleted: () => {
      setLoading(false);
      postUploadedNotification();
      navigate(AppRoutes.HOME_TAB);
    },
    onError: (err) => {
      setLoading(false);
      somethingWentWrongErrorNotification();
    },
  });

  const renderText = (mention: Mention) => {
    return <Text style={{ color: theme.accent }}>{mention.name}</Text>;
  };

  const extractString = (mention: Mention) => {
    return `@[${mention.name}]#####${mention.id}#####`;
  };

  const commitRef = React.useRef();
  const extractCommit = (commit: any) => {
    commitRef.current = commit;
  };

  const handleUpload = async () => {
    setLoading(true);
    const mediaProcessPromise: Promise<Media>[] = medias.map((item) => {
      return uploadMedia(item.metadata.node.image);
    });

    Promise.all(mediaProcessPromise)
      .then((res) => {
        const medias = res.map((item) => Number(item.id));
        createPost({
          variables: {
            input: {
              medias,
              caption: content,
              rawCaption: extractValue,
            },
          },
        });
      })
      .catch(() => {
        setLoading(false);
        uploadErrorNotification('Media');
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <GoBackHeader
        iconSize={IconSizes.x7}
        IconRight={() => (
          <TouchableOpacity
            disabled={createLoading || searchLoading || loading}
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={handleUpload}>
            <Text style={{ color: ThemeStatic.accent, ...FontSizes.Label }}>Share</Text>
          </TouchableOpacity>
        )}
      />
      <View style={styles.contentContainer}>
        <View style={styles.postContainer}>
          <ImageBackground style={styles.imageContainer} source={{ uri: medias[0].metadata.node.image.uri }}>
            {medias.length > 1 ? (
              <Foundation name="page-multiple" color={ThemeStatic.white} style={styles.imageIcon} />
            ) : null}
          </ImageBackground>
          <MentionInput
            placeholderTextColor={theme.text02}
            placeholder="Write a caption"
            style={{ flex: 1, color: theme.text02 }}
            value={content}
            onExtractedStringChange={setExtractValue}
            onChangeText={setContent}>
            <Tag
              tag="@"
              onKeywordChange={setKeyword}
              onStopTracking={() => setTracking(false)}
              onStartTracking={() => setTracking(true)}
              extractCommit={extractCommit}
              renderText={renderText}
              extractString={extractString}
              formatText={(text) => `@${text}`}
            />
          </MentionInput>
        </View>
      </View>
      <View style={[styles.contentContainer, { borderBottomWidth: 0 }]}>
        {tracking ? (
          <FlatList
            data={suggestedUsers}
            keyExtractor={(item) => item.name}
            onEndReachedThreshold={0.4}
            onEndReached={() => loadMore()}
            ListFooterComponent={searchLoading ? <BarIndicator color={ThemeStatic.accent} /> : null}
            renderItem={({ item }) => {
              return (
                <UserSuggestion
                  data={item}
                  onPress={() => {
                    if (commitRef.current) {
                      //@ts-ignore
                      commitRef.current({ ...item });
                    }
                  }}
                />
              );
            }}
          />
        ) : null}
      </View>
      {loading ? <BarIndicator color={ThemeStatic.accent} /> : null}
    </SafeAreaView>
  );
});

const useStyle = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.base,
    },
    contentContainer: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderBottomColor: theme.text01,
      borderBottomWidth: 1,
    },
    postContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    imageContainer: {
      height: 75,
      width: 75,
      marginRight: 10,
    },
    imageIcon: {
      fontSize: 18,
      position: 'absolute',
      top: 5,
      right: 5,
    },
    userSuggestionContainer: {
      marginVertical: 8,
      flexDirection: 'row',
    },
    suggessAvatar: {
      height: 42,
      width: 42,
      borderRadius: 42,
      marginRight: 15,
    },
  });

export default CaptionScreen;
