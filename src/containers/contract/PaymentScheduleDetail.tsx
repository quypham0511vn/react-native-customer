import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import Dash from 'react-native-dash';
import { observer } from 'mobx-react';

import KeyValue from '@/components/KeyValue';
import { Configs, PADDING_BOTTOM } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { Button, HeaderBar } from '@/components';
import { ContractDetailModel, PaymentScheduleModel } from '@/models/contract';
import { COLORS, Styles } from '@/theme';
import Utils from '@/utils/Utils';
import DateUtils from '@/utils/DateUtils';
import { BUTTON_STYLES } from '@/components/elements/button/constants';
import Navigator from '@/routers/Navigator';
import ScreenNames from '@/commons/ScreenNames';

const PaymentScheduleDetail = observer(({ route }: { route: any }) => {
    const [contractDetail] = useState<ContractDetailModel>(route.params.contractDetail);
    const [currentPeriod] = useState<PaymentScheduleModel>(route?.params.item);

    const onPay = useCallback(() => {
        Navigator.pushScreen(ScreenNames.contractPayment, { contractDetail, isPayAll: false });
    }, [contractDetail]);

    const renderDetail = useMemo(() => {
        return (
            <>
                <KeyValue
                    label={Languages.paymentScheduleDetail.totalPeriodPay}
                    value={Utils.formatMoney(currentPeriod.tien_tra_1_ky)}
                />
                <KeyValue
                    label={Languages.paymentScheduleDetail.principalMustPay}
                    value={Utils.formatMoney(currentPeriod.tien_goc_1ky)}
                />
                <KeyValue
                    label={Languages.paymentScheduleDetail.interestMustPay}
                    value={Utils.formatMoney(currentPeriod.tien_lai_1ky_phai_tra)}
                />
                <KeyValue
                    label={Languages.paymentScheduleDetail.feeMustPay}
                    value={Utils.formatMoney(currentPeriod.tien_phi_1ky_phai_tra)}
                />
                <KeyValue
                    label={Languages.paymentScheduleDetail.lateFeePay}
                    value={Utils.formatMoney(currentPeriod.penalty_now)}
                />
                <KeyValue
                    label={Languages.paymentScheduleDetail.remainingBalance}
                    value={Utils.formatMoney(currentPeriod.con_lai_chua_tra)}
                />
                <KeyValue
                    label={Languages.paymentScheduleDetail.latePaymentDate}
                    value={`${Math.max(Number(currentPeriod.so_ngay_cham_tra_now || 0), 0)} ${Languages.paymentScheduleDetail.date}`}
                />
                <KeyValue
                    label={Languages.paymentScheduleDetail.status}
                    value={currentPeriod.status === 2 ? Languages.paymentScheduleDetail.payed : Languages.paymentScheduleDetail.notPaid}
                    noIndicator
                />
            </>
        );
    }, [currentPeriod]);

    const renderDash = useMemo(() => {
        return (
            <Dash dashThickness={1}
                dashGap={3}
                dashLength={8}
                dashColor={COLORS.GRAY_8} />
        );
    }, []);

    const renderHeader = useMemo(() => {
        return <HeaderBar
            title={`${Languages.paymentScheduleDetail.paymentScheduleDetailTitle} ${currentPeriod.ky_tra}`}
            hasBack />;
    }, [currentPeriod.ky_tra]);

    const renderPeriod = useMemo(() => {
        return <View style={styles.periodText}>
            <Text style={styles.leftText}>{Languages.paymentScheduleDetail.period} {currentPeriod.ky_tra}</Text>
            <Text style={styles.rightText}>{DateUtils.getLongFromDate(currentPeriod.ngay_ky_tra)}</Text>
        </View>;
    }, [currentPeriod.ky_tra, currentPeriod.ngay_ky_tra]);

    const renderFooter = useMemo(() => {
        return currentPeriod.da_thanh_toan === 0 && (
            <View style={styles.wrapFinalSett}>
                <View style={styles.wrapItemTotalFinalSett}>
                    <Text style={styles.textTotalFinalSett}>{Languages.paymentScheduleDetail.totalMoney}</Text>
                    <Text style={styles.textTotalPayedStyle}>{Utils.formatMoney(currentPeriod.tien_thanh_toan)}</Text>
                </View>
                <Button
                    onPress={onPay}
                    label={Languages.paymentScheduleDetail.pay}
                    buttonStyle={BUTTON_STYLES.GREEN}
                    fontSize={Configs.FontSize.size14}
                    style={styles.wrapBtnFinalSett} />
            </View>
        );
    }, [currentPeriod.da_thanh_toan, currentPeriod.tien_thanh_toan, onPay]);

    return (
        <View style={styles.container}>
            {renderHeader}
            <ScrollView>
                <View style={styles.payContainer}>
                    {renderPeriod}
                    {renderDash}
                    {renderDetail}
                </View>
            </ScrollView>
            {/* {renderFooter} */}
        </View>
    );
});

export default PaymentScheduleDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    payContainer: {
        flex: 1,
        margin: 15,
        borderWidth: 1,
        justifyContent: 'space-between',
        borderRadius: 14,
        borderColor: COLORS.LIGHT_BLUE,
        paddingHorizontal: 12,
        backgroundColor: COLORS.WHITE
    },
    periodText: {
        flexDirection: 'row',
        marginVertical: 11,
        justifyContent: 'space-between'
    },
    leftText: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size16,
        color: COLORS.DARK_GRAY
    },
    rightText: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size14,
        color: COLORS.DARK_GRAY
    },
    wrapFinalSett: {
        ...Styles.shadow,
        borderTopEndRadius: 22,
        borderTopStartRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingTop: 10,
        paddingBottom: PADDING_BOTTOM
    },
    wrapBtnFinalSett: {
        marginHorizontal: 16,
        marginBottom: 10
    },
    textTotalFinalSett: {
        ...Styles.typography.medium,
        color: COLORS.LIGHT_GRAY
    },
    wrapItemTotalFinalSett: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 13,
        marginBottom: 15
    },
    textTotalPayedStyle: {
        ...Styles.typography.medium,
        color: COLORS.GREEN,
        fontSize: Configs.FontSize.size20
    }
});
