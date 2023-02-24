import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    AppState,
    AppStateStatus, Linking,
    StyleSheet,
    Text,
    View
} from 'react-native';

import IcMoMo from '@/assets/images/ic_momo.svg';
import IcNganLuong from '@/assets/images/ic_nganluong.svg';
import { Configs } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { Touchable } from '@/components';
import { COLORS, Styles } from '@/theme';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';

export const PAYMENT_METHODS = {
    NONE: 'NONE',
    BANK: 'BANK',
    MOMO: 'MOMO'
};

const PaymentMethod = ({ onUpdateTransaction, onUpdatePaymentMethod, hideMomo }: {
    onUpdateTransaction: () => any,
    onUpdatePaymentMethod: (method: string) => any,
    hideMomo?: boolean
}) => {

    const [status, setStatus] = useState<{ isBankSelected: boolean, isMomoSelected: boolean }>({
        isBankSelected: false,
        isMomoSelected: false
    });
    const lastAppStateBackground = useRef<boolean>(false);

    const handleOpenURL = useCallback((url: any) => {
        onUpdateTransaction?.();
    }, [onUpdateTransaction]);

    useEffect(() => {
        const subscriptionAppState = AppState.addEventListener('change', _handleAppStateChange);
        const subscriptionLinking = Linking.addEventListener('url', handleOpenURL);

        return () => {
            subscriptionAppState.remove();
            subscriptionLinking.remove();
        };
    }, []);

    useEffect(() => {
        let paymentMethod = PAYMENT_METHODS.NONE;
        if (status.isBankSelected) {
            paymentMethod = PAYMENT_METHODS.BANK;
        } else if (status.isMomoSelected) {
            paymentMethod = PAYMENT_METHODS.MOMO;
        }
        onUpdatePaymentMethod?.(paymentMethod);
    }, [onUpdatePaymentMethod, status]);

    // handle gateway callbacks
    const _backgroundState = useCallback((state: any) => {
        return state?.match(/inactive|background/);
    }, []);

    const _handleAppStateChange = (nextAppState: AppStateStatus) => {
        if (_backgroundState(nextAppState)) {
            lastAppStateBackground.current = true;
        } else if (lastAppStateBackground.current && nextAppState === 'active' ) {
            // console.log('App is coming to foreground');
            lastAppStateBackground.current = false;
            onUpdateTransaction?.();
        }else{
            lastAppStateBackground.current = false;
        }
    };

    const getMethodStyle = (isSelected: boolean) => {
        return [styles.methodItem, {
            borderColor: !isSelected ? COLORS.GRAY : COLORS.GREEN
        }];
    };

    const renderMethod = useCallback((title: string, image: any, isSelected: boolean, onPress: any) => {
        return (
            <View style={getMethodStyle(isSelected)}>
                <Touchable style={styles.methodItemSub} onPress={onPress}>
                    {image}
                    <Text style={styles.txtMethod}>{title}</Text>
                </Touchable>
            </View>
        );
    }, []);

    const updateMomoMethod = useCallback(() => {
        setStatus(last => ({
            isBankSelected: false,
            isMomoSelected: !last.isMomoSelected
        }));
    }, []);

    const updateNganLuongMethod = useCallback(() => {
        setStatus(last => ({
            isBankSelected: !last.isBankSelected,
            isMomoSelected: false
        }));
    }, []);

    return (
        <View style={styles.methodContainer}>
            {!hideMomo && renderMethod(
                Languages.contractPayment.momo,
                <IcMoMo {...styles.iconMethod} />,
                status.isMomoSelected,
                updateMomoMethod)}

            {renderMethod(
                Languages.contractPayment.nganLuong,
                <IcNganLuong {...styles.iconMethod} />,
                status.isBankSelected,
                updateNganLuongMethod)}
        </View>
    );
};

export default PaymentMethod;

const styles = StyleSheet.create({
    methodContainer: {
        marginVertical: 10,
        flexDirection: 'row'
    },
    methodItem: {
        shadowRadius: 2,
        borderRadius: 12,
        borderWidth: 1,
        marginHorizontal: 5
    },
    methodItemSub: {
        paddingTop: 5,
        justifyContent: 'center',
        alignItems: 'center',
        width: (SCREEN_WIDTH - 60) / 2,
        height: 80
    },
    iconMethod: {
        width: 30,
        height: 30,
        marginVertical: 5
    },
    txtMethod: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size13,
        textAlign: 'center',
        flex: 1
    }
});
