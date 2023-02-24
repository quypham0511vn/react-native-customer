import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import Languages from '@/commons/Languages';
import { MyTextInput } from '@/components/elements/textfield/index';
import { useAppStore } from '@/hooks';
import ScreenNames from '@/commons/ScreenNames';
import HeaderSignUp from '@/components/HeaderSignUp';
import Navigator from '@/routers/Navigator';
import { Button } from '@/components';
import { BUTTON_STYLES } from '@/components/elements/button/constants';
import { COLORS, Styles } from '@/theme';
import { Configs } from '@/commons/Configs';
import { OtpModel } from '@/models/user-model';
import Validate from '@/utils/Validate';
import { TextFieldActions } from '@/components/elements/textfield/types';
import PopupStatus from '@/components/popupStatus/PopupStatus';
import { PopupActions } from '@/components/popupStatus/types';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import { ActiveAccountSocialModel } from '@/models/auth';
import MyLoading from '@/components/MyLoading';
import ScrollViewWithKeyboard from '@/components/KeyboardAwareView';
import ToastUtils from '@/utils/ToastUtils';

const otp: OtpModel[] = [
    {
        otp1: '',
        otp2: '',
        otp3: '',
        otp4: '',
        otp5: '',
        otp6: ''
    }
];

const second = 60;

