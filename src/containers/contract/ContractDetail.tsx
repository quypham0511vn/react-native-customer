import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import IcCalendar from '@/assets/images/ic_calendar.svg';
import IcCar from '@/assets/images/ic_car.svg';
import IcCredit from '@/assets/images/ic_credit.svg';
import IcFolder from '@/assets/images/ic_folder_small.svg';
import IcLand from '@/assets/images/ic_land.svg';
import IcMoto from '@/assets/images/ic_moto.svg';
import IcTime from '@/assets/images/ic_time_2.svg';
import Img3Lines from '@/assets/images/img_3_lines.svg';
import { Configs, PADDING_BOTTOM } from '@/commons/Configs';
import { PRODUCT } from '@/commons/constants';
import Languages from '@/commons/Languages';
import ScreenNames from '@/commons/ScreenNames';
import { Button, HeaderBar } from '@/components';
import { BUTTON_STYLES } from '@/components/elements/button/constants';
import KeyValue from '@/components/KeyValue';
import KeyValueMore from '@/components/KeyValueMore';
import MyLoading from '@/components/MyLoading';
import { useAppStore } from '@/hooks';
import { ContractDetailModel, ContractModel } from '@/models/contract';
import Navigator from '@/routers/Navigator';
import { COLORS, IconSize, Styles } from '@/theme';
import Utils from '@/utils/Utils';
import PaymentHelper from '@/helper/PaymentHelper';
import PopupVerifyRequest from '@/components/PopupVerifyRequest';
import IcInfo from '@/assets/images/ic_info.svg';
import { PopupActionTypes } from '@/models/typesPopup';

