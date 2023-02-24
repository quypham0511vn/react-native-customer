import { observer } from 'mobx-react';
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle
} from 'react-native';
import Dash from 'react-native-dash';

import ElectricBillIcon from '@/assets/images/ic_electric_bill.svg';
import FinanceBillIcon from '@/assets/images/ic_finance_bill.svg';
import WaterBillIcon from '@/assets/images/ic_water_bill.svg';
import { Configs } from '@/commons/Configs';
import { ENUM_ERROR_QUERY_BILL, ENUM_PROVIDERS_SERVICE } from '@/commons/constants';
import Languages from '@/commons/Languages';
import { HeaderBar, Touchable } from '@/components';
import { ItemProps } from '@/components/BottomSheet';
import { MyTextInput } from '@/components/elements/textfield';
import { TextFieldActions } from '@/components/elements/textfield/types';
import PickerValuation, { PickerAction } from '@/components/PickerValuation';
import PopupPolicy from '@/components/PopupPolicy';
import { useAppStore } from '@/hooks';
import {
    CreateBillPaymentModel,
    InformationPaymentModel,
    InformationRequestPaymentModel,
    ProvidersServiceModel
} from '@/models/paymentService';
import Navigator from '@/routers/Navigator';
import { COLORS, Styles } from '@/theme';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import FormValidate from '@/utils/FormValidate';
import Utils from '@/utils/Utils';
import PaymentMethod, { PAYMENT_METHODS } from './contract/PaymentMethod';
import { PopupActionTypes } from '@/models/typesPopup';
import ScreenNames from '@/commons/ScreenNames';
import ToastUtils from '@/utils/ToastUtils';
import MyLoading from '@/components/MyLoading';