const OTPSignUp = observer(({ route }: { route: any }) => {
    const { phone, data } = route.params;
    const isFocus = useIsFocused();
    const { apiServices, userManager } = useAppStore();

    const [values] = useState<OtpModel[]>(otp);
    const [disable, setDisable] = useState<boolean>(true);
    const [disableResend, setDisableResend] = useState<boolean>(true);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [timer, setTimer] = useState<number>(second);

    const intervalRef = useRef<any>();
    const popupResendCode = useRef<PopupActions>();
    const otp1Ref = useRef<TextFieldActions>();
    const otp2Ref = useRef<TextFieldActions>();
    const otp3Ref = useRef<TextFieldActions>();
    const otp4Ref = useRef<TextFieldActions>();
    const otp5Ref = useRef<TextFieldActions>();
    const otp6Ref = useRef<TextFieldActions>();

    const setValueItemOtpNull = useCallback(() => {
        otp1Ref.current?.setValue('');
        otp2Ref.current?.setValue('');
        otp3Ref.current?.setValue('');
        otp4Ref.current?.setValue('');
        otp5Ref.current?.setValue('');
        otp6Ref.current?.setValue('');
    }, []);

    useEffect(() => {
        if (isFocus) {
            otp1Ref.current?.blur();
            otp2Ref.current?.blur();
            otp3Ref.current?.blur();
            otp4Ref.current?.blur();
            otp5Ref.current?.blur();
            otp6Ref.current?.blur();
            setTimer(60);
            setDisableResend(true);
            setDisable(true);
            setValueItemOtpNull();
        }
    }, [isFocus]);

    const onPressOtp = useCallback(async () => {
        const OTP = values[0].otp1 + values[0].otp2 + values[0].otp3 + values[0].otp4 + values[0].otp5 + values[0].otp6;
        if (timer > 0) {
            if (OTP.length > 0) {
                setDisable(false);
            }
            if (
                route?.params?.navigateFrom === ScreenNames.confirmPhoneNumber &&
                OTP.length === 6
            ) {
                console.log('success', OTP);
                values[0].otp1 = '';
                values[0].otp2 = '';
                values[0].otp3 = '';
                values[0].otp4 = '';
                values[0].otp5 = '';
                values[0].otp6 = '';
                setLoading(true);
                const res = await apiServices.auth.activeAccountSocial(
                    OTP,
                    route?.params?.id
                );
                setLoading(false);
                otp6Ref.current?.blur();
                if (res.success) {
                    setValueItemOtpNull();
                    setDisableResend(true);
                    setDisable(true);
                    otp6Ref.current?.blur();
                    const temp = res?.data as ActiveAccountSocialModel;
                    if (temp?.token_app) {
                        console.log('temp', temp);
                        userManager.updateUserInfo(temp);
                    }
                }
                else {
                    setValueItemOtpNull();
                    setDisableResend(true);
                    setDisable(true);
                    otp6Ref.current?.blur();
                }
            } else if (OTP.length === 6) {
                console.log('success', OTP);
                setLoading(true);
                const res = await apiServices.auth.activeAuth(OTP, phone);
                setLoading(false);
                if (res.success) {
                    setTimeout(() => {
                        Navigator.popScreen(2);
                    }, 1500);
                    values[0].otp1 = '';
                    values[0].otp2 = '';
                    values[0].otp3 = '';
                    values[0].otp4 = '';
                    values[0].otp5 = '';
                    values[0].otp6 = '';
                    ToastUtils.showSuccessToast(Languages.profileAuth.successSignUp);
                    setValueItemOtpNull();
                    setDisableResend(true);
                    setDisable(true);
                    otp6Ref.current?.blur();
                }
                else {
                    setValueItemOtpNull();
                    setDisableResend(true);
                    setDisable(true);
                    otp6Ref.current?.blur();
                }
            }
        } else {
            setValueItemOtpNull();
            otp6Ref.current?.blur();
            ToastUtils.showErrorToast(Languages.errorMsg.resendOTP);
        }

    }, [values, timer, route?.params?.navigateFrom, route?.params?.id, apiServices.auth, userManager, phone, setValueItemOtpNull]);

    const encode = (str: string) => {
        return str.replace(/[0-9]{7}/g, () => {
            return '0**'.slice();
        });
    };

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setTimer((t) => t - 1);
        }, 1000);
        return () => clearInterval(intervalRef.current);
    }, [timer]);

    useEffect(() => {
        if (timer <= 0) {
            clearInterval(intervalRef.current);
        }
        if (timer === 0) {
            popupResendCode.current?.show();
            setDisable(true);
            setTimeout(() => {
                popupResendCode.current?.hide();
            }, 3000);
            setDisableResend(false);
        }
    }, [timer]);

    const textInputChange = useCallback((text: any, ref: any) => {
        const value =
            Validate.stringIsNumberOnly(text) && text.length === 1 ? text.trim() : '';
        if (value !== '') {
            ref.current.focus();
        }
    }, []);

    const onChangeInputOneKeyPress = useCallback((keyPress?: any) => {
        const key = keyPress.nativeEvent.key;
        if (key === 'Backspace') {
            otp1Ref.current?.focus();
        }
    }, []);

    const onChangeInputTwoKeyPress = useCallback((keyPress?: any) => {
        const key = keyPress.nativeEvent.key;
        if (key === 'Backspace') {
            otp1Ref.current?.focus();
        }
    }, []);

    const onChangeInputThreeKeyPress = useCallback((keyPress?: any) => {
        const key = keyPress.nativeEvent.key;
        if (key === 'Backspace') {
            otp2Ref.current?.focus();
        }
    }, []);

    const onChangeInputFourKeyPress = useCallback((keyPress?: any) => {
        const key = keyPress.nativeEvent.key;
        if (key === 'Backspace') {
            otp3Ref.current?.focus();
        }
    }, []);

    const onChangeInputFiveKeyPress = useCallback((keyPress?: any) => {
        const key = keyPress.nativeEvent.key;
        if (key === 'Backspace') {
            otp4Ref.current?.focus();
        }
    }, []);

    const onChangeInputSixKeyPress = useCallback((keyPress?: any) => {
        const key = keyPress.nativeEvent.key;
        if (key === 'Backspace') {
            otp5Ref.current?.focus();
        }
    }, []);

    const onChangeText = useCallback(
        (value: string, tag?: string) => {
            switch (tag) {
                case Languages.otp.otp1:
                    values[0].otp1 = value;
                    textInputChange(value, otp2Ref);
                    break;
                case Languages.otp.otp2:
                    values[0].otp2 = value;
                    textInputChange(value, otp3Ref);
                    break;
                case Languages.otp.otp3:
                    values[0].otp3 = value;
                    textInputChange(value, otp4Ref);
                    break;
                case Languages.otp.otp4:
                    values[0].otp4 = value;
                    textInputChange(value, otp5Ref);
                    break;
                case Languages.otp.otp5:
                    values[0].otp5 = value;
                    textInputChange(value, otp6Ref);
                    break;
                case Languages.otp.otp6:
                    values[0].otp6 = value;
                    if (values[0].otp6.length > 0) onPressOtp();
                    break;
                default:
                    break;
            }
        },
        [onPressOtp, textInputChange, values]
    );

    const renderInput = useCallback(
        (
            ref: any,
            testId: string,
            value: string,
            onKeyPress?: any,
            disabled?: any
        ) => {
            return (
                <MyTextInput
                    ref={ref}
                    inputStyle={styles.inputOtp}
                    value={value}
                    containerInput={styles.viewOtp}
                    keyboardType={'NUMBER'}
                    onChangeText={onChangeText}
                    maxLength={1}
                    testID={testId}
                    autoFocus={disabled}
                    onKeyPress={onKeyPress}
                />
            );
        },
        [onChangeText]
    );

    const backToSignUp = () => {
        Navigator.goBack();
    };

    const resentCode = useCallback(async () => {
        setLoading(true);
        const res = await apiServices.auth.resendOtp(phone);
        setLoading(false);
        if (res.success) {
            setTimer(60);
            setDisableResend(true);
            setDisable(true);
            setValueItemOtpNull();
            otp1Ref.current?.focus();
        }
    }, [apiServices.auth, phone, setValueItemOtpNull]);

    const renderPopup = useCallback((ref: any, description: string) => {
        return (
            <PopupStatus
                ref={ref}
                title={Languages.otp.popupOtpErrorTitle}
                description={description}
            />
        );
    }, []);

    const confirmOtp = useCallback(() => {
        onPressOtp();
    }, [onPressOtp]);

    return (
        <View style={styles.container}>
            <HeaderSignUp
                onGoBack={backToSignUp}
                hasBack
                title={Languages.otp.keyOtp}
            />

            <ScrollViewWithKeyboard style={styles.containerBox}>
                <Text style={styles.confirmOtp}>{Languages.otp.confirmOtp}</Text>

                <View style={styles.boxOtp}>
                    {renderInput(
                        otp1Ref,
                        Languages.otp.otp1,
                        values[0].otp1,
                        onChangeInputOneKeyPress,
                        disable
                    )}
                    {renderInput(
                        otp2Ref,
                        Languages.otp.otp2,
                        values[0].otp2,
                        onChangeInputTwoKeyPress
                    )}
                    {renderInput(
                        otp3Ref,
                        Languages.otp.otp3,
                        values[0].otp3,
                        onChangeInputThreeKeyPress
                    )}
                    {renderInput(
                        otp4Ref,
                        Languages.otp.otp4,
                        values[0].otp4,
                        onChangeInputFourKeyPress
                    )}
                    {renderInput(
                        otp5Ref,
                        Languages.otp.otp5,
                        values[0].otp5,
                        onChangeInputFiveKeyPress
                    )}
                    {renderInput(
                        otp6Ref,
                        Languages.otp.otp6,
                        values[0].otp6,
                        onChangeInputSixKeyPress
                    )}
                </View>

                {/* <Button
                    label={Languages.button.btnConfirm}
                    disabled={disable}
                    onPress={confirmOtp}
                    buttonStyle={disable ? BUTTON_STYLES.WHITE : BUTTON_STYLES.GREEN}
                /> */}

                <View style={styles.notifyOtp}>
                    <Text style={styles.text}>
                        {Languages.otp.verificationCode}
                        <Text>{encode(phone)}</Text>
                        {Languages.otp.codeExpiresLater}
                        <Text style={styles.color}>{timer}s</Text>
                    </Text>
                    <View style={styles.buttonResend}>
                        <Button
                            label={Languages.otp.resentCode}
                            disabled={disableResend}
                            onPress={resentCode}
                            buttonStyle={
                                disableResend ? BUTTON_STYLES.WHITE : BUTTON_STYLES.GREEN
                            }
                            style={styles.resendCode}
                            fontSize={Configs.FontSize.size14}
                        />
                    </View>
                </View>
                {renderPopup(popupResendCode, Languages.otp.popupOtpResendCode)}
            </ScrollViewWithKeyboard>
            {isLoading && <MyLoading isOverview />}
        </View>
    );
});

export default OTPSignUp;
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    containerBox: {
        paddingVertical: 16,
        paddingHorizontal: 16
    },
    confirmOtp: {
        ...Styles.typography.bold,
        fontSize: Configs.FontSize.size19
    },
    boxOtp: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: Configs.FontSize.size30
    },
    viewOtp: {
        width: Configs.FontSize.size50,
        height: Configs.FontSize.size50,
        marginVertical: 10,
        marginHorizontal: 4,
        borderWidth: 1
    },
    inputOtp: {
        ...Styles.typography.medium,
        color: COLORS.BLACK,
        textAlign: 'center'
    },
    notifyOtp: {
        marginTop: Configs.FontSize.size30
    },
    text: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_9,
        marginBottom: 20
    },
    resentCode: {
        ...Styles.typography.medium,
        color: COLORS.GREEN
    },
    color: {
        color: COLORS.RED_1
    },
    buttonResend: {
        alignItems: 'center'
    },
    resendCode: {
        width: SCREEN_WIDTH / 3
    }
});