const ContractDetail = observer(({ route }: { route: any }) => {
    const { apiServices } = useAppStore();

    const [contract] = useState<ContractModel>(route?.params.contract);
    const [isPaidAll] = useState<boolean>(route?.params.isPaidAll);
    const [contractDetail, setContractDetail] = useState<ContractDetailModel>();
    const [isLoading, setLoading] = useState<boolean>(true);
    const popupAlert = useRef<PopupActionTypes>(null);

    const isHidePayOne = useMemo(() => PaymentHelper.isHidePayOne(contractDetail), [contractDetail]);

    const isDisablePayOne = useMemo(() => PaymentHelper.isDisablePayOne(contractDetail), [contractDetail]);

    const isDisablePayAll = useMemo(() => PaymentHelper.isDisablePayAll(contractDetail), [contractDetail]);

    const fetchData = useCallback(async () => {
        const res = await apiServices.contract.getContractDetail(contract.id.$oid);

        setContractDetail(res.data as ContractDetailModel);
        setLoading(false);

    }, [apiServices.contract, contract.id.$oid]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const showInfo = useCallback(() => {
        popupAlert.current?.show();
    }, []);

    const contractLogo = useMemo(() => {
        switch (contract.san_pham_vay) {
            case PRODUCT.CAR:
                return <IcCar {...IconSize.size60_60} />;
            case PRODUCT.LAND:
                return <IcLand {...IconSize.size60_60} />;
            case PRODUCT.CREDIT:
                return <IcCredit {...IconSize.size60_60} />;
            default:
                return <IcMoto {...IconSize.size60_60} />;
        }
    }, [contract.san_pham_vay]);

    const renderHeader = useMemo(() => {
        return <View style={styles.header}>
            <Img3Lines />
            <View style={styles.header2}>
                {contractLogo}
            </View>
        </View>;
    }, [contractLogo]);

    const onPay = useCallback(() => {
        if (isDisablePayOne) {
            showInfo();
        } else {
            Navigator.pushScreen(ScreenNames.contractPayment, { contractDetail, isPayAll: false });
        }
    }, [contractDetail, isDisablePayOne, showInfo]);

    const onPayAll = useCallback(() => {
        Navigator.pushScreen(ScreenNames.contractPayment, { contractDetail, isPayAll: true });
    }, [contractDetail]);

    const onPaymentSchedule = useCallback(() => {
        Navigator.pushScreen(ScreenNames.paymentSchedule, {contractDetail, isPaidAll});
    }, [contractDetail, isPaidAll]);

    const onPaymentHistory = useCallback(() => {
        Navigator.pushScreen(ScreenNames.paymentHistory, contract);
    }, [contract]);

    const onNavigateDocument = useCallback(() => {
        Navigator.pushScreen(ScreenNames.document, contract.id.$oid);
    }, [contract.id.$oid]);

    const renderMainDetail = useMemo(() => {
        const contractInfo = contractDetail?.hop_dong;
        return contractInfo && <View style={styles.sectionContainer}>
            <KeyValue
                label={Languages.contractDetail.fields[0]}
                value={contractInfo.ma_hop_dong}
            />
            <KeyValue
                label={Languages.contractDetail.fields[1]}
                value={contractInfo.khach_hang}
            />
            <KeyValue
                label={Languages.contractDetail.fields[2]}
                value={contractInfo.hinh_thuc_vay}
            />
            <KeyValue
                label={Languages.contractDetail.fields[3]}
                value={Utils.formatMoney(contractInfo.so_tien_vay)}
            />
            <KeyValue
                label={Languages.contractDetail.fields[4]}
                value={contractInfo.ngay_giai_ngan}
            />
            <KeyValue
                label={Languages.contractDetail.fields[5]}
                value={contractInfo.ki_han_vay}
            />
            <KeyValue
                label={Languages.contractDetail.fields[6]}
                value={contractInfo.ngay_dao_han}
            />
            <KeyValue
                label={Languages.contractDetail.fields[7]}
                value={contractInfo.trang_thai_hop_dong}
            />
            <KeyValue
                label={Languages.contractDetail.fields[8]}
                value={contractInfo.hinh_thuc_tra_lai}
                noIndicator
            />
        </View>;
    }, [contractDetail?.hop_dong]);

    const renderExtraInfo = useMemo(() => {
        const contractInfo = contractDetail?.hop_dong;

        return <View style={styles.sectionContainer}>
            <KeyValue
                label={Languages.contractDetail.fields[14]}
                value={contractInfo?.tinh_trang_no}
            />
            <KeyValue
                label={Languages.contractDetail.fields[15]}
                value={`${Math.max(Number(contractInfo?.so_ngay_cham_tra || 0), 0)} ${Languages.paymentScheduleDetail.date}`}
                color={contract.color}
                noIndicator
            />
        </View>;
    }, [contract.color, contractDetail?.hop_dong]);

    const renderPopup = useMemo(() => {
        return <PopupVerifyRequest
            icon={<IcInfo width={50} height={50} />}
            title={Languages.contractPayment.paymentPending}
            content={Languages.contractPayment.pending}
            ref={popupAlert}
            showBtn={false}
        />;
    }, []);

    const renderMoreInfo = useMemo(() => {
        return <>
            <KeyValueMore
                label={Languages.contractDetail.paymentTime}
                leftIcon={<IcCalendar />}
                onPress={onPaymentSchedule}
            />
            <KeyValueMore
                label={Languages.contractDetail.history}
                leftIcon={<IcTime />}
                onPress={onPaymentHistory}
            />
            <KeyValueMore
                label={Languages.contractDetail.document}
                leftIcon={<IcFolder />}
                onPress={onNavigateDocument}
            />
        </>;
    }, [onNavigateDocument, onPaymentHistory, onPaymentSchedule]);

    return (
        <View style={styles.container}>
            <HeaderBar
                title={contract.ma_hop_dong} />

            {isLoading ? <MyLoading /> : <>
                {renderHeader}

                {!isPaidAll && !isDisablePayAll && <View style={styles.buttonContainer}>
                    {!isHidePayOne && <Button
                        label={Languages.contractDetail.pay}
                        onPress={onPay}
                        style={styles.button}
                        buttonStyle={isDisablePayOne ? BUTTON_STYLES.GRAY : BUTTON_STYLES.GREEN}
                    />}
                    <Button
                        label={Languages.contractDetail.payAll}
                        onPress={onPayAll}
                        style={styles.button}
                        buttonStyle={BUTTON_STYLES.GREEN}
                    />
                </View>}

                <ScrollView contentContainerStyle={styles.contentContainer}>
                    {renderMainDetail}
                    {!isPaidAll && renderExtraInfo}
                    {renderMoreInfo}
                </ScrollView>
                {renderPopup}
            </>}
        </View>
    );
});

export default ContractDetail;
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        alignItems: 'center',
        marginVertical: 20,
        justifyContent: 'center',
        height: IconSize.size60_60.height
    },
    header2: {
        position: 'absolute',
        left: 0,
        right: 0,
        alignItems: 'center'
    },
    contentContainer: {
        paddingBottom: PADDING_BOTTOM
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    button: {
        flex: 1,
        marginHorizontal: 10,
        height: Configs.FontSize.size35
    },
    sectionContainer: {
        borderRadius: 10,
        borderColor: COLORS.GRAY_2,
        borderWidth: 1,
        paddingHorizontal: 10,
        marginHorizontal: 10,
        marginTop: 10
    },
    bottomContainer: {
        ...Styles.shadow,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        backgroundColor: COLORS.WHITE,
        paddingBottom: 30,
        paddingHorizontal: 15,
        paddingTop: 15
    },
    bottomContentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 10
    },
    moneyTxt: {
        ...Styles.typography.medium,
        color: COLORS.LIGHT_GRAY,
        textTransform: 'uppercase'
    },
    money: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size20,
        color: COLORS.GREEN
    }
});
