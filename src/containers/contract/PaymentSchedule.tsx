import { observer } from 'mobx-react';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Dash from 'react-native-dash';

import { Configs, PADDING_BOTTOM } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { Button, HeaderBar } from '@/components';
import { BUTTON_STYLES } from '@/components/elements/button/constants';
import { ContractDetailModel, PaymentScheduleModel } from '@/models/contract';
import Utils from '@/utils/Utils';
import { COLORS, Styles } from '../../theme';
import DateUtils from '@/utils/DateUtils';
import ScreenNames from '@/commons/ScreenNames';
import Navigator from '@/routers/Navigator';
import PaymentHelper from '@/helper/PaymentHelper';
import KeyValue from '@/components/KeyValue';
import KeyValueMore from '@/components/KeyValueMore';

const PaymentSchedule = observer(({ route }: { route: any }) => {
    const [contractDetail] = useState<ContractDetailModel>(route.params.contractDetail);
    const [isPaidAll] = useState<boolean>(route?.params.isPaidAll);
    const [paymentScheduleData] = useState<PaymentScheduleModel[]>(contractDetail?.lich_thanh_toan);

    const valueContractsData = useMemo(() => {
        return (
            paymentScheduleData.filter((item: PaymentScheduleModel) => {
                return item?.code_contract_disbursement === contractDetail?.hop_dong.ma_hop_dong;
            }));

    }, [contractDetail?.hop_dong.ma_hop_dong, paymentScheduleData]);

    const valueContractsPaid = useMemo(() => {
        return (
            valueContractsData?.filter((item: PaymentScheduleModel) => {
                return item.status === 2;
            }));
    }, [valueContractsData]);

    const valueContractsMustPay = useMemo(() => {
        return (
            valueContractsData?.filter((item: PaymentScheduleModel) => {
                return item.status !== 2;
            }));
    }, [valueContractsData]);

    const renderDash = useMemo(() => {
        return (
            <Dash
                dashThickness={1}
                dashLength={8}
                dashColor={COLORS.GRAY_8}
                dashGap={3}
            />
        );
    }, []);


    const onPayAll = useCallback(() => {
        Navigator.pushScreen(ScreenNames.contractPayment, { contractDetail, isPayAll: true });
    }, [contractDetail]);

    const onPay = useCallback(() => {
        Navigator.pushScreen(ScreenNames.contractPayment, { contractDetail, isPayAll: false });
    }, [contractDetail]);

    const isShowPayOne = useMemo(() => {
        return !isPaidAll && !PaymentHelper.isDisablePayOne(contractDetail) && !PaymentHelper.isHidePayOne(contractDetail);
    },[contractDetail, isPaidAll]);

    const renderItem = useCallback(({ item, index }: any) => {
        const onNavigatePaymentScheduleDetailMustPay = () => {
            Navigator.pushScreen(ScreenNames.paymentScheduleDetail, { item, contractDetail });
        };

        return (
            <View style={styles.wrapItem}>
                <View style={styles.wrapItemIndexPeriod}>
                    <Text style={styles.textPeriodStyle}>{Languages.paymentSchedule.period} {item?.ky_tra}</Text>
                    {index === 0 && isShowPayOne && (
                        <Button
                            onPress={onPay}
                            label={Languages.paymentSchedule.pay}
                            buttonStyle={BUTTON_STYLES.GREEN_1}
                            style={styles.wrapBtn1}
                            fontSize={Configs.FontSize.size12}
                        />
                    )}
                </View>
                <View style={styles.wrapItemList}>
                    {(index !== 0 || !isShowPayOne) && <>{renderDash}</>}

                    <KeyValue label={Languages.paymentSchedule.datePay}
                        value={DateUtils.getLongFromDate(item?.ngay_ky_tra)}
                        styleKeyColor={styles.colorLeftText}
                        color={COLORS.DARK_GRAY}
                    />
                    <KeyValue label={Languages.paymentSchedule.moneyPayed}
                        value={Utils.formatMoney(item?.tien_thanh_toan)}
                        styleKeyColor={styles.colorLeftText}
                        color={COLORS.DARK_GRAY}
                    />
                    <KeyValue label={Languages.paymentSchedule.debt}
                        value={Utils.formatMoney(item?.con_lai_chua_tra)}
                        styleKeyColor={styles.colorLeftText}
                        color={COLORS.DARK_GRAY}
                        noIndicator
                    />
                </View>
                <Button label={Languages.paymentSchedule.detailSee}
                    buttonStyle={BUTTON_STYLES.BLUE_1}
                    style={styles.wrapBtn2}
                    fontSize={Configs.FontSize.size12}
                    isLowerCase={true}
                    onPress={onNavigatePaymentScheduleDetailMustPay} />

            </View>
        );
    }, [contractDetail, isShowPayOne, onPay, renderDash]);

    const keyExtractor = useCallback((item: PaymentScheduleModel) => {
        return `${item?._id?.$oid}${item?.code_contract_disbursement}`;
    }, []);

    const renderItemPayed = useCallback(({ item }: any) => {
        const onNavigatePaymentScheduleDetailPayed = () => {
            Navigator.pushScreen(ScreenNames.paymentScheduleDetail, { item, contractDetail });
        };
        return (
            <View style={styles.wrapItemPayed}>
                <KeyValueMore label={`${Languages.paymentSchedule.period} ${item?.ky_tra}`}
                    onPress={onNavigatePaymentScheduleDetailPayed}
                />
            </View>
        );
    }, [contractDetail]);

    const renderPeriod = useMemo(() => {
        return (
            valueContractsPaid.length > 0 && <View style={styles.period}>
                <View style={styles.blankView} />
                <Text style={styles.titlePeriodPayedStyle}>{Languages.paymentSchedule.periodPayed}</Text>
                <FlatList
                    data={valueContractsPaid}
                    renderItem={renderItemPayed}
                    keyExtractor={keyExtractor}
                />
            </View>
        );
    }, [keyExtractor, renderItemPayed, valueContractsPaid]);

    const renderTop = useMemo(() => {
        return (
            <View style={styles.topContainer}>
                <View style={styles.payedContainer}>
                    <Text style={styles.textTotalPayed}>{Languages.paymentSchedule.totalPayed}</Text>
                    <Text style={styles.textTotalPayedStyle}>{Utils.formatMoney(contractDetail?.thanh_toan?.chi_tiet.tong_tien_da_thanh_toan)}</Text>
                </View>
                {renderDash}
                <View style={styles.payedContainer}>
                    <Text style={styles.textTotalPayed}>{Languages.paymentSchedule.debtTotal}</Text>
                    <Text style={styles.textTotalDebtStyle}>{Utils.formatMoney(contractDetail?.thanh_toan.chi_tiet?.con_lai_chua_tra)}</Text>
                </View>
            </View>
        );
    }, [contractDetail?.thanh_toan.chi_tiet.con_lai_chua_tra, contractDetail?.thanh_toan.chi_tiet.tong_tien_da_thanh_toan, renderDash]);

    const renderFooter = useMemo(() => {
        return (
            <View style={styles.wrapFinalSett}>
                <View style={styles.wrapItemTotalFinalSett}>
                    <Text style={styles.textTotalFinalSett}>{Languages.paymentSchedule.totalFinalSett}</Text>
                    <Text style={styles.textTotalPayedStyle}>{PaymentHelper.getPaymentAmountAsString(contractDetail, true)}</Text>
                </View>
                <Button
                    onPress={onPayAll}
                    label={Languages.paymentSchedule.finalSettlement}
                    buttonStyle={BUTTON_STYLES.GREEN}
                    fontSize={Configs.FontSize.size14}
                    style={styles.wrapBtnFinalSett} />
            </View>
        );
    }, [contractDetail, onPayAll]);

    return (
        <View style={styles.container}>
            <HeaderBar title={Languages.contracts.historyPayment} hasBack />

            <View style={styles.payContainer}>
                {!isPaidAll && renderTop}
                <FlatList
                    data={valueContractsMustPay}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    ListFooterComponent={renderPeriod}
                    style={styles.wrapFlatPay}
                />
            </View>
            {!isPaidAll && renderFooter}
        </View>
    );
});

