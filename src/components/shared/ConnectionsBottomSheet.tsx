import React, { useContext } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { FlatGrid } from 'react-native-super-grid';
import { AppContext } from '../../context';
import SvgBanner from './SvgBanner';
import { image } from 'react-native-image-filter-kit/src/common/inputs';
import { Images } from '../../assets1/icons';
import UserCard from '../UserCard';
import { Connection, Connections } from '../../utils/constants';
import BottomSheetHeader from './layout/headers/BottomSheetHeader';
import { ThemeColors } from '../../types/theme';

interface ConnectionsBottomSheetProps {
  ref: React.Ref<any>;
  viewMode?: boolean;
  data: Connection[];
  handle: string;
  type: string;
}

const ConnectionsBottomSheet: React.FC<ConnectionsBottomSheetProps> = React.forwardRef(
  ({ viewMode, handle, data, type }, ref) => {
    const { theme } = useContext(AppContext);

    let heading: string;
    let subHeading: string;

    if (type === Connections.FOLLOWING) {
      heading = 'Following';
      if (viewMode) {
        subHeading = `People ${handle} is following`;
      } else {
        subHeading = 'People you are following';
      }
    } else if (type === Connections.FOLLOWERS) {
      heading = 'Followers';
      if (viewMode) {
        subHeading = `People who are following ${handle}`;
      } else {
        subHeading = 'People who are following you';
      }
    }

    const ListEmptyComponent = () => (
      <SvgBanner Svg={<Image source={Images.emptyConnection} />} placeholder="No users found" spacing={16} />
    );

    // @ts-ignore
    const renderItem = ({ item }) => {
      const { id, avatar, handle, name } = item;
      return <UserCard userId={id} avatar={avatar} handle={handle} name={name} />;
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
