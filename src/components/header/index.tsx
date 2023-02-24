import React, { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import IcBack from '@/assets/images/ic_back.svg';
import ImgHeader from '@/assets/images/img_header.svg';
import { Configs, PADDING_TOP, STATUSBAR_HEIGHT } from '@/commons/Configs';
import Navigator from '@/routers/Navigator';
import { COLORS, Styles } from '@/theme';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import { Touchable } from '../elements/touchable';
import { HeaderProps } from './types';


const IMG_HEADER_HEIGHT = SCREEN_WIDTH / 375 * 85;

export const HeaderBar = ({
    onBackPressed,
    onGoBack,
    title,
    hasBack,
    noHeader,
    exitApp }: HeaderProps) => {

    const _onBackPressed = useCallback(() => {
        if (!exitApp) {
            if (hasBack && onBackPressed) {
                onBackPressed();
            }
            else if (onGoBack) {
                onGoBack();
            } else {
                Navigator.goBack();
            }
            return true;
        }
        return false;
    }, [exitApp, hasBack, onBackPressed, onGoBack]);

    const renderBack = useMemo(() => (
        <Touchable style={styles.goBack} onPress={_onBackPressed}
            size={40}>
            <IcBack
                width={30}
                height={20} />
        </Touchable>
    ), [_onBackPressed]);

    const renderTitle = useMemo(() => (
        <View style={styles.titleContainer}>
            <Text
                numberOfLines={1}
                style={styles.titleCenter}>
                {title?.toLocaleUpperCase()}
            </Text>
        </View>
    ), [title]);

    return (
        <View style={styles.container}>
            {!noHeader && <ImgHeader
                style={styles.imageBg}
                width={SCREEN_WIDTH}
                height={IMG_HEADER_HEIGHT} />}

            {!noHeader && <View style={styles.headerContainer}>
                {renderTitle}
                {(!exitApp || hasBack) && renderBack}
            </View>}
        </View>
    );
};

export default HeaderBar;

const styles = StyleSheet.create({
    container: {
        height: IMG_HEADER_HEIGHT
    },
    imageBg: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        backgroundColor: COLORS.GREEN
    },
    headerContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: STATUSBAR_HEIGHT + PADDING_TOP
    },
    goBack: {
        justifyContent: 'center'
    },
    titleContainer: {
        position: 'absolute',
        left: 30,
        right: 30
    },
    titleCenter: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size16,
        textAlign: 'center',
        color: COLORS.WHITE
    }
});