const PaymentService = observer(({ route }: any) => {
    const { typeBill } = route.params;
    const [bill, setBill] = useState<ENUM_PROVIDERS_SERVICE>(typeBill);
    const [dataProvider, setDataProvider] = useState<ItemProps[] | []>([]);

    const [provider, setProvider] = useState<ItemProps>();

    const [customerCode, setCustomerCode] = useState<string>('');

    const [showInfo, setShowInfo] = useState<boolean>(false);
    const [usePayment, setUserPayment] = useState<boolean>(false);
    const [isLoading, setLoading] = useState<boolean>(false);

    const inputRef = useRef<TextFieldActions>(null);
    const providerRef = useRef<PickerAction>(null);
    const rulesRef = useRef<PopupActionTypes>(null);

    const [infoPayment, setInfoPayment] =
        useState<InformationPaymentModel | null>();

    const { apiServices } = useAppStore();

    const fetchDataProvider = useCallback(
        async (providerCode?: string) => {
            const res = await apiServices.paymentBillServices.getProviders(
                providerCode || ''
            );
            if (res?.success) {
                const data = res?.data as ProvidersServiceModel;
                const temp: ItemProps[] = data.publisher?.map((item: any) => {
                    return {
                        id: item?.code,
                        value: item?.name
                    };
                });
                setDataProvider(temp);
            }
        },
        [apiServices.paymentBillServices]
    );
    const onPayment = useCallback(async () => {
        const res = await apiServices?.paymentBillServices?.paymentBill(
            bill,
            customerCode,
            provider?.id || '',
            infoPayment?.code || '',
            infoPayment?.amount || 0
        );
        if (res.success) {
            const data = res?.data as CreateBillPaymentModel;
            Navigator.pushScreen(ScreenNames.paymentWebview, {
                url: data?.url,
                isPayingService: true
            });
        }
    }, [
        apiServices?.paymentBillServices,
        bill,
        customerCode,
        infoPayment?.amount,
        infoPayment?.code,
        provider?.id
    ]);

    useEffect(() => {
        fetchDataProvider(bill);
        setProvider({});
        setShowInfo(false);
        setInfoPayment(null);
    }, [bill]);

    const onContinue = useCallback(async () => {
        const errorCode = FormValidate.validateCustomCode(customerCode);
        const errorProvider = provider?.id ? '' : Languages.paymentService.provider;
        inputRef.current?.setErrorMsg(errorCode);
        providerRef.current?.setErrorMsg(errorProvider);
        if (`${errorCode}${errorProvider}`.length === 0) {
            const res = await apiServices?.paymentBillServices?.getInfoPayment(
                bill,
                customerCode,
                provider?.id || ''
            );
            if (res.success) {
                setLoading(true);
                const data = res?.data as InformationRequestPaymentModel;
                setLoading(false);
                if (data?.data?.billDetail) {
                    const temp: InformationPaymentModel = {
                        customerName: data?.data?.customerInfo?.customerName,
                        customerCode: data?.data.customerInfo.customerCode,
                        customerAddress: data?.data?.customerInfo.customerAddress,
                        customerOtherInfo: data?.data?.customerInfo?.customerOtherInfo,
                        amount: data?.data?.billDetail[0]?.amount,
                        code: data?.code
                    };
                    setInfoPayment(temp);
                    setShowInfo(true);
                }
            }
            else {
                const { error_code } = res?.data as InformationRequestPaymentModel;
                switch (error_code) {
                    case ENUM_ERROR_QUERY_BILL.NOT_FOUND:
                        ToastUtils.showMsgToast(Languages.errorMsg.errQuery);
                        break;
                    case ENUM_ERROR_QUERY_BILL.PAY_OFF:
                        ToastUtils.showMsgToast(Languages.errorMsg.payOff);
                        break;
                    default:
                        ToastUtils.showErrorToast(Languages.errorMsg.errQuery);
                        break;
                }
            }
        }
    }, [apiServices?.paymentBillServices, bill, customerCode, provider?.id]);

    const onChangeText = useCallback((text: string) => {
        setCustomerCode(text);
    }, []);

    const onPressItemService = useCallback((tag: string) => {
        switch (tag) {
            case Languages.paymentService.waterBill:
                setBill(ENUM_PROVIDERS_SERVICE.BILL_WATER);
                break;
            case Languages.paymentService.electricBill:
                setBill(ENUM_PROVIDERS_SERVICE.BILL_ELECTRIC);
                break;
            case Languages.paymentService.financeBill:
                setBill(ENUM_PROVIDERS_SERVICE.BILL_FINANCE);
                break;
            default:
                break;
        }
    }, []);

    const renderItemService = useCallback(
        (title: string, color: string, icon: any, status: boolean) => {
            const style = [
                styles.icon,
                { backgroundColor: status ? color : null }
            ] as ViewStyle;
            const onPress = () => {
                onPressItemService(title);
            };

            return (
                <View style={styles.itemBillFinance}>
                    <Touchable onPress={onPress} radius={10} style={style}>
                        {icon}
                    </Touchable>
                    <Text style={styles.txtIcon}>{title}</Text>
                </View>
            );
        },
        [onPressItemService]
    );

    const onChangeProvider = useCallback((item: any) => {
        setProvider(item);
    }, []);

    const renderItemInfo = useCallback((label?: string, value?: string) => {
        return (
            <>
                <View style={styles.wrapItem}>
                    <Text style={styles.labelInfo}>{label}</Text>
                    <Text style={styles.txtInfo}>{value}</Text>
                </View>
                <Dash
                    dashGap={5}
                    dashThickness={0.8}
                    dashLength={8}
                    dashColor={COLORS.GRAY_8}
                />
            </>
        );
    }, []);

    const renderButtonPayment = useMemo(() => {
        const styleBt = {
            backgroundColor: usePayment ? COLORS.GREEN : COLORS.GRAY_2
        } as ViewStyle;
        const styleTitle = {
            color: PAYMENT_METHODS.NONE ? COLORS.WHITE : COLORS.BACKDROP
        } as TextStyle;
        return (
            <Touchable
                disabled={!usePayment}
                onPress={onPayment}
                radius={Configs.FontSize.size30}
                style={[styles.button, styleBt]}
            >
                <Text style={[styles.txtButton, styleTitle]}>
                    {Languages.paymentService.payment}
                </Text>
            </Touchable>
        );
    }, [onPayment, usePayment]);

    const onUpdateTransaction = useCallback(async () => { }, []);

    const onUpdatePaymentMethod = useCallback((method: string) => {
        setUserPayment(method === PAYMENT_METHODS.BANK);
    }, []);

    const renderSourcePayment = useMemo(() => {
        return (
            <PaymentMethod
                onUpdateTransaction={onUpdateTransaction}
                onUpdatePaymentMethod={onUpdatePaymentMethod}
                hideMomo
            />
        );
    }, [onUpdatePaymentMethod, onUpdateTransaction]);

    const renderInfoPayment = useMemo(() => {
        if (showInfo) {
            const _onPress = () => {
                rulesRef.current?.show();
            };
            return (
                <>
                    <View style={styles.wrapInfoPayment}>
                        <Text style={styles.header}>
                            {Languages.paymentService.inforPayment}
                        </Text>
                        <View style={styles.wrapInfo}>
                            {renderItemInfo(
                                Languages.paymentService.provider,
                                provider?.value
                            )}
                            {renderItemInfo(
                                Languages.paymentService.customCode,
                                infoPayment?.customerCode
                            )}
                            {renderItemInfo(
                                Languages.paymentService.fullName,
                                infoPayment?.customerName
                            )}
                            {renderItemInfo(
                                Languages.paymentService.address,
                                infoPayment?.customerAddress
                            )}
                            <View style={styles.wrapItem}>
                                <Text style={styles.labelInfo}>
                                    {Languages.paymentService.paymentMoney}
                                </Text>
                                <Text style={styles.money}>
                                    {Utils.formatMoney(infoPayment?.amount)}
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.header}>
                            {Languages.paymentService.paymentSource}
                        </Text>
                        {renderSourcePayment}
                        <Touchable style={styles.wrapGuideText} onPress={_onPress}>
                            <Text style={styles.txtGuide}>
                                {Languages.paymentService.guide}
                            </Text>
                            <View style={styles.rowText}>
                                <Text style={styles.greenText}>
                                    {Languages.paymentService.license}{' '}
                                </Text>
                                <Text style={styles.txtOur}>
                                    {Languages.paymentService.our}
                                </Text>
                            </View>
                        </Touchable>
                    </View>
                    <View style={styles.wrapFooter}>
                        <View style={styles.rowAmount}>
                            <Text style={styles.txtAmount}>
                                {Languages.paymentService.amount}
                            </Text>
                            <Text style={styles.money}>
                                {Utils.formatMoney(infoPayment?.amount)}
                            </Text>
                        </View>
                        <View style={styles.wrapButton}>{renderButtonPayment}</View>
                    </View>
                    <PopupPolicy
                        ref={rulesRef}
                    />
                </>
            );
        }
        return null;
    }, [infoPayment?.amount, infoPayment?.customerAddress, infoPayment?.customerCode, infoPayment?.customerName, provider?.value, renderButtonPayment, renderItemInfo, renderSourcePayment, showInfo]);

    const renderSelector = useMemo(() => {
        return (
            !showInfo && (
                <>
                    <View style={styles.border} />
                    <PickerValuation
                        containerStyle={styles.wrapInput}
                        label={Languages.paymentService.provider}
                        placeholder={Languages.propertyValuation.name}
                        onPressItem={onChangeProvider}
                        data={dataProvider}
                        labelStyle={styles.label}
                        pickerStyle={styles.picker}
                        placeholderStyle={styles.placeholder}
                        value={provider?.value}
                        ref={providerRef}
                    />
                    <View style={styles.wrapInput}>
                        <View style={styles.row}>
                            <Text style={styles.txtProvider}>
                                {Languages.paymentService.customCodeEnter}
                            </Text>
                            <Text style={styles.red}>*</Text>
                        </View>
                        <MyTextInput
                            ref={inputRef}
                            containerInput={styles.input}
                            placeHolder={Languages.paymentService.customCodeEnter}
                            inputStyle={styles.inputStyle}
                            placeHolderColor={COLORS.BACKDROP}
                            onChangeText={onChangeText}
                            value={customerCode}
                            maxLength={20}
                        />
                    </View>
                </>
            )
        );
    }, [
        customerCode,
        dataProvider,
        onChangeProvider,
        onChangeText,
        provider?.value,
        showInfo
    ]);

    const renderBtContinue = useMemo(() => {
        if (!showInfo) {
            return (
                <View style={styles.wrapButton}>
                    <Touchable
                        onPress={onContinue}
                        radius={Configs.FontSize.size30}
                        style={styles.button}
                    >
                        <Text style={styles.txtButton}>{Languages.common.continue}</Text>
                    </Touchable>
                </View>
            );
        }
        return null;
    }, [onContinue, showInfo]);

    const onGoBack = useCallback(() => {
        setShowInfo((last) => {
            if (!last) {
                Navigator.goBack();
            }
            return !last;
        });
    }, []);

    return (
        <View style={styles.container}>
            <HeaderBar title={Languages.paymentService.title} onGoBack={onGoBack} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.wrapContent}>
                    <View style={styles.wrapBill}>
                        {renderItemService(
                            Languages.paymentService.waterBill,
                            COLORS.LIGHT_BLUE,
                            <WaterBillIcon width={30} height={30} />,
                            bill === ENUM_PROVIDERS_SERVICE.BILL_WATER
                        )}
                        {renderItemService(
                            Languages.paymentService.electricBill,
                            COLORS.WHITE_YELLOW,
                            <ElectricBillIcon width={30} height={30} />,
                            bill === ENUM_PROVIDERS_SERVICE.BILL_ELECTRIC
                        )}
                        {renderItemService(
                            Languages.paymentService.financeBill,
                            COLORS.PINK,
                            <FinanceBillIcon width={30} height={30} />,
                            bill === ENUM_PROVIDERS_SERVICE.BILL_FINANCE
                        )}
                    </View>
                </View>

                {renderSelector}
                {renderInfoPayment}
            </ScrollView>
            {renderBtContinue}
            {isLoading && <MyLoading isOverview />}
        </View>
    );
});

