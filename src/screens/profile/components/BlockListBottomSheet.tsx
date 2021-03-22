import React, { useRef } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Modalize } from 'react-native-modalize';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { FlatGrid } from 'react-native-super-grid';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../../recoil/theme/atoms';
import { useGetBlockedUserQuery } from '../../../graphql/queries/getBlockedUser.generated';
import { PollIntervals } from '../../../utils/constants';
import { useUnBlockUserMutation } from '../../../graphql/mutations/unBlockUser.generated';
import { longPressUnblockNotification } from '../../../helpers/notifications';
import type { ThemeColors } from '../../../types/theme';
import ConnectionsPlaceholder from '../../../components/placeholders/Connection.Placeholder';
import SvgBanner from '../../../components/shared/SvgBanner';
import { Images } from '../../../assets1/icons';
import DeleteCardRightActions from '../../../components/shared/DeleteCardRightActions';
import UserCard from '../../../components/UserCard';
import BottomSheetHeader from '../../../components/shared/layout/headers/BottomSheetHeader';

interface BlockListBottomSheetProps {
    ref: React.Ref<any>,
    onUnblock: (userId: string) => void
};

const BlockListBottomSheet: React.FC<BlockListBottomSheetProps> = React.forwardRef(({ onUnblock }, ref) => {

    const theme = useRecoilValue(themeState)

    const { data, loading, error } = useGetBlockedUserQuery({
        pollInterval: PollIntervals.blockList,
        fetchPolicy: 'cache-and-network'
    });

    const [unblockUser, { loading: unblockUserLoading }] = useUnBlockUserMutation();

    const swipeableRef = useRef();

    let content = <ConnectionsPlaceholder />;

    const ListEmptyComponent = () => (
        <SvgBanner
            Svg={<Image source={Images.emptyBlocklist} />}
            placeholder='No users blocked'
            spacing={16}
        />
    );

    const onDelete = (blockedId: number, handle: string) => {
        if (!unblockUserLoading) {
            longPressUnblockNotification(() => {
                // @ts-ignore
                swipeableRef.current.close();
                unblockUser({ variables: { id: blockedId } });
            }, handle);
        }
    };

    const renderRightActions = (progress: any, dragX: any, blockedId: number, handle: string) => (
        <DeleteCardRightActions
            progress={progress}
            dragX={dragX}
            style={styles().rightActions}
            onDelete={() => onDelete(blockedId, handle)}
        />
    );

    const renderItem = ({ item }: { item: any }) => {
        const { id, avatarFilePath, nickname, name } = item;
        return (
            <Swipeable
                // @ts-ignore
                ref={swipeableRef}
                useNativeAnimations
                rightThreshold={-300}
                renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, id, name)}>
                <UserCard
                    userId={id}
                    avatar={avatarFilePath}
                    nickname={nickname}
                    name={name}
                    onPress={() => null}
                />
            </Swipeable>
        );
    };

    if (!loading && !error) {
        const blockedUsers = data?.getBlockedUser
        content = (
            <FlatGrid
                bounces={false}
                itemDimension={responsiveWidth(85)}
                showsVerticalScrollIndicator={false}
                data={blockedUsers}
                itemContainerStyle={styles().listItemContainer}
                contentContainerStyle={styles().listContentContainer}
                ListEmptyComponent={ListEmptyComponent}
                style={styles().listContainer}
                spacing={20}
                renderItem={renderItem}
            />
        );
    }

    return (
        <Modalize
            //@ts-ignore
            ref={ref}
            scrollViewProps={{ showsVerticalScrollIndicator: false }}
            modalStyle={styles(theme).container}>
            <BottomSheetHeader
                heading='Blocked Users'
                subHeading={`Below are the users you've blocked`}
            />
            <View style={styles(theme).content}>
                {content}
            </View>
        </Modalize>
    );
});

const styles = (theme = {} as ThemeColors) => StyleSheet.create({
    container: {
        marginTop: 40,
        padding: 20,
        backgroundColor: theme.base
    },
    content: {
        flex: 1,
        paddingBottom: responsiveHeight(5)
    },
    listContainer: {
        flex: 1
    },
    listItemContainer: {
        width: '106%'
    },
    listContentContainer: {
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    rightActions: {
        marginRight: 20
    },
});

export default BlockListBottomSheet;