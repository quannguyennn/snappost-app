import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { FlatGrid } from 'react-native-super-grid';
import SvgBanner from './SvgBanner';
import { Images } from '../../assets1/icons';
import UserCard from '../UserCard';
import { Connection, Connections } from '../../utils/constants';
import BottomSheetHeader from './layout/headers/BottomSheetHeader';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../recoil/theme/atoms';
import type { ThemeColors } from '../../types/theme';
// import type { User } from '../../graphql/type.interface';

interface ConnectionsBottomSheetProps {
  ref: React.Ref<any>;
  viewMode?: boolean;
  data: undefined | string[];
  name?: string | undefined;
  type: string;
}

const ConnectionsBottomSheet: React.FC<ConnectionsBottomSheetProps> = React.forwardRef(
  ({ viewMode, name, data, type }, ref) => {
    const theme = useRecoilValue(themeState);

    let heading: string;
    let subHeading: string;

    if (type === Connections.FOLLOWING) {
      heading = 'Following';
      if (viewMode) {
        subHeading = `People ${name} is following`;
      } else {
        subHeading = 'People you are following';
      }
    } else if (type === Connections.FOLLOWERS) {
      heading = 'Followers';
      if (viewMode) {
        subHeading = `People who are following ${name}`;
      } else {
        subHeading = 'People who are following you';
      }
    }

    const ListEmptyComponent = () => (
      <SvgBanner Svg={<Image source={Images.emptyConnection} />} placeholder="No users found" spacing={16} />
    );

    // @ts-ignore
    const renderItem = ({ item }) => {

      const { id, avatarFilePath, nickname, name } = item;
      return <UserCard userId={id} avatar={avatarFilePath} name={name} nickname={nickname} />;
    };

    // @ts-ignore
    return (
      <Modalize
        ref={ref}
        scrollViewProps={{ showsVerticalScrollIndicator: false }}
        modalStyle={styles(theme).container}>
        {/*@ts-ignore*/}
        <BottomSheetHeader heading={heading} subHeading={subHeading} />
        <View style={styles(theme).content}>
          <FlatGrid
            bounces={false}
            itemDimension={responsiveWidth(85)}
            showsVerticalScrollIndicator={false}
            data={data}
            itemContainerStyle={styles().listItemContainer}
            contentContainerStyle={styles().listContentContainer}
            ListEmptyComponent={ListEmptyComponent}
            style={styles().listContainer}
            spacing={20}
            renderItem={renderItem}
          />
        </View>
      </Modalize>
    );
  },
);

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      marginTop: 40,
      padding: 20,
      backgroundColor: theme.base,
    },
    content: {
      flex: 1,
      paddingBottom: responsiveHeight(5),
    },
    listContainer: {
      flex: 1,
    },
    listItemContainer: {
      width: '106%',
    },
    listContentContainer: {
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
  });

export default ConnectionsBottomSheet;
