import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import Feather from 'react-native-vector-icons/Feather';
import { useRecoilValue } from 'recoil';
import type { SelectedMedia } from '..';
import FilterRow from '../../../components/FilterRow';
import { FilterType } from '../../../components/FilterRow/type';
import Button from '../../../components/shared/controls/Button';
import GoBackHeader from '../../../components/shared/layout/headers/GoBackHeader';
import { AppRoutes } from '../../../navigator/app-routes';
import type { UploadStackParamList } from '../../../navigator/upload.navigator';
import { themeState } from '../../../recoil/common/atoms';
import { Typography, ThemeStatic } from '../../../theme';
import { IconSizes } from '../../../theme/Icon';
import type { ThemeColors } from '../../../types/theme';
import FilteringMedia from '../components/FilteringMedia';
import UploadMediaItem from '../components/UploadMediaItem';

const { FontSizes } = Typography;

const FilterScreen = React.memo(() => {
  const {
    params: { medias, fromCamera = false },
  } = useRoute<RouteProp<UploadStackParamList, AppRoutes.FILTER_SCREEN>>();
  const theme = useRecoilValue(themeState);
  const styles = useStyle(theme);
  const { navigate, addListener, dispatch } = useNavigation();

  const modalizeRef = useRef<Modalize>(null);

  const [mediasToFilter, setMediasToFilter] = useState([...medias]);

  const [selectedFilter, setSelectedFilter] = useState<FilterType>();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [tempUri, setTempUri] = useState('');
  const [isChange, setIsChange] = useState(false);

  useEffect(() => {
    setMediasToFilter([...medias]);
  }, [medias]);

  useEffect(() => {
    addListener('beforeRemove', (e) => {
      if (e.data.action.type !== 'NAVIGATE') {
        if (isChange) {
          e.preventDefault();
          Alert.alert('', 'If go back now every changes you made will be removed', [
            { text: 'Cancel', style: 'cancel', onPress: () => { } },
            {
              text: 'Remove',
              style: 'destructive',
              onPress: () => {
                dispatch(e.data.action);
              },
            },
          ]);
        }
      }
    });
  }, [isChange]);

  useEffect(() => {
    if (selectedIndex !== -1 && mediasToFilter[selectedIndex]) {
      modalizeRef.current?.open();
    }
  }, [selectedIndex, mediasToFilter]);

  const handleFilter = (index: number) => {
    setSelectedIndex(index);
  };

  const handleApplyFilter = (filter: FilterType) => {
    setSelectedFilter(filter);
  };

  const handleExtractMedia = (uri: string) => {
    setTempUri(uri);
  };

  const handleCloseFilter = () => {
    const temp = [...mediasToFilter];
    if (tempUri) {
      temp[selectedIndex].metadata.node.image.uri = tempUri;
    }
    setMediasToFilter(temp);
    setSelectedIndex(-1);
    setTempUri('');
    setSelectedFilter(FilterType.NONE);
  };

  const handleSaveFilter = () => {
    setIsChange(true);
    modalizeRef?.current?.close();
  };

  if (!medias.length) return null;

  return (
    <SafeAreaView style={styles.container}>
      <Modalize
        onClose={handleCloseFilter}
        ref={modalizeRef}
        scrollViewProps={{ showsVerticalScrollIndicator: false }}
        modalStyle={styles.modalContainer}
        adjustToContentHeight={false}>
        {mediasToFilter[selectedIndex] ? (
          <View style={styles.modalContent}>
            <FilteringMedia
              handleExtractMedia={handleExtractMedia}
              uri={mediasToFilter[selectedIndex].metadata?.node.image.uri ?? ''}
              filter={selectedFilter}
            />
            <FilterRow
              style={{ marginBottom: 10 }}
              uri={mediasToFilter[selectedIndex].metadata?.node.image.uri ?? ''}
              onChoseFilter={handleApplyFilter}
            />
            <Button label="Save" onPress={handleSaveFilter} loading={false} />
          </View>
        ) : null}
      </Modalize>
      <GoBackHeader
        iconSize={IconSizes.x7}
        IconRight={() => (
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={() => {
              navigate(AppRoutes.CAPTION_SCREEN, { medias: mediasToFilter });
            }}>
            <Text style={{ color: ThemeStatic.accent, ...FontSizes.Label }}>Next</Text>
          </TouchableOpacity>
        )}
      />
      <FlatList
        contentContainerStyle={{ paddingLeft: 20, marginTop: 50 }}
        data={mediasToFilter}
        horizontal
        renderItem={({ item, index }) => (
          <UploadMediaItem media={item} onClick={() => handleFilter(index)} fromCamera={fromCamera} />
        )}
        keyExtractor={(item: SelectedMedia, index) => 'upload-media-' + index.toString()}
      />
      <View style={{ paddingLeft: 20, flexDirection: 'row', alignItems: 'center' }}>
        <Feather name="info" color={theme.text01} size={20} />
        <Text style={{ color: theme.text01, marginLeft: 8, fontSize: 15 }}>
          Tip: Click on media to apply filter 🤩 🤩 (Not support video yet)
        </Text>
      </View>
    </SafeAreaView>
  );
});

const useStyle = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.base,
    },
    modalContainer: {
      padding: 20,
      backgroundColor: theme.base,
      marginTop: 20,
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    modalContent: {
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  });
export default FilterScreen;
