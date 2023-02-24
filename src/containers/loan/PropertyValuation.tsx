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
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import CarIcon from '@/assets/images/img_car.svg';
import MotorIcon from '@/assets/images/img_moto.svg';
import { Configs } from '@/commons/Configs';
import { PRODUCT } from '@/commons/constants';
import Languages from '@/commons/Languages';
import ScreenNames from '@/commons/ScreenNames';
import { HeaderBar, Touchable } from '@/components';
import { ItemProps } from '@/components/BottomSheet';
import PickerValuation, { PickerAction } from '@/components/PickerValuation';
import { useAppStore } from '@/hooks';
import SessionManager from '@/managers/SessionManager';
import {
    DepreciationModel,
    FormalityModel,
    PropertyPriceModel
} from '@/models/propertyValuation';
import Navigator from '@/routers/Navigator';
import { COLORS, Styles } from '@/theme';
import Utils from '@/utils/Utils';


const PropertyValuation = observer(({ route }: any) => {
    const { apiServices, userManager } = useAppStore();
    const { vehicle } = route.params;
    const [isCar, setIsCar] = useState<boolean>(vehicle === PRODUCT.CAR);
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

    const [propertyValue, setPropertyValue] = useState<number>(0);
    const [propertyMaxLoan, setPropertyMaxLoan] = useState<number>(0);
    const formalityRef = useRef<PickerAction>(null);
    const brandRef = useRef<PickerAction>(null);
    const modelRef = useRef<PickerAction>(null);
    const propertyNameRef = useRef<PickerAction>(null);
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        if (route?.params?.fromScreen) {
            const data = route?.params;
            setFormality(data?.formality);
            setIsCar(data?.isCar);
            setDataFormality(data?.dataFormality);
            setBrandName(data?.brandName);
            setDataBrandName(data?.dataBrandName);
            setModelName(data?.modelName);
            setDataModelName(data?.dataModelName);
            setPropertyName(data?.propertyName);
            setDataPropertyName(data?.dataPropertyName);
            setDataDepreciation(data?.dataDepreciation);
            setPropertyValue(data?.propertyValue);
            setPropertyMaxLoan(data?.propertyMaxLoan);
            setItemsSelectedDepreciation(data?.itemsSelectedDepreciation);
            SessionManager.setTempDataForPropertyValuation(null);
        } else {
            fetchFormality();
            fetchBrandName(vehicle === PRODUCT.CAR);
        }
    }, []);

    useEffect(() => {
        if (itemsSelectedDepreciation?.length >= 0) {
            debounceCalculateDepreciation();
        }
    }, [itemsSelectedDepreciation]);

    const fetchFormality = useCallback(async () => {
        const res = await apiServices.property.getListFormalityLoan();
        if (res.success) {
            const data = res.data as FormalityModel[];
            const temp = [] as ItemProps[];
            data?.map((item: any) => {
                if (item?.code !== 'TC') {
                    temp.push({
                        value: item?.name,
                        id: item?.code
                    });
                }
            });
            setDataFormality(temp);
        }
    }, [apiServices.property]);

    const fetchBrandName = useCallback(
        async (value?: boolean) => {
            const codeMain = value ? PRODUCT.CAR : PRODUCT.MOTOR;
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
                        id: item?._id?.$oid
                    });
                });
                setDataPropertyName(temp);
            }
        },
        [apiServices.property]
    );

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
        async (item: string, formalityValue?: string) => {
            const code_type_property = isCar ? PRODUCT.CAR : PRODUCT.MOTOR;
            const depreciationTemp = [] as Array<string>;
            itemsSelectedDepreciation.map((_item) => {
                depreciationTemp.push(_item?.price as string);
            });
            const res = await apiServices.property.getPropertyPrice(
        item as string,
        code_type_property,
        formalityValue || (formality?.id as string),
        depreciationTemp.length > 0 ? depreciationTemp : []
            );
            if (res.success) {
                const data = res?.data as PropertyPriceModel;
                setPropertyValue(data.gia_tri_tai_san);
                setPropertyMaxLoan(data.so_tien_co_the_vay);
            }
        },
        [formality, isCar, itemsSelectedDepreciation, apiServices.property]
    );
    const fetchCalculateDepreciation = useCallback(() => {
        if (propertyName?.id) {
            fetchPropertyPrice(propertyName?.id || '');
        }
    }, [fetchPropertyPrice, propertyName?.id]);

    const debounceCalculateDepreciation = useCallback(
        debounce(() => fetchCalculateDepreciation(), 200),
        [fetchCalculateDepreciation]
    );

    const onChangeVehicle = useCallback(() => {
        setIsCar((car) => !car);
        fetchBrandName(!isCar);
        setPropertyValue(0);
        setFormality({});
        setDataBrandName([]);
        setBrandName({});
        setModelName({});
        setDataModelName([]);
        setPropertyName({});
        setDataPropertyName([]);
        setDataDepreciation([]);
        setPropertyValue(0);
        setPropertyMaxLoan(0);
        setItemsSelectedDepreciation([]);
    }, [fetchBrandName, isCar]);

    const onChangeFormality = useCallback(
        (item: any) => {
            setFormality(item);
            if (propertyName?.id) {
                fetchPropertyPrice(propertyName?.id, item?.id);
            }
        },
        [fetchPropertyPrice, propertyName?.id]
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
        [brandName, fetchModelName]
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

    const renderValuationItem = useCallback(
        (icon: any, title: string, active: boolean) => {
            const style = [
                styles.cardValuation,
                {
                    backgroundColor: active ? COLORS.WHITE_BLUE : null,
                    borderColor: active ? COLORS.GREEN : COLORS.GRAY_2
                }
            ] as ViewStyle;

            return (
                <Touchable
                    disabled={active}
                    style={style}
                    radius={10}
                    onPress={onChangeVehicle}
                >
                    {icon}
                    <Text style={styles.txtService}>{title}</Text>
                </Touchable>
            );
        },
        [onChangeVehicle]
    );

    const renderValueProperty = useCallback((value: number) => {
        const style = {
            color: value > 0 ? COLORS.BLACK : COLORS.GRAY_6
        };
        const wrapValue = {
            backgroundColor: value > 0 ? COLORS.WHITE : COLORS.GRAY_10
        };
        return (
            <View style={[styles.wrapValue,wrapValue]}>
                <Text style={[styles.placeholder, style]}>
                    {Utils.formatMoney(value?.toString()) || 'VND'}
                </Text>
            </View>
        );
    }, []);

    const registerNow = useCallback(() => {
        const formalityError = formality?.value ? '' : Languages.loan.formality;

        const brandError = brandName?.value
            ? ''
            : Languages.propertyValuation.brandName;
        const modelError = modelName?.value
            ? ''
            : Languages.propertyValuation.model;
        const propertyNameError = propertyName?.value
            ? ''
            : Languages.loan.assetName;

        formalityRef.current?.setErrorMsg(formalityError);
        brandRef.current?.setErrorMsg(brandError);
        modelRef.current?.setErrorMsg(modelError);
        propertyNameRef.current?.setErrorMsg(propertyNameError);
        if (
            `${formalityError}${brandError}${modelError}${propertyNameError}`
                .length === 0
        ) {
            if (!userManager?.userInfo) {
                SessionManager.setTempDataForPropertyValuation({
                    fromScreen: ScreenNames.propertyValuation,
                    isCar,
                    formality,
                    dataFormality,
                    brandName,
                    dataBrandName,
                    dataModelName,
                    modelName,
                    propertyName,
                    dataPropertyName,
                    dataDepreciation,
                    propertyValue,
                    propertyMaxLoan,
                    itemsSelectedDepreciation
                });
                Navigator.navigateToDeepScreen([ScreenNames.auth], ScreenNames.login);
            } else {
                Navigator.navigateScreen(ScreenNames.registerLoanNow, {
                    formality,
                    propertyName,
                    propertyMaxLoan,
                    propertyType: isCar ? PRODUCT.CAR : PRODUCT.MOTOR
                });
            }
        }
    }, [
        brandName,
        dataBrandName,
        dataDepreciation,
        dataFormality,
        dataModelName,
        dataPropertyName,
        formality,
        isCar,
        itemsSelectedDepreciation,
        modelName,
        propertyMaxLoan,
        propertyName,
        propertyValue,
        userManager?.userInfo
    ]);

    const onScrollTo = useCallback((value: any) => {
        scrollViewRef.current?.scrollTo({
            x: 0,
            y: value,
            animated: true
        });
    }, []);

    const renderDepreciation = useMemo(() => {
        if (itemsSelectedDepreciation.length > 0) {
            return (
                <View style={styles.wrapDepreciation}>
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

    return (
        <View style={styles.container}>
            <HeaderBar
                hasBack={true}
                title={Languages.propertyValuation.title}
                exitApp={false}
                noStatusBar={true}
            />
            <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
                <View style={styles.wrapContent}>
                    <View style={styles.wrapVehicle}>
                        {renderValuationItem(
                            <CarIcon />,
                            Languages.propertyValuation.car,
                            isCar
                        )}
                        {renderValuationItem(
                            <MotorIcon />,
                            Languages.propertyValuation.motor,
                            !isCar
                        )}
                    </View>
                    <PickerValuation
                        label={Languages.propertyValuation.formality}
                        placeholder={Languages.propertyValuation.formality}
                        onPressItem={onChangeFormality}
                        value={formality?.value}
                        data={dataFormality}
                        ref={formalityRef}
                        onScrollTo={onScrollTo}
                    />
                    <PickerValuation
                        label={Languages.propertyValuation.brandName}
                        placeholder={Languages.propertyValuation.brandName}
                        onPressItem={onChangeBrandName}
                        value={brandName?.value}
                        data={dataBrandName}
                        ref={brandRef}
                        onScrollTo={onScrollTo}
                    />
                    <PickerValuation
                        label={Languages.propertyValuation.model}
                        placeholder={Languages.propertyValuation.model}
                        onPressItem={onChangeModelName}
                        value={modelName?.value}
                        data={dataModelName}
                        disable={!brandName?.value}
                        ref={modelRef}
                        onScrollTo={onScrollTo}
                    />
                    <PickerValuation
                        label={Languages.propertyValuation.name}
                        placeholder={Languages.propertyValuation.name}
                        onPressItem={onChangePropertyName}
                        value={propertyName?.value}
                        data={dataPropertyName}
                        disable={!modelName?.value}
                        ref={propertyNameRef}
                        onScrollTo={onScrollTo}
                    />
                    <PickerValuation
                        label={Languages.propertyValuation.depreciation}
                        placeholder={Languages.propertyValuation.depreciation}
                        onPressItem={onChangeDepreciation}
                        data={dataDepreciation}
                        disable={!propertyName?.value}
                        isCheckboxList={true}
                        onScrollTo={onScrollTo}
                        optional={true}
                    />
                    {renderDepreciation}
                    <Text style={styles.label}>
                        {Languages.propertyValuation.valuation}
                    </Text>
                    {renderValueProperty(propertyValue || 0)}
                    <Text style={styles.label}>
                        {Languages.propertyValuation.money}
                    </Text>
                    {renderValueProperty(propertyMaxLoan || 0)}
                    <Touchable
                        style={styles.button}
                        onPress={registerNow}
                        radius={Configs.FontSize.size30}
                    >
                        <Text style={styles.txtButton}>
                            {Languages.propertyValuation.borrow}
                        </Text>
                    </Touchable>
                </View>
            </ScrollView>
        </View>
    );
});

export default PropertyValuation;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE
    },
    wrapContent: {
        paddingHorizontal: 16,
        flexDirection: 'column'
    },
    wrapVehicle: {
        paddingTop: 35,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    cardValuation: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        padding: 15,
        borderRadius: 10,
        borderColor: COLORS.GRAY_2,
        borderWidth: 1
    },
    txtService: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size16,
        marginTop: 10,
        color: COLORS.BLACK
    },
    label: {
        ...Styles.typography.regular,
        marginTop: 15,
        color: COLORS.BLACK,
        marginBottom: 5
    },
    button: {
        paddingVertical: 15,
        backgroundColor: COLORS.GREEN,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Configs.FontSize.size30,
        marginVertical: Configs.FontSize.size40
    },
    txtButton: {
        ...Styles.typography.medium,
        color: COLORS.WHITE,
        fontSize: Configs.FontSize.size14
    },

    wrapValue: {
        width: '100%',
        borderColor: COLORS.GRAY_2,
        borderWidth: 1,
        paddingHorizontal: 15,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        height: 40,
        alignItems: 'center'
    },
    placeholder: {
        ...Styles.typography.regular
    },
    txtDepreciation: {
        ...Styles.typography.medium,
        marginLeft: 10,
        marginBottom: 4
    },
    itemDepreciation: {
        marginBottom: 5,
        marginLeft: 10
    },
    wrapDepreciation: {
        marginTop: 15
    }
});
