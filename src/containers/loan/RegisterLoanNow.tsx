/* eslint-disable array-callback-return */
import { observer } from 'mobx-react';
import React, {
    useCallback,
    useEffect, useRef,
    useState
} from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';

import { BOTTOM_HEIGHT, Configs } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import ScreenNames from '@/commons/ScreenNames';
import { Button, HeaderBar } from '@/components';
import { ItemProps } from '@/components/BottomSheet';
import { MyTextInput } from '@/components/elements/textfield';
import { TextFieldActions } from '@/components/elements/textfield/types';
import PickerValuation, { PickerAction } from '@/components/PickerValuation';
import { PopupActions } from '@/components/popup/types';
import PopupRegisterLoanSuccess from '@/components/PopupRegisterLoanSuccess';
import { useAppStore } from '@/hooks';
import {
    DepreciationModel
} from '@/models/propertyValuation';
import Navigator from '@/routers/Navigator';
import { COLORS, Styles } from '@/theme';
import FormValidate from '@/utils/FormValidate';
import Utils from '@/utils/Utils';
import MyLoading from '@/components/MyLoading';
import { PopupActionTypes } from '@/models/typesPopup';

const RegisterLoanNow = observer(({ route }: any) => {
    const { formality, propertyName, propertyMaxLoan, propertyType } = route?.params as any;
    const { apiServices, userManager } = useAppStore();

    const [dataProductLoan, setDataProductLoan] = useState<ItemProps[]>([]);
    const [productLoan, setProductLoan] = useState<ItemProps>();

    const [dataTimeLoan, setDataTimeLoan] = useState<ItemProps[]>([]);
    const [timeLoan, setTimeLoan] = useState<ItemProps>();

    const [dataFormalityOfPayment, setDataFormalityOfPayment] = useState<ItemProps[]>([]);   
    const [formalityOfPayment, setFormalityOfPayment] = useState<ItemProps>();

    const [fullName, setFullName] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [money, setMoney] = useState<string>('');
    const [isLoading, setLoading] = useState<boolean>(false);

    const fullNameRef = useRef<TextFieldActions>(null);
    const phoneRef = useRef<TextFieldActions>(null);
    const timeLoanRef = useRef<PickerAction>(null);
    const formalityPaymentRef = useRef<PickerAction>(null);
    const moneyRef = useRef<TextFieldActions>(null);
    const scrollViewRef = useRef<ScrollView>(null);
    const popupRef = useRef<PopupActionTypes>(null);
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        setFullName(userManager?.userInfo?.full_name || '');
        setPhoneNumber(userManager?.userInfo?.phone_number || '');
        if (!userManager?.userInfo) {
            Navigator.navigateScreen(ScreenNames.auth);
        }
    }, [userManager?.userInfo]);

    useEffect(() => {
        fetchProductLoan(formality?.id, propertyType);
        fetchTimeLoan();
        fetchFormalityOfPayment();
    }, []);

    const fetchProductLoan = useCallback(
        async (idFormality: string, idPropertyType: string) => {
            const res = await apiServices.property.getProductLoan(
                idFormality,
                idPropertyType
            );
            console.log(res);
            if (res.success) {
                const data = res.data as [];
                const items = new Array(Object.keys(data).length);
                for (let i = 0; i < items.length; i++) {
                    items[i] = {
                        id: Object.keys(data)[i],
                        value: Object.values(data)[i]
                    };
                }

                setDataProductLoan(items);
            }
        },
        [apiServices.property]
    );

    const fetchTimeLoan = useCallback(async () => {
        const res = await apiServices.property.getTimeLoan();
        if (res.success) {
            const data = res.data as [];
            const items = [] as ItemProps[];
            const temp = Object.entries(data);
            temp.map((item: any) => {
                items.push({
                    id: item[0],
                    value: item[1]?.name
                });
            });
            setDataTimeLoan(items);
        }
    }, [apiServices.property]);

    const fetchFormalityOfPayment = useCallback(async () => {
        const res = await apiServices.property.getFormalityOfPayment();
        if (res.success) {
            const data = res.data as DepreciationModel;
            const items = [] as ItemProps[];
            const temp = Object.entries(data);
            temp.map((item) => {
                items.push({
                    id: item[0],
                    value: item[1]?.name
                });
            });
            setDataFormalityOfPayment(items);
        }
    }, [apiServices.property]);



    const onChangeProductLoan = useCallback((item: any) => {
        setProductLoan(item);
    }, []);


    const onChangeValueLoan = useCallback((value: string) => {
        console.log('value', value === '');
        if (value === '') {
            setMoney('');
            return;
        }
        setMoney(Utils.formatLoanMoney(value));
    }, []);

    const onChangeTimeLoan = useCallback((item: any) => {
        setTimeLoan(item);
    }, []);

    const onChangeFormalityOfPayment = useCallback((item: any) => {
        setFormalityOfPayment(item);
    }, []);

    const onRegister = useCallback(async () => {
        const userNameError = FormValidate.userNameValidate(fullName);
        const phoneError = FormValidate.passConFirmPhone(phoneNumber);
        const loanMoneyError = FormValidate.validateMoneyLoan(money, propertyMaxLoan);
        if (userNameError || phoneError) {
            fullNameRef.current?.setErrorMsg(userNameError);
            phoneRef.current?.setErrorMsg(phoneError);
            scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
            return false;
        }
        const timeLoanError = timeLoan?.value ? '' : Languages.loan.timeForLoan;
        const formalityPaymentError = formalityOfPayment?.value ? '' : Languages.loan.formalityPayment;
        moneyRef.current?.setErrorMsg(loanMoneyError);
        timeLoanRef.current?.setErrorMsg(timeLoanError);
        formalityPaymentRef.current?.setErrorMsg(formalityPaymentError);
        if (`${userNameError}${phoneError}${timeLoanError}${formalityPaymentError}${loanMoneyError}`.length === 0) {
            const temp = Utils.formatTextToNumber(money);
            setLoading(true);
            const res = await apiServices.property.registerLoan(
                fullName,
                phoneNumber,
                parseInt(temp, 10),
                timeLoan?.id || '',
                formalityOfPayment?.id || ''
            );
            if (res.success) {
                setLoading(false);
                const status = res?.data?.status;
                const message = res?.data?.message;
                if (status === 200) {
                    setMessage(message);
                    popupRef.current?.show();
                }
            }
            if (res?.data?.status === 401) {
                setLoading(false);
                setMessage(res?.data?.message);
                popupRef.current?.show();
            }
            setLoading(false);
        }
        return false;
    }, [apiServices.property, formalityOfPayment?.id, formalityOfPayment?.value, fullName, money, phoneNumber, propertyMaxLoan, timeLoan?.id, timeLoan?.value]);

    const onChangeUserName = useCallback((value: string) => {
        setFullName(value);
    }, []);

    const onChangePhone = useCallback((value: string) => {
        setPhoneNumber(value);
    }, []);

    const onScrollTo = useCallback((value: any) => {
        scrollViewRef.current?.scrollTo({
            x: 0,
            y: value,
            animated: true
        });
    }, []);
    const onClosePopup = useCallback(() => {
        Navigator.goBack();
    }, []);

    const renderValueProperty = useCallback((value: string) => {
        return (
            <View style={styles.wrapValue}>
                <Text numberOfLines={1} style={styles.placeholder}>{value}</Text>
            </View>
        );
    }, []);

    const renderLabel = useCallback((label: string) => {
        return (
            <View style={styles.row}>
                <Text style={styles.txtLabel}>{label}</Text>
                <Text style={styles.star}>*</Text>
            </View>
        );
    }, []);

    const renderMaximum = useCallback(
        (price: number) => {
            if (propertyMaxLoan > 0) {
                return (
                    <View style={styles.row1}>
                        <Text style={styles.txtMaximum}>{Languages.loan.maximumMoney}</Text>
                        <Text style={styles.star}>
                            {Utils.formatMoney(price.toString())}
                        </Text>
                    </View>
                );
            }
            return null;
        },
        [propertyMaxLoan]

    );

    return (
        <View style={styles.container}>
            <HeaderBar title={Languages.loan.title} exitApp={false} />
            <ScrollView
                ref={scrollViewRef}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
            >
                <View style={styles.wrapInfoCustomer}>
                    <Text style={styles.txtHeader}>{Languages.loan.infoCustomer}</Text>
                    {renderLabel(Languages.loan.fullName)}
                    <MyTextInput
                        placeHolder={Languages.loan.enterFullName}
                        containerInput={styles.input}
                        onChangeText={onChangeUserName}
                        value={fullName}
                        ref={fullNameRef}
                        maxLength={50}
                    />
                    {renderLabel(Languages.loan.phoneNumber)}
                    <MyTextInput
                        placeHolder={Languages.loan.enterPhoneNumber}
                        containerInput={styles.input}
                        value={phoneNumber}
                        onChangeText={onChangePhone}
                        ref={phoneRef}
                        maxLength={10}
                    />
                </View>
                <View style={styles.border} />
                <View style={styles.wrapInfoLoan}>
                    <Text style={styles.txtHeader}>{Languages.loan.infoLoan}</Text>
                    <Text style={styles.label}>
                        {Utils.capitalizeFirstLetter(Languages.loan.formality)}
                    </Text>
                    {renderValueProperty(formality?.value)}
                    <Text style={styles.label}>
                        {Utils.capitalizeFirstLetter(Languages.loan.assetName || '')}
                    </Text>
                    {renderValueProperty(propertyName?.value)}
                    {renderLabel(Languages.loan.loan)}
                    <MyTextInput
                        placeHolder={Languages.common.currency}
                        containerInput={styles.input}
                        onChangeText={onChangeValueLoan}
                        keyboardType={'NUMBER'}
                        value={money}
                        ref={moneyRef}
                        maxLength={50}
                    />
                    {renderMaximum(propertyMaxLoan)}
                    <PickerValuation
                        label={Languages.loan.productLoan}
                        placeholder={Languages.loan.productLoan}
                        labelStyle={styles.labelPicker}
                        pickerStyle={styles.picker}
                        data={dataProductLoan}
                        value={productLoan?.value}
                        optional={true}
                        onPressItem={onChangeProductLoan}
                    />
                    <PickerValuation
                        label={Languages.loan.timeForLoan}
                        placeholder={Languages.loan.timeForLoan}
                        labelStyle={styles.labelPicker}
                        pickerStyle={styles.picker}
                        disable={false}
                        data={dataTimeLoan}
                        value={timeLoan?.value}
                        onPressItem={onChangeTimeLoan}
                        onScrollTo={onScrollTo}
                        ref={timeLoanRef}
                    />
                    <PickerValuation
                        label={Languages.loan.formalityPayment}
                        placeholder={Languages.loan.formalityPayment}
                        labelStyle={styles.labelPicker}
                        pickerStyle={styles.picker}
                        data={dataFormalityOfPayment}
                        value={formalityOfPayment?.value}
                        onPressItem={onChangeFormalityOfPayment}
                        onScrollTo={onScrollTo}
                        ref={formalityPaymentRef}
                    />
                </View>
                <Button
                    onPress={onRegister}
                    textColor={COLORS.WHITE}
                    label={Languages.loan.applyForLoan}
                    style={styles.button}
                />
            </ScrollView>
            {isLoading && <MyLoading isOverview />}
            <PopupRegisterLoanSuccess
                ref={popupRef}
                title={message}
                onClose={onClosePopup}
            />
        </View>
    );
});