export default PaymentService;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE
    },
    wrapContent: {},
    wrapBill: {
        flexDirection: 'row',
        marginTop: Configs.FontSize.size30
    },
    itemBill: {
        width: (SCREEN_WIDTH - 16 * 4) / 3,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        padding: 15,
        borderRadius: 10,
        marginBottom: 10
    },
    txtIcon: {
        ...Styles.typography.medium,
        color: COLORS.BLACK,
        fontSize: Configs.FontSize.size13
    },
    border: {
        height: 10,
        backgroundColor: COLORS.GRAY_2,
        marginTop: 20
    },
    select: {
        borderColor: COLORS.GRAY_8,
        borderWidth: 1,
        borderRadius: 50,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 40
    },
    input: {
        borderColor: COLORS.GRAY_8,
        borderWidth: 1,
        borderRadius: 50,
        paddingLeft: 15
    },
    txtSelect: {
        ...Styles.typography.regular,
        color: COLORS.BACKDROP,
        fontSize: Configs.FontSize.size13
    },
    red: {
        color: COLORS.RED,
        fontSize: Configs.FontSize.size16
    },
    row: {
        flexDirection: 'row',
        marginLeft: 20,
        marginBottom: 10
    },
    wrapInput: {
        paddingHorizontal: 16,
        marginTop: 25
    },
    txtProvider: {
        fontSize: Configs.FontSize.size14,
        fontFamily: Configs.FontFamily.medium,
        color: COLORS.BLACK
    },
    wrapButton: {
        flex: 1,
        justifyContent: 'flex-end',
        marginHorizontal: 16
    },
    button: {
        paddingVertical: 15,
        backgroundColor: COLORS.GREEN,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Configs.FontSize.size30,
        marginBottom: Configs.FontSize.size40
    },
    txtButton: {
        ...Styles.typography.medium,
        color: COLORS.WHITE,
        fontSize: Configs.FontSize.size14
    },
    itemBillFinance: {
        width: (SCREEN_WIDTH - 16 * 4) / 3 + 15,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    wrapPicker: {
        marginBottom: 20
    },
    picker: {
        width: '100%',
        paddingLeft: 20,
        borderRadius: 20,
        borderColor: COLORS.GRAY_8,
        height: 40,
        borderWidth: 1
    },
    label: {
        ...Styles.typography.medium,
        marginLeft: 20,
        marginBottom: 5
    },
    placeholder: {
        color: COLORS.BACKDROP
    },
    inputStyle: {
        ...Styles.typography.regular,
        color: COLORS.BLACK
    },
    header: {
        ...Styles.typography.medium,
        marginTop: 20
    },
    wrapInfo: {
        paddingHorizontal: 16,
        borderColor: COLORS.GRAY_8,
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 10,
        width: '100%',
        paddingVertical: 3
    },
    wrapItem: {
        flexDirection: 'row',
        paddingVertical: 10,
        width: '100%',
        alignItems: 'center'
    },
    wrapPayment: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        paddingVertical: 8
    },
    labelInfo: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size13,
        width: '40%'
    },
    txtInfo: {
        ...Styles.typography.medium,
        width: '60%',
        textAlign: 'right'
    },
    money: {
        ...Styles.typography.medium,
        width: '60%',
        textAlign: 'right',
        color: COLORS.GREEN,
        fontSize: Configs.FontSize.size20
    },
    wrapInfoPayment: {
        paddingHorizontal: 16,
        width: '100%',
        borderTopWidth: 10,
        marginTop: 20,
        borderColor: COLORS.GRAY_2
    },
    txtGuide: {
        ...Styles.typography.regular,
        textAlign: 'center',
        fontSize: Configs.FontSize.size13,
        paddingHorizontal: 20
    },
    txtOur: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size13
    },
    wrapGuideText: {},
    rowText: {
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    greenText: {
        ...Styles.typography.medium,
        color: COLORS.GREEN_1
    },
    rowAmount: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        paddingHorizontal: 30,
        marginTop: 16,
        alignItems: 'center'
    },
    wrapFooter: {
        ...Styles.shadow,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: 30,
        flex: 1
    },
    txtAmount: {
        ...Styles.typography.medium,
        color: COLORS.LIGHT_GRAY
    },
    moneyText: {
        ...Styles.typography.medium,
        color: COLORS.GREEN_1,
        fontSize: Configs.FontSize.size20
    },
    wrapSource: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.GRAY_8,
        paddingHorizontal: 16,
        paddingVertical: 5,
        marginTop: 10,
        marginBottom: 20
    },
    wrapNL: {
        marginLeft: 10
    },
    textChange: {
        textAlign: 'right'
    },
    txtNl: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size20
    },
    txtVimo: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size16,
        color: COLORS.LIGHT_GRAY
    }
});
