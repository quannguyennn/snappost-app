import React from "react";
import { StyleSheet, View } from "react-native";
import { useRecoilValue } from "recoil";
import { Placeholder, PlaceholderLine, PlaceholderMedia } from "rn-placeholder";
import { themeState } from "../../recoil/theme/atoms";
import PlaceholderAnimation from "./PlaceholderAnimation";

const UserRowPlaceholder = () => {
    const theme = useRecoilValue(themeState);
    return (
        <View style={styles.container}>
            <Placeholder Animation={PlaceholderAnimation}>
                {
                    new Array(10).fill({}).map((_, index) => {
                        <View key={index} style={{ width: 50, marginRight: 15 }}>
                            <PlaceholderMedia color={theme.placeholder} size={50} isRound />
                            <PlaceholderLine noMargin color={theme.placeholder} style={styles.userChatPlaceholder} width={40} />
                        </View>
                    })
                }
            </Placeholder>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        justifyContent: "center",
        flex: 1
    },
    userChatPlaceholder: {
        borderRadius: 10,
        marginTop: 10,
    },
})

export default UserRowPlaceholder;