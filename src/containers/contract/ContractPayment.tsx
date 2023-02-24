import { observer } from 'mobx-react';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import HTMLView from 'react-native-htmlview';

import IcSuccess from '@/assets/images/ic_successful.svg';
import { Configs, PADDING_BOTTOM } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { Button, HeaderBar, Touchable } from '@/components';
import { BUTTON_STYLES } from '@/components/elements/button/constants';
import KeyValue from '@/components/KeyValue';
import PopupPaymentStatus, { PopupPaymentStatusActions } from '@/components/PopupPaymentStatus';
import PaymentHelper, { PAYMENT_TYPE } from '@/helper/PaymentHelper';
import { useAppStore } from '@/hooks';
import { ContractDetailModel } from '@/models/contract';
import { COLORS, HtmlStyles, Styles } from '@/theme';
import ToastUtils from '@/utils/ToastUtils';
import Utils from '@/utils/Utils';
import PaymentMethod, { PAYMENT_METHODS } from './PaymentMethod';
import Navigator from '@/routers/Navigator';
import ScreenNames, { TabNames } from '@/commons/ScreenNames';
import PopupPolicy from '@/components/PopupPolicy';
import { PopupActions } from '@/components/popup/types';
import MyLoading from '@/components/MyLoading';


const ContractPayment = observer(({ route }: { route: any }) => {
    const { apiServices } = useAppStore();

    const [contractDetail] = useState<ContractDetailModel>(route?.params?.contractDetail);
    const [isPayAll] = useState<boolean>(route?.params?.isPayAll);

    const [paymentMethod, setPaymentMethod] = useState<string>(PAYMENT_METHODS.NONE);
    const currentMomoTransactionRef = useRef<string>();
    const popupAlert = useRef<PopupPaymentStatusActions>(null);
    const popupPolicyRef = useRef<PopupActions>(null);
    const [isLoading, setLoading] = useState<boolean>(false);

    const amount = useMemo(() => {
        return PaymentHelper.getPaymentAmount(contractDetail, isPayAll);
    }, [contractDetail, isPayAll]);

    const showPaymentStatus = useCallback((status: string) => {
        let title = Languages.contractPayment.payUnknown;
        let msg = Languages.contractPayment.payFinished;
        if (status === '2') {
            title = isPayAll ? Languages.contractPayment.payAllSuccess : Languages.contractPayment.payOneSuccess;
            msg = Languages.contractPayment.paySuccess
                .replace('%s1', contractDetail?.hop_dong?.ma_hop_dong)
                .replace('%s2', title)
                .replace('%s3', Utils.formatMoney(amount));
        }

        popupAlert.current?.showWithContent?.(title, msg);
    }, [amount, contractDetail?.hop_dong?.ma_hop_dong, isPayAll]);

    const onPayMomo = useCallback(() => {
        Utils.checkMomoIsAvailable(async (isInstalled: boolean) => {
            // if (isInstalled) {
            const hop_dong = contractDetail.hop_dong;
            setLoading(true);
            const res = await apiServices.paymentServices.payMomo(hop_dong?.id?.$oid,
                amount,
                isPayAll ? PAYMENT_TYPE.PAYMENT_MOMO_FINAL : PAYMENT_TYPE.PAYMENT_MOMO_TERM) as any;
            setLoading(false);
            if (res?.data?.target) {
                currentMomoTransactionRef.current = res?.transactionId;
                Utils.openURL(res.data.target);
            }
            // } else {
            //     ToastUtils.showErrorToast(Languages.errorMsg.missingMomo);
            // }
        });
    }, [amount, apiServices.paymentServices, contractDetail.hop_dong, isPayAll]);

    const onPayBank = useCallback(async () => {
        const chi_tiet = contractDetail?.thanh_toan.chi_tiet;
        const hop_dong = contractDetail.hop_dong;
        setLoading(true);
        const res = await apiServices.paymentServices.payBank(hop_dong?.code_contract, hop_dong?.ma_hop_dong,
            amount, chi_tiet.ki_toi, hop_dong?.khach_hang, hop_dong?.so_dien_thoai,
            isPayAll ? PAYMENT_TYPE.PAYMENT_BANK_FINAL : PAYMENT_TYPE.PAYMENT_BANK_TERM) as any;
        setLoading(false);
        if (res?.data?.url) {
            Navigator.pushScreen(ScreenNames.paymentWebview, {
                url: res.data.url,
                amount
            });
        }
    }, [amount, apiServices.paymentServices, contractDetail.hop_dong, contractDetail?.thanh_toan.chi_tiet, isPayAll]);

    const onPay = useCallback(() => {
        if (paymentMethod === PAYMENT_METHODS.MOMO) {
            onPayMomo();
        } else if (paymentMethod === PAYMENT_METHODS.BANK) {
            onPayBank();
        } else {
            ToastUtils.showErrorToast(Languages.errorMsg.missingPaymentMethod);
        }
    }, [onPayBank, onPayMomo, paymentMethod]);

    const getLastFeeForPayAll = useMemo(() => {
        return amount - contractDetail.thanh_toan.chi_tiet.phi_phat_cham_tra - contractDetail.thanh_toan.chi_tiet.phi_tat_toan_truoc_han;
    }, [amount, contractDetail.thanh_toan.chi_tiet.phi_phat_cham_tra, contractDetail.thanh_toan.chi_tiet.phi_tat_toan_truoc_han]);

    const getCurrentPeriod = useMemo(() => {
        const currentPeriod = contractDetail.thanh_toan.chi_tiet.ki_toi;
        return contractDetail.lich_thanh_toan.find(item => item.ky_tra === currentPeriod);
    }, [contractDetail.lich_thanh_toan, contractDetail.thanh_toan.chi_tiet.ki_toi]);

    const remainingAmount = useMemo(() => {
        let total = 0;
        const currentPeriod = contractDetail.thanh_toan.chi_tiet.ki_toi;
        contractDetail.lich_thanh_toan.forEach(item => {
            if (item.status === 1 && item.ky_tra <= currentPeriod) {
                total += item.da_thanh_toan;
            }
        });
        return total;
    }, [contractDetail.lich_thanh_toan, contractDetail.thanh_toan.chi_tiet.ki_toi]);

    const missingAmount = useMemo(() => {
        let total = 0;
        const currentPeriod = contractDetail.thanh_toan.chi_tiet.ki_toi;
        contractDetail.lich_thanh_toan.forEach(item => {
            if (item.ky_tra < currentPeriod) {
                total += item.con_lai_chua_tra;
            }
        });

        return total;
    }, [contractDetail.lich_thanh_toan, contractDetail.thanh_toan.chi_tiet.ki_toi]);

    const renderDetail = useMemo(() => {
        return (
            <View style={styles.topContainer}>
                <KeyValue
                    label={Languages.contractPayment.contractCode}
                    value={contractDetail?.hop_dong?.ma_hop_dong}
                />
                <KeyValue
                    label={Languages.contractPayment.fullName}
                    value={contractDetail?.hop_dong?.khach_hang}
                />

                {isPayAll ? <>
                    <KeyValue
                        label={Languages.contractPayment.originPayment}
                        value={Utils.formatMoney(getLastFeeForPayAll)}
                    />
                    <KeyValue
                        label={Languages.contractPayment.lateFeePay}
                        value={Utils.formatMoney(contractDetail?.thanh_toan.chi_tiet.phi_phat_cham_tra)}
                    />
                    <KeyValue
                        label={Languages.contractPayment.feePaidSoon}
                        value={Utils.formatMoney(contractDetail?.thanh_toan.chi_tiet.phi_tat_toan_truoc_han)}
                        noIndicator
                    />
                </> : <>
                    <KeyValue
                        label={Languages.contractPayment.moneyInPeriod}
                        value={Utils.formatMoney(getCurrentPeriod?.tien_tra_1_ky)}
                    />
                    <KeyValue
                        label={Languages.contractPayment.previousPeriodBalance}
                        value={Utils.formatMoney(remainingAmount)}
                    />
                    <KeyValue
                        label={Languages.contractPayment.missingMoneyLastPeriod}
                        value={Utils.formatMoney(missingAmount)}
                    />
                    <KeyValue
                        label={Languages.contractPayment.lateFeePay}
                        value={Utils.formatMoney(getCurrentPeriod?.penalty_now)}
                        noIndicator
                    />
                </>}
            </View>
        );
    }, [contractDetail?.hop_dong?.khach_hang, contractDetail?.hop_dong?.ma_hop_dong, contractDetail?.thanh_toan.chi_tiet.phi_phat_cham_tra, contractDetail?.thanh_toan.chi_tiet.phi_tat_toan_truoc_han, getCurrentPeriod?.penalty_now, getCurrentPeriod?.tien_tra_1_ky, getLastFeeForPayAll, isPayAll, missingAmount, remainingAmount]);

    const paymentLabel = useMemo(() => {
        return isPayAll ? Languages.paymentSchedule.finalSettlement : Languages.paymentScheduleDetail.pay;
    }, [isPayAll]);

    const showPolicyPopup = useCallback(() => {
        popupPolicyRef?.current?.show();
    }, []);

    const renderMore = useMemo(() => {
        return (
            <Touchable style={styles.wrapMore}
                onPress={showPolicyPopup}>
                <HTMLView
                    stylesheet={HtmlStyles || undefined}
                    value={Languages.contractPayment.more.replace('%s', paymentLabel)}
                />
            </Touchable>
        );
    }, [paymentLabel, showPolicyPopup]);

    const renderFooter = useMemo(() => {
        return (
            <View style={styles.wrapFinalSett}>
                <View style={styles.wrapItemTotalFinalSett}>
                    <Text style={styles.textTotalFinalSett}>{Languages.paymentScheduleDetail.totalMoney}</Text>
                    <Text style={styles.textTotalPayedStyle}>{Utils.formatMoney(amount)}</Text>
                </View>
                <Button
                    onPress={onPay}
                    label={paymentLabel}
                    buttonStyle={paymentMethod === PAYMENT_METHODS.NONE ? BUTTON_STYLES.GRAY : BUTTON_STYLES.GREEN}
                    fontSize={Configs.FontSize.size14}
                    style={styles.wrapBtnFinalSett} />
            </View>
        );
    }, [amount, onPay, paymentLabel, paymentMethod]);

    const onNavigateHistory = useCallback(() => {
        Navigator.navigateToDeepScreen([ScreenNames.tabs], TabNames.historyTab);
    }, []);

    const renderPopup = useMemo(() => {
        return <>
            <PopupPolicy
                ref={popupPolicyRef}
            />
            <PopupPaymentStatus
                icon={<IcSuccess width={50} height={50} />}
                title={Languages.notify.title}
                content={Languages.contractPayment.payFinished}
                ref={popupAlert}
                showBtn={false}
                onClose={onNavigateHistory}
            />
        </>;
    }, [onNavigateHistory]);

    const onUpdateTransaction = useCallback(async () => {
        console.log('onUpdateTransaction');
        console.log('currentMomoTransactionRef.current = ', currentMomoTransactionRef.current);
        if (currentMomoTransactionRef.current) {
            setLoading(true);
            const res = await apiServices.paymentServices.checkTransactionInfo(currentMomoTransactionRef.current) as any;
            setLoading(false);
            if (res?.data) {
                showPaymentStatus(res?.data?.contract_status);
            }
        }
    }, [apiServices.paymentServices, showPaymentStatus]);

    const onUpdatePaymentMethod = useCallback((method: string) => {
        setPaymentMethod(method);
    }, []);

    return (
        <View style={styles.container}>
            <HeaderBar title={contractDetail?.hop_dong?.ma_hop_dong} />
            <ScrollView contentContainerStyle={styles.payContainer}>
                {renderDetail}
                <HTMLView
                    stylesheet={HtmlStyles}
                    value={Languages.contractDetail.note}
                />
                <View style={styles.wrapBtnFinalSett}>
                    <Text style={styles.payMethodText}>{Languages.contractPayment.payMethod}</Text>
                    <PaymentMethod
                        onUpdateTransaction={onUpdateTransaction}
                        onUpdatePaymentMethod={onUpdatePaymentMethod} />
                </View>
                {renderMore}
            </ScrollView>
            {renderFooter}
            {renderPopup}
            {isLoading && <MyLoading isOverview />}
        </View>
    );
});

export default ContractPayment;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between'
    },
    topContainer: {
        width: '90%',
        borderWidth: 1,
        justifyContent: 'space-between',
        borderRadius: 14,
        borderColor: COLORS.LIGHT_BLUE,
        paddingHorizontal: 12,
        backgroundColor: COLORS.WHITE,
        marginTop: 16
    },
    payContainer: {
        alignItems: 'center'
    },
    wrapIconPay: {
        flexDirection: 'row',
        marginTop: 10
    },
    wrapIcon: {
        ...Styles.shadow,
        flex: 1,
        borderWidth: 1,
        borderColor: COLORS.GRAY_10,
        marginHorizontal: 10,
        borderRadius: 10,
        padding: 10,
        alignItems: 'center'
    },
    payMethodText: {
        ...Styles.typography.medium,
        color: COLORS.DARK_GRAY
    },
    payMethodTitle: {
        ...Styles.typography.regular,
        color: COLORS.DARK_GRAY,
        fontSize: Configs.FontSize.size12,
        marginTop: 10
    },
    borderGreen: {
        borderColor: COLORS.GREEN_1
    },
    colorGreen: {
        color: COLORS.GREEN_1
    },
    wrapFinalSett: {
        ...Styles.shadow,
        borderTopEndRadius: 22,
        borderTopStartRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingBottom: PADDING_BOTTOM,
        paddingTop: 15
    },
    wrapBtnFinalSett: {
        marginHorizontal: 16
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
        paddingHorizontal: 15,
        marginBottom: 15
    },
    textTotalPayedStyle: {
        ...Styles.typography.medium,
        color: COLORS.GREEN,
        fontSize: Configs.FontSize.size20
    },
    wrapMore: {
        justifyContent: 'center',
        marginHorizontal: 40,
        marginBottom: 10
    }
});
