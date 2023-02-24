import React, { useMemo, useCallback } from 'react';
import {
    StyleSheet, Text, View
} from 'react-native';

import Languages from '@/commons/Languages';
import { COLORS, Styles } from '@/theme';
import KeyValue from '../KeyValue';
import IcMoto from '@/assets/images/ic_moto.svg';
import IcCar from '@/assets/images/ic_car.svg';
import IcLand from '@/assets/images/ic_land.svg';
import IcCredit from '@/assets/images/ic_credit.svg';
import { IconSize } from '@/theme/iconsize';
import { Button } from '@/components';
import { BUTTON_STYLES } from '../elements/button/constants';
import { Configs } from '@/commons/Configs';
import { Touchable } from '../elements';
import { ContractModel } from '@/models/contract';
import Utils from '@/utils/Utils';
import { ContractTypes, PRODUCT } from '@/commons/constants';
import Navigator from '@/routers/Navigator';
import ScreenNames from '@/commons/ScreenNames';

const ItemContract = ({ tabType, contract }: { tabType: number, contract: ContractModel }) => {

    const onPayNow = useCallback(() => {

    }, []);

    const isPaidAll = tabType === ContractTypes[1].type;

    const onViewDetail = useCallback(() => {
        Navigator.pushScreen(ScreenNames.contractDetail, {contract, isPaidAll });
    }, [contract, isPaidAll]);

    const headerBg = useMemo(() => {
        return { backgroundColor: contract.color || COLORS.GRAY_2 };
    }, [contract.color]);

    const headerTextColor = useMemo(() => {
        let textColor;
        switch (tabType) {
            case ContractTypes[0].type:
                textColor = COLORS.WHITE;
                break;
            default:
                textColor = COLORS.DARK_GRAY;
                break;
        }
        return { color: textColor };
    }, [tabType]);

    const contractLogo = useMemo(() => {
        switch (contract.san_pham_vay) {
            case PRODUCT.CAR:
                return <IcCar {...IconSize.size30_30} />;
            case PRODUCT.LAND:
                return <IcLand {...IconSize.size30_30} />;
            case PRODUCT.CREDIT:
                return <IcCredit {...IconSize.size30_30} />;
            default:
                return <IcMoto {...IconSize.size30_30} />;
        }
    }, [contract.san_pham_vay]);

    return <>
        <View style={[styles.headerContainer, headerBg]}>
            <Text style={[styles.txtHeader, headerTextColor]}>
                {!isPaidAll ?
                    `${Languages.contracts.nextPayDate} ${contract.ki_tra_toi}`
                    : contract.ma_hop_dong}
            </Text>
        </View>
        <View style={styles.root}>
            <View style={styles.container}>
                {!isPaidAll && <KeyValue
                    label={Languages.contracts.contractCode}
                    value={contract.ma_hop_dong}
                />}
                <KeyValue
                    label={Languages.contracts.amountLoan1}
                    value={Utils.formatMoney(contract.khoan_vay)}
                />
                <KeyValue
                    label={Languages.contracts.totalAmount}
                    value={Utils.formatMoney(contract.tong_no_con_lai_chua_tra)}
                />
                {tabType === 0 && <View style={styles.row}>
                    {contractLogo}
                    <Button
                        label={Languages.contracts.payNow}
                        radius={25}
                        onPress={onPayNow}
                        style={styles.button}
                        buttonStyle={BUTTON_STYLES.GREEN}
                    />
                </View>}
            </View>
            {tabType !== 1 && <Touchable style={styles.bottomContainer}
                onPress={onViewDetail}>
                {contractLogo}
                <Text style={styles.txtViewDetail}>
                    {Languages.contracts.viewDetail}
                </Text>
            </Touchable>}
        </View>

    </>;
};

export default ItemContract;

const styles = StyleSheet.create({
    root: {
        borderRadius: 10,
        borderColor: COLORS.GRAY_2,
        borderWidth: 1,
        marginHorizontal: 10
    },
    container: {
        paddingHorizontal: 10,
        paddingTop: 5
    },
    txtHeader: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size13,
        color: COLORS.WHITE,
        textAlign: 'center'
    },
    row: {
        flexDirection: 'row',
        marginTop: 15,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    button: {
        width: '80%',
        height: Configs.FontSize.size35
    },
    bottomContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        padding: 10,
        backgroundColor: COLORS.GRAY_3,
        borderBottomEndRadius: 10,
        borderBottomLeftRadius: 10
    },
    headerContainer: {
        marginTop: 20,
        marginHorizontal: 30,
        paddingVertical: 7,
        backgroundColor: COLORS.DARK_RED,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10
    },
    txtViewDetail: {
        ...Styles.typography.medium,
        flex: 1,
        fontSize: Configs.FontSize.size12,
        color: COLORS.GREEN,
        textAlign: 'center'
    }
});
