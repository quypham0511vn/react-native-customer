/* eslint-disable array-callback-return */
import { debounce } from 'lodash';
import { observer } from 'mobx-react';
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';

import { BOTTOM_HEIGHT, Configs } from '@/commons/Configs';
import { PRODUCT } from '@/commons/constants';
import Languages from '@/commons/Languages';
import ScreenNames from '@/commons/ScreenNames';
import { Button, HeaderBar } from '@/components';
import { ItemProps } from '@/components/BottomSheet';
import { MyTextInput } from '@/components/elements/textfield';
import { TextFieldActions } from '@/components/elements/textfield/types';
import PickerValuation, { PickerAction } from '@/components/PickerValuation';
import PopupRegisterLoanSuccess from '@/components/PopupRegisterLoanSuccess';
import { useAppStore } from '@/hooks';
import {
    DepreciationModel,
    PropertyPriceModel
} from '@/models/propertyValuation';
import Navigator from '@/routers/Navigator';
import { COLORS, Styles } from '@/theme';
import FormValidate from '@/utils/FormValidate';
import Utils from '@/utils/Utils';
import AnalyticsUtils from '@/utils/AnalyticsUtils';
import { PopupActionTypes } from '@/models/typesPopup';

const Loan = observer(() => {
    const [formality, setFormality] = useState<ItemProps>();
    const [dataFormality, setDataFormality] = useState<ItemProps[]>([]);

    const [brandName, setBrandName] = useState<ItemProps>();
    const [dataBrandName, setDataBrandName] = useState<ItemProps[]>([]);

    const [modelName, setModelName] = useState<ItemProps>();
    const [dataModelName, setDataModelName] = useState<ItemProps[]>([]);

    const [propertyName, setPropertyName] = useState<ItemProps>();
    const [dataPropertyName, setDataPropertyName] = useState<ItemProps[]>([]);

    const [dataDepreciation, setDataDepreciation] = useState<ItemProps[]>([]);
    const [itemsSelectedDepreciation, setItemsSelectedDepreciation] = useState<
    ItemProps[]
  >([]);

    const [propertyType, setPropertyType] = useState<ItemProps[]>([]);
    const [propertyTypeValue, setPropertyTypeValue] = useState<ItemProps>();

    const [dataProductLoan, setDataProductLoan] = useState<ItemProps[]>([]);
    const [productLoan, setProductLoan] = useState<ItemProps>();

    const [propertyValue, setPropertyValue] = useState<number>(0);
    const [propertyMaxLoan, setPropertyMaxLoan] = useState<number>(0);

    const [dataTimeLoan, setDataTimeLoan] = useState<ItemProps[]>([]);
    const [timeLoan, setTimeLoan] = useState<ItemProps>();

    const [dataFormalityOfPayment, setDataFormalityOfPayment] = useState<
    ItemProps[]
  >([]);
    const [formalityOfPayment, setFormalityOfPayment] = useState<ItemProps>();

    const [refreshing, setRefreshing] = useState<boolean>(false);

    const { apiServices, userManager } = useAppStore();

    const [fullName, setFullName] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [money, setMoney] = useState<string>('');

    const fullNameRef = useRef<TextFieldActions>(null);
    const phoneRef = useRef<TextFieldActions>(null);
    const formalityRef = useRef<PickerAction>(null);
    const propertyTypeRef = useRef<PickerAction>(null);
    const brandRef = useRef<PickerAction>(null);
    const modelRef = useRef<PickerAction>(null);
    const propertyNameRef = useRef<PickerAction>(null);
    const timeLoanRef = useRef<PickerAction>(null);
    const formalityPaymentRef = useRef<PickerAction>(null);
    const moneyRef = useRef<TextFieldActions>(null);
    const scrollViewRef = useRef<ScrollView>(null);
    const popupRef = useRef<PopupActionTypes>(null);
    const [message, setMessage] = useState<string>('');
    // const

    useEffect(() => {
        if (!userManager?.userInfo) {
            Navigator.navigateScreen(ScreenNames.auth);
        } else {
            setFullName(userManager?.userInfo?.full_name || '');
            setPhoneNumber(userManager?.userInfo?.phone_number || '');
        }
    }, [userManager?.userInfo]);

    useEffect(() => {
        if (propertyName) {
            fetchPropertyPrice(propertyName?.id || '');
        }
    }, [productLoan, formality]);

    useEffect(() => {
        fetchFormality();
        fetchTimeLoan();
        fetchFormalityOfPayment();
        AnalyticsUtils.trackEvent(ScreenNames.loan);
    }, []);

    useEffect(() => {
        if (itemsSelectedDepreciation?.length >= 0) {
            debounceCalculateDepreciation();
        }
    }, [itemsSelectedDepreciation]);

    const fetchFormality = useCallback(async () => {
        const res = await apiServices.property.getListFormalityLoan();
        if (res.success) {
            const data = res.data as [];
            const temp = [] as ItemProps[];
            data?.map((item: any) => {
                if (item?.code !== 'TC') {
                    temp.push({
                        value: item?.name,
                        id: item.code
                    });
                }
            });
            setDataFormality(temp);
        }
    }, [apiServices.property]);

    const fetchTypeOfProperty = useCallback(
        async (id: string) => {
            const res = await apiServices.property.getMainProperty(id || '');
            if (res.success) {
                const data = res.data as [];
                const temp = [] as ItemProps[];
                data?.map((item: any) => {
                    temp.push({
                        value: item?.name,
                        id: item.code
                    });
                });
                setPropertyType(temp);
            }
        },
        [apiServices.property]
    );

    const fetchBrandName = useCallback(
        async (value: any) => {
            const codeMain = value?.id === PRODUCT.CAR ? PRODUCT.CAR : PRODUCT.MOTOR;
            const res = await apiServices.property.getBrandName(codeMain);
            if (res.success) {
                const data = res.data as [];
                const temp = [] as ItemProps[];
                data?.map((item: any) => {
                    if (item?.code !== 'TC') {
                        temp.push({
                            value: item?.str_name,
                            id: item._id.$oid
                        });
                    }
                });
                setDataBrandName(temp);
            }
        },
        [apiServices.property]
    );

    const fetchModelName = useCallback(
        async (id: string) => {
            const res = await apiServices.property.getModelName(id);
            if (res.success) {
                const data = res.data as {};
                const temp = Object.entries(data);
                const temp1 = [] as ItemProps[];
                temp.map((item) => {
                    temp1.push({
                        value: item[1] as string,
                        id: item[0]
                    });
                });
                setDataModelName(temp1);
            }
        },
        [apiServices.property]
    );

    const fetchNameProperty = useCallback(
        async (id: string) => {
            const res = await apiServices.property.getPropertyName(id);
            if (res.success) {
                const data = res.data as [];
                const temp = [] as ItemProps[];
                data?.map((item: any) => {
                    temp.push({
                        value: item?.str_name,
                        id: item._id.$oid
                    });
                });
                setDataPropertyName(temp);
            }
        },
        [apiServices.property]
    );

    const fetchProductLoan = useCallback(
        async (idFormality: string, idPropertyType: any) => {
            const res = await apiServices.property.getProductLoan(
                idFormality,
                idPropertyType
            );
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
            temp.map((item) => {
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

    const fetchDepreciation = useCallback(
        async (id: string) => {
            const res = await apiServices.property.getDepreciationProperty(
                id,
                formality?.id || ''
            );
            if (res.success) {
                const data = res?.data as DepreciationModel;
                const temp = [] as ItemProps[];
                data?.depreciations?.map((item: any) => {
                    temp.push({
                        value: item?.name,
                        id: item?.slug.toString(),
                        price: item?.price,
                        selected: false
                    });
                });
                setDataDepreciation(temp);
            }
        },
        [formality, apiServices.property]
    );
    const fetchPropertyPrice = useCallback(
        async (item: string) => {
            const code_type_property = propertyTypeValue?.id
                ? PRODUCT.CAR
                : PRODUCT.MOTOR;
            const depreciationTemp = [] as Array<string>;
            itemsSelectedDepreciation.map((_item) => {
                depreciationTemp.push(_item?.price as string);
            });
            const res = await apiServices.property.getPropertyPrice(
        item as string,
        code_type_property,
        formality?.id as string,
        depreciationTemp.length > 0 ? depreciationTemp : [],
        productLoan?.id as string
            );
            if (res.success) {
                const data = res?.data as PropertyPriceModel;
                setPropertyValue(data.gia_tri_tai_san);
                setPropertyMaxLoan(data.so_tien_co_the_vay);
            }
        },
        [
            propertyTypeValue,
            itemsSelectedDepreciation,
            apiServices,
            formality,
            productLoan
        ]
    );
    const fetchCalculateDepreciation = useCallback(() => {
        fetchPropertyPrice(propertyName?.id || '');
    }, [fetchPropertyPrice, propertyName]);

    const debounceCalculateDepreciation = useCallback(
        debounce(() => fetchCalculateDepreciation(), 200),
        [fetchCalculateDepreciation]
    );

    useEffect(() => {
        fetchFormality();
        fetchTimeLoan();
        fetchFormalityOfPayment();
    }, []);

    useEffect(() => {
        if (propertyValue === 0) {
            setMoney('');
            moneyRef.current?.setValue('');
        }
    }, [propertyValue]);

    useEffect(() => {
        if (itemsSelectedDepreciation?.length >= 0) {
            debounceCalculateDepreciation();
        }
    }, [itemsSelectedDepreciation]);

    const onChangeFormality = useCallback(
        (item: any) => {
            setFormality(item);
            formalityRef.current?.setErrorMsg('');
            fetchTypeOfProperty(item?.id);
            if (propertyTypeValue?.value) {
                fetchProductLoan(item?.id, propertyTypeValue?.id);
                setProductLoan({});
            }
        },
        [fetchProductLoan, fetchTypeOfProperty, propertyTypeValue]
    );

    const onChangePropertyType = useCallback(
        (item: any) => {
            setPropertyTypeValue(item);
            fetchBrandName(item);
            propertyTypeRef.current?.setErrorMsg('');
            fetchProductLoan(formality?.id || '', item?.id);
            if (item?.value !== propertyTypeValue?.value) {
                setBrandName({});
                setDataModelName([]);
                setModelName({});
                setDataPropertyName([]);
                setPropertyName({});
                setProductLoan({});
                setPropertyMaxLoan(0);
            }
        },
        [fetchBrandName, fetchProductLoan, formality?.id, propertyTypeValue?.value]
    );

    const onChangeBrandName = useCallback(
        (item: any) => {
            setBrandName(item);
            if (item.id !== brandName?.id) {
                setDataModelName([]);
                setModelName({});
                setDataPropertyName([]);
                setPropertyName({});
                fetchModelName(item?.id);
                setItemsSelectedDepreciation([]);
                setPropertyValue(0);
                setPropertyMaxLoan(0);
            }
        },
        [brandName?.id, fetchModelName]
    );

    const onChangeModelName = useCallback(
        (item: any) => {
            setModelName(item);
            fetchNameProperty(item.id);
            if (item.id !== modelName?.id) {
                setPropertyName({});
                setDataPropertyName([]);
                setDataDepreciation([]);
                setItemsSelectedDepreciation([]);
                setPropertyValue(0);
                setPropertyMaxLoan(0);
            }
        },
        [fetchNameProperty, modelName]
    );

    const onChangePropertyName = useCallback(
        (item: any) => {
            if (item.id !== propertyName?.id) {
                setPropertyName(item);
                setItemsSelectedDepreciation([]);
                fetchPropertyPrice(item.id);
                fetchDepreciation(item.id);
            }
        },
        [fetchDepreciation, fetchPropertyPrice, propertyName]
    );

    const onChangeProductLoan = useCallback((item: any) => {
        setProductLoan(item);
    }, []);

    const onChangeDepreciation = useCallback((item: any) => {
        if (item?.selected === false) {
            setItemsSelectedDepreciation((last) => [...last, item]);
            setDataDepreciation((last) =>
                last.map((_item) => {
                    if (item.id?.toString() === _item.id?.toString()) {
                        return {
                            ..._item,
                            selected: true
                        };
                    }
                    return _item;
                })
            );
        }
        if (item?.selected === true) {
            setItemsSelectedDepreciation((last) =>
                last.filter((_item) => item?.id.toString() !== _item.id?.toString())
            );
            setDataDepreciation((last) =>
                last.map((_item) => {
                    if (item.id?.toString() === _item.id?.toString()) {
                        return {
                            ..._item,
                            selected: false
                        };
                    }
                    return _item;
                })
            );
        }
    }, []);
    const onChangeValueLoan = useCallback((value: string) => {
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
        const loanMoneyError = propertyValue
            ? FormValidate.validateMoneyLoan(money, propertyValue)
            : '';
        if (userNameError || phoneError) {
            fullNameRef.current?.setErrorMsg(userNameError);
            phoneRef.current?.setErrorMsg(phoneError);
            scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
            return false;
        }
        const formalityError = formality?.value ? '' : Languages.loan.formality;
        const propertyTypeError = propertyTypeValue?.value
            ? ''
            : Languages.loan.propertyType;
        const brandError = brandName?.value
            ? ''
            : Languages.propertyValuation.brandName;
        const modelError = modelName?.value
            ? ''
            : Languages.propertyValuation.model;
        const propertyNameError = propertyName?.value
            ? ''
            : Languages.loan.assetName;
        const timeLoanError = timeLoan?.value ? '' : Languages.loan.timeForLoan;
        const formalityPaymentError = formalityOfPayment?.value
            ? ''
            : Languages.loan.formalityPayment;

        moneyRef.current?.setErrorMsg(loanMoneyError);
        formalityRef.current?.setErrorMsg(formalityError);
        propertyTypeRef.current?.setErrorMsg(propertyTypeError);
        brandRef.current?.setErrorMsg(brandError);
        modelRef.current?.setErrorMsg(modelError);
        propertyNameRef.current?.setErrorMsg(propertyNameError);
        if (!propertyNameError) {
            timeLoanRef.current?.setErrorMsg(timeLoanError);
            formalityPaymentRef.current?.setErrorMsg(formalityPaymentError);
        }

        if (
            `${userNameError}${phoneError}${formalityError}${propertyTypeError}${brandError}${modelError}${propertyNameError}${loanMoneyError}${timeLoanError}${formalityPaymentError}`
                .length === 0
        ) {
            const temp = Utils.formatTextToNumber(money);
            const res = await apiServices.property.registerLoan(
                fullName,
                phoneNumber,
                parseInt(temp, 10),
                timeLoan?.id || '',
                formalityOfPayment?.id || ''
            );
            if (res.success) {
                const status = res?.data?.status;
                const message = res?.data?.message;
                if (status === 200) {
                    setMessage(message);
                    popupRef.current?.show();
                }
            }
            if (res?.data?.status === 401) {
                setMessage(res?.data?.message);
                popupRef.current?.show();
            }
        }
        return false;
    }, [
        apiServices.property,
        brandName?.value,
        formality?.value,
        formalityOfPayment?.id,
        formalityOfPayment?.value,
        fullName,
        modelName?.value,
        money,
        phoneNumber,
        propertyName?.value,
        propertyTypeValue?.value,
        propertyValue,
        timeLoan?.id,
        timeLoan?.value
    ]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setFormality({});
        setDataFormality([]);
        setPropertyTypeValue({});
        setPropertyType([]);
        setBrandName({});
        setDataBrandName([]);
        setModelName({});
        setDataModelName([]);
        setDataPropertyName([]);
        setDataProductLoan([]);
        setProductLoan({});
        setDataDepreciation([]);
        setPropertyName({});
        setTimeLoan({});
        setFormalityOfPayment({});
        setPropertyMaxLoan(0);
        setItemsSelectedDepreciation([]);
        setPropertyValue(0);
        setDataTimeLoan([]);
        setDataFormalityOfPayment([]);
        moneyRef?.current?.setValue('');
        setFullName(userManager?.userInfo?.full_name || '');
        setPhoneNumber(userManager?.userInfo?.phone_number || '');
        fetchFormality();
        fetchTimeLoan();
        fetchFormalityOfPayment();
        setTimeout(() => setRefreshing(false), 2000);
    }, []);

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
        onRefresh();
        scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    }, [onRefresh]);

    const renderDepreciation = useMemo(() => {
        if (itemsSelectedDepreciation.length > 0) {
            return (
                <View>
                    {itemsSelectedDepreciation.map((item) => {
                        return (
                            <Text key={item.value} style={styles.txtDepreciation}>
                - {item.value}
                            </Text>
                        );
                    })}
                </View>
            );
        }
        return null;
    }, [itemsSelectedDepreciation]);

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
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
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
                        keyboardType={'NUMBER'}
                        maxLength={10}
                    />
                </View>
                <View style={styles.border} />
                <View style={styles.wrapInfoLoan}>
                    <Text style={styles.txtHeader}>{Languages.loan.infoLoan}</Text>
                    <PickerValuation
                        label={Languages.loan.formality}
                        placeholder={Languages.loan.formality}
                        labelStyle={styles.label}
                        pickerStyle={styles.picker}
                        onPressItem={onChangeFormality}
                        value={formality?.value}
                        data={dataFormality}
                        ref={formalityRef}
                        index={1}
                        onScrollTo={onScrollTo}
                    />
                    <PickerValuation
                        label={Languages.loan.propertyType}
                        placeholder={Languages.loan.propertyType}
                        labelStyle={styles.label}
                        pickerStyle={styles.picker}
                        data={propertyType}
                        value={propertyTypeValue?.value}
                        onPressItem={onChangePropertyType}
                        ref={propertyTypeRef}
                        onScrollTo={onScrollTo}
                    />
                    <PickerValuation
                        label={Languages.propertyValuation.brandName}
                        placeholder={Languages.propertyValuation.brandName}
                        labelStyle={styles.label}
                        pickerStyle={styles.picker}
                        data={dataBrandName}
                        onPressItem={onChangeBrandName}
                        value={brandName?.value}
                        disable={false}
                        ref={brandRef}
                        onScrollTo={onScrollTo}
                    />
                    <PickerValuation
                        label={Languages.propertyValuation.model}
                        placeholder={Languages.propertyValuation.model}
                        labelStyle={styles.label}
                        data={dataModelName}
                        value={modelName?.value}
                        pickerStyle={styles.picker}
                        disable={false}
                        onPressItem={onChangeModelName}
                        ref={modelRef}
                        onScrollTo={onScrollTo}
                    />

                    <PickerValuation
                        label={Languages.loan.assetName}
                        placeholder={Languages.loan.assetName}
                        labelStyle={styles.label}
                        pickerStyle={styles.picker}
                        value={propertyName?.value}
                        data={dataPropertyName}
                        onPressItem={onChangePropertyName}
                        ref={propertyNameRef}
                        onScrollTo={onScrollTo}
                    />

                    <PickerValuation
                        label={Languages.propertyValuation.depreciation}
                        placeholder={Languages.propertyValuation.depreciation}
                        labelStyle={styles.label}
                        pickerStyle={styles.picker}
                        data={dataDepreciation}
                        isCheckboxList={true}
                        onPressItem={onChangeDepreciation}
                        optional={true}
                    />
                    {renderDepreciation}
                    {renderLabel(Languages.loan.loan)}
                    <MyTextInput
                        placeHolder={Languages.common.currency}
                        containerInput={styles.input}
                        onChangeText={onChangeValueLoan}
                        keyboardType={'NUMBER'}
                        value={money}
                        ref={moneyRef}
                        maxLength={15}
                    />
                    {renderMaximum(propertyValue)}
                    <PickerValuation
                        label={Languages.loan.productLoan}
                        placeholder={Languages.loan.productLoan}
                        labelStyle={styles.label}
                        pickerStyle={styles.picker}
                        data={dataProductLoan}
                        value={productLoan?.value}
                        optional={true}
                        onPressItem={onChangeProductLoan}
                    />
                    <PickerValuation
                        label={Languages.loan.timeForLoan}
                        placeholder={Languages.loan.timeForLoan}
                        labelStyle={styles.label}
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
                        labelStyle={styles.label}
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
            <PopupRegisterLoanSuccess
                ref={popupRef}
                title={message}
                onClose={onClosePopup}
            />
        </View>
    );
});

export default Loan;
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
        marginBottom: 5
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
    }
});
