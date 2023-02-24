import React from 'react';
import {
    View,
    ActivityIndicator,
    StyleSheet
} from 'react-native';

import { COLORS } from '@/theme';

const MyLoading = ({ isOverview, isWhite }: { isOverview?: boolean, isWhite?: boolean }) =>
    isOverview ?
        <View style={styles.overlay}>
            <ActivityIndicator
                size="large"
                color={COLORS.WHITE}
                style={styles.activityIndicator} />
        </View> :
        <View style={styles.inline} >
            <ActivityIndicator size="small" color={isWhite ? COLORS.WHITE : COLORS.GREEN} />
        </View >;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 10000,
        width: '100%',
        height: '100%'
    },
    inline: {
        marginVertical: 10,
        alignItems: 'center'
    },
    activityIndicator: {
        width: 80,
        height: 80,
        borderRadius: 10,
        backgroundColor: COLORS.BACKDROP_2
    }
});

export default MyLoading;
