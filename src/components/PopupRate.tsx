import { SCREEN_HEIGHT } from '@gorhom/bottom-sheet';
import React, {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useState
} from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import Modal from 'react-native-modal';
import StarRating from 'react-native-star-rating-widget';

import { Configs } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import IcClose from '@/assets/images/ic_close.svg';
import { PopupActionTypes, PopupPropsTypes } from '@/models/typesPopup';
import { COLORS, Styles } from '@/theme';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import { Button } from '.';
import { BUTTON_STYLES } from './elements/button/constants';
import HideKeyboard from './HideKeyboard';
import { Touchable } from './elements';

export interface PopupRateProps extends PopupPropsTypes {
    icon?: any;
    rate?: any;
    setRate?: any;
    onPress?: () => any;
    onSendRate?: () => any;
    onChangeText?: () => any;
    renderInput?: any;
    rightIcon?: any;
}

const PopupRate = forwardRef<PopupActionTypes, PopupRateProps>(
    (
        {
            rate,
            setRate,
            onBackdropPress,
            renderInput,
            onSendRate,
            rightIcon
        }: PopupRateProps,
        ref: any
    ) => {
        const [contentRateTitle, setContentRateTitle] = useState<string>('');
        const [isVisible, setsVisible] = useState<boolean>(false);

        useEffect(() => {
            if (isVisible) {
                setContentRateTitle(
                    rate ? Languages.feedback.ratingLevels[rate - 1] : ''
                );
            }
        }, [isVisible, rate]);

        useImperativeHandle(ref, () => ({
            show,
            hide
        }));

        const show = useCallback(() => {
            setsVisible(true);
        }, []);

        const hide = useCallback(() => {
            setsVisible(false);
            setRate?.('0');
        }, [setRate]);

        const updateRate = useCallback((point: number) => {
            setRate?.(point);
            setContentRateTitle(Languages.feedback.ratingLevels[point - 1]);
        },[setRate]);

        const _onBackdropPress = useCallback(() => {
            setContentRateTitle('');
            onBackdropPress?.();
        }, [onBackdropPress]);

        const renderSwipe = useMemo(() => {
            return (
                <StarRating
                    starSize={40}
                    maxStars={5}
                    minRating={1}
                    style={styles.rate}
                    rating={rate}
                    enableHalfStar={false}
                    onChange={updateRate}
                />
            );
        }, [rate, updateRate]);

        const renderReviewText = useMemo(() => {
            return <Text style={styles.reviewTitle}>{contentRateTitle}</Text>;
        }, [contentRateTitle]);

        return (
            <Modal
                isVisible={isVisible}
                animationIn="slideInLeft"
                animationOut="slideOutRight"
                animationInTiming={400}
                animationOutTiming={20}
                useNativeDriver={true}
            >
                <HideKeyboard>
                    <View style={styles.modalWrap}>
                        <Touchable onPress={_onBackdropPress} style={styles.wrapIcClose} >
                            <IcClose width={15} height={15} />
                        </Touchable>
                        <Text style={styles.title}>{Languages.feedback.titleModal}</Text>
                        {renderSwipe}
                        {renderReviewText}
                        <View style={styles.wrapContentRate}>
                            <Text style={styles.titleRate}>
                                {Languages.feedback.contentRate}
                            </Text>
                            {renderInput}
                        </View>
                        <Button
                            onPress={onSendRate}
                            disabled={rate <= 0}
                            label={Languages.feedback.send}
                            buttonStyle={BUTTON_STYLES.GREEN}
                            rightIcon={rightIcon}
                        />
                    </View>
                </HideKeyboard>
            </Modal>
        );
    }
);

export default PopupRate;

const styles = StyleSheet.create({
    modalWrap: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 40,
        backgroundColor: COLORS.WHITE,
        borderRadius: 10
    },
    wrapStar: {
        flexDirection: 'row',
        marginTop: 3,
        marginHorizontal: 4
    },
    title: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size16,
        color: COLORS.DARK_GRAY
    },
    titleRate: {
        ...Styles.typography.medium,
        color: COLORS.DARK_GRAY
    },
    contentRateTitle: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size13,
        color: COLORS.DARK_GRAY
    },
    wrapContentRate: {
        width: '100%',
        height: SCREEN_HEIGHT / 7,
        justifyContent: 'space-between',
        marginBottom: 40
    },
    input: {
        borderColor: COLORS.GRAY_10,
        fontSize: Configs.FontSize.size14,
        borderRadius: 10,
        height: SCREEN_HEIGHT / 7,
        marginVertical: 5
    },
    rate: {
        alignItems: 'center',
        marginVertical: 10,
        marginHorizontal: 20
    },
    containerRate: {
        flexDirection: 'column-reverse',
        alignItems: 'center',
        width: SCREEN_WIDTH * 0.8,
        marginTop: 7
    },
    reviewTitle: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size12,
        color: COLORS.DARK_GRAY,
        marginBottom: 10
    },
    wrapIcClose: {
        alignSelf: 'flex-end'
    }
});