export default RegisterLoanNow;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE
    },
    contentContainer: {
        marginTop: 20,
        paddingBottom: BOTTOM_HEIGHT
    },
    row: {
        flexDirection: 'row',
        marginTop: 15
    },
    row1: {
        flexDirection: 'row',
        marginLeft: 15,
        marginTop: 15
    },
    txtLabel: {
        ...Styles.typography.medium,
        color: COLORS.DARK_GRAY,
        marginBottom: 10,
        marginLeft: 20
    },
    star: {
        ...Styles.typography.medium,
        color: COLORS.RED,
        marginLeft: 3
    },
    txtHeader: {
        ...Styles.typography.medium,
        color: COLORS.DARK_GRAY
    },
    input: {
        borderRadius: 50,
        borderColor: COLORS.GRAY_2,
        justifyContent: 'center',
        height: 40
    },

    wrapInfoCustomer: {
        marginHorizontal: 16,
        marginBottom: 20
    },
    border: {
        height: 10,
        backgroundColor: COLORS.GRAY_10,
        borderColor: COLORS.GRAY_10
    },
    wrapInfoLoan: {
        marginHorizontal: 16,
        marginTop: 20
    },
    wrapPicker: {
        marginBottom: 20
    },
    picker: {
        width: '100%',
        paddingLeft: 16,
        borderRadius: 20,
        borderColor: COLORS.GRAY_2,
        height: 40,
        borderWidth: 1
    },
    label: {
        ...Styles.typography.medium,
        marginLeft: 20,
        marginBottom: 10,
        marginTop: 15
    },
    txtMaximum: {
        fontSize: Configs.FontSize.size12,
        color: COLORS.DARK_GRAY,
        fontFamily: Configs.FontFamily.medium,
        marginTop: 3
    },
    txtMoney: {
        fontSize: Configs.FontSize.size12,
        fontFamily: Configs.FontFamily.medium,
        color: COLORS.RED
    },
    button: {
        marginHorizontal: 16,
        marginTop: 40,
        marginBottom: 40,
        backgroundColor: COLORS.GREEN
    },
    txtDepreciation: {
        ...Styles.typography.medium,
        marginTop: 10,
        marginLeft: 10
    },
    wrapValue: {
        width: '100%',
        borderColor: COLORS.GRAY_2,
        borderWidth: 1,
        paddingHorizontal: 15,
        borderRadius: 50,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        height: 40,
        alignItems: 'center'
    },
    placeholder: {
        ...Styles.typography.regular
    },
    labelPicker: {
        ...Styles.typography.medium,
        marginLeft: 20,
        marginBottom: 5
    }
});