export default PaymentSchedule;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    topContainer: {
        width: '90%',
        borderWidth: 1,
        borderRadius: 14,
        borderColor: COLORS.LIGHT_BLUE,
        paddingHorizontal: 12,
        marginTop: 18
    },
    wrapItem: {
        borderWidth: 1,
        alignItems: 'center',
        marginVertical: 10,
        borderRadius: 14,
        borderColor: COLORS.LIGHT_BLUE,
        marginHorizontal: 18
    },
    wrapItemPayed: {
        alignItems: 'center',
        marginBottom: 3,
        borderColor: COLORS.LIGHT_BLUE,
        justifyContent: 'space-between'
    },
    payContainer: {
        alignItems: 'center',
        flex: 1
    },
    payedContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4
    },
    wrapFlatPay: {
        width: '100%',
        marginHorizontal: 16,
        marginVertical: 10
    },
    wrapItemList: {
        width: '100%',
        paddingHorizontal: 12
    },
    wrapItemIndexPeriod: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
        paddingHorizontal: 12,
        paddingTop: 8
    },
    wrapItemTotalFinalSett: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 5,
        paddingHorizontal: 13,
        marginBottom: 15
    },
    textTotalPayed: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size13,
        color: COLORS.DARK_GRAY
    },
    wrapBtn1: {
        width: '55%',
        paddingVertical: 10,
        marginRight: 6
    },
    wrapBtn2: {
        paddingVertical: 6,
        marginTop: 4,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12
    },
    colorLeftText: {
        ...Styles.typography.regular,
        color: COLORS.DARK_GRAY,
        fontSize: Configs.FontSize.size13
    },
    textTotalPayedStyle: {
        ...Styles.typography.medium,
        color: COLORS.GREEN_1,
        fontSize: Configs.FontSize.size20
    },
    textTotalDebtStyle: {
        ...Styles.typography.medium,
        color: COLORS.RED_1,
        fontSize: Configs.FontSize.size20
    },
    textPeriodStyle: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size16,
        color: COLORS.DARK_GRAY
    },
    titlePeriodPayedStyle: {
        ...Styles.typography.medium,
        marginLeft: 16
    },
    textPeriodPayedStyle: {
        ...Styles.typography.regular,
        color: COLORS.DARK_GRAY
    },
    wrapFinalSett: {
        ...Styles.shadow,
        borderTopEndRadius: 22,
        borderTopStartRadius: 22,
        marginTop: -10,
        paddingTop: 10,
        paddingBottom: PADDING_BOTTOM
    },
    wrapBtnFinalSett: {
        marginHorizontal: 16
    },
    textTotalFinalSett: {
        ...Styles.typography.medium,
        color: COLORS.LIGHT_GRAY
    },
    blankView: {
        paddingVertical: 5,
        backgroundColor: COLORS.GRAY_10,
        marginVertical: 20
    },
    period: {
        paddingBottom: 5
    }
});
