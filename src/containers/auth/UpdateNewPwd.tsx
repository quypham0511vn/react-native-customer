import { observer } from 'mobx-react';
import React, { useCallback, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { ICONS } from '@/assets/icons/constant';
import { Configs } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { Button } from '@/components';
import { BUTTON_STYLES } from '@/components/elements/button/constants';
import { MyTextInput } from '@/components/elements/textfield';
import { TextFieldActions } from '@/components/elements/textfield/types';
import HeaderLogo from '@/components/HeaderLogo';
import { MyImageView } from '@/components/image';
import ScrollViewWithKeyboard from '@/components/KeyboardAwareView';
import MyLoading from '@/components/MyLoading';
import { PopupOtpInputActions } from '@/components/OtpInputComponent';
import { PopupOtp } from '@/components/PopupOtp';
import { useAppStore } from '@/hooks';
import { UserInfoModel } from '@/models/user-model';
import Navigator from '@/routers/Navigator';
import FormValidate from '@/utils/FormValidate';
import ToastUtils from '@/utils/ToastUtils';
import { COLORS, Styles } from '../../theme';

const UpdateNewPwd = observer(({ route }: { route: any }) => {

    // const { phone, OTP } = route.params;

    const { apiServices, userManager } = useAppStore();

    const [userInfo] = useState<UserInfoModel | undefined>(userManager.userInfo);
    const [disable, setDisable] = useState<boolean>(false);
    const [isLoading, setLoading] = useState<boolean>(false);

    const [phoneNumber, setPhone] = useState<string>('');
    const [newPwd, setNewPwd] = useState<string>('');
    const [rePwd, setRePwd] = useState<string>('');

    const phoneRef = useRef<TextFieldActions>(null);
    const newPwdRef = useRef<TextFieldActions>(null);
    const rePwdRef = useRef<TextFieldActions>(null);

    const popupOtpRef = useRef<PopupOtpInputActions>(null);

    const onStatusButtonSignUp = useCallback(() => {
        if (newPwd !== '' && rePwd !== '') {
            setDisable(true);
        }
    }, [newPwd, rePwd]);

    const onChangeText = useCallback((value: string, tag?: string) => {
        switch (tag) {
            case Languages.changePwd.placeNewPass:
                setNewPwd(value);
                onStatusButtonSignUp();
                break;
            case Languages.changePwd.currentNewPass:
                setRePwd(value);
                onStatusButtonSignUp();
                break;
            case Languages.forgotPwd.phone:
                setPhone(value);
                onStatusButtonSignUp();
                break;
            default:
                break;
        }
    }, [onStatusButtonSignUp]);

    const renderInput = useCallback((_ref: any, _title: any, _placeHolder: any, _value: string, _iconPhone?: boolean, _isPass?: boolean, _maxLength?: number) => {
        return <>
            <Text style={styles.textPass}>
                {_title}
            </Text>
            <View style={styles.test}>
                <MyTextInput
                    ref={_ref}
                    placeHolder={_placeHolder}
                    leftIcon={_iconPhone ? ICONS.PHONE : ICONS.LOCK}
                    value={_value}
                    onChangeText={onChangeText}
                    inputStyle={styles.input}
                    isPassword={!_isPass}
                    maxLength={_maxLength || 50}
                    keyboardType={_iconPhone ? 'PHONE' : 'DEFAULT'}
                />
            </View>
        </>;
    }, [onChangeText]);

    const onValidation = useCallback(() => {
        const errMsgPhone = FormValidate.passConFirmPhone(phoneNumber);
        const errMsgNewPwd = FormValidate.passValidate(newPwd);
        const errMsgRePwd = FormValidate.passConFirmValidate(newPwd, rePwd);

        phoneRef.current?.setErrorMsg(errMsgPhone);
        newPwdRef.current?.setErrorMsg(errMsgNewPwd);
        rePwdRef.current?.setErrorMsg(errMsgRePwd);

        if (`${errMsgNewPwd}${errMsgRePwd}${errMsgPhone}`.length === 0) {
            return true;
        }
        return false;
    }, [newPwd, phoneNumber, rePwd]);

    const onUpdateNewPwd = useCallback(async () => {
        if (onValidation()) {
            setLoading(true);
            const res = await apiServices.auth.otpResetPwd(phoneNumber);
            setLoading(false);
            if (res.success) {
                popupOtpRef.current?.show();
            }
        }
    }, [apiServices.auth, onValidation, phoneNumber]);

    const onProcessNewPwd = useCallback(async (_Otp: string) => {
        if (_Otp.length === 6) {
            console.log('_OTP=', _Otp);
            setLoading(true);
            const res = await apiServices.auth.updateNewPwd(phoneNumber, _Otp, newPwd, rePwd);
            setLoading(false);
            if (res.success) {
                popupOtpRef.current?.blur?.();
                popupOtpRef.current?.hide?.();
                popupOtpRef.current?.setErrorMsg?.('');
                setTimeout(() => {
                    Navigator.popScreen(1);
                }, 600);
                ToastUtils.showSuccessToast(Languages.changePwd.toastSuccess);
            } else {
                popupOtpRef.current?.setErrorMsg?.(Languages.forgotPwd.otpFalse);
                popupOtpRef.current?.blur();
                ToastUtils.doNotShowToast();
            }
        }

    }, [apiServices.auth, newPwd, phoneNumber, rePwd]);

    const onResendOtp = useCallback(async () => {
        setLoading(true);
        const res = await apiServices.auth.otpResetPwd(phoneNumber);
        setLoading(false);
        if (res.success) {
            popupOtpRef.current?.setErrorMsg?.('');
        }
    }, [apiServices.auth, phoneNumber]);

    const renderPopupOtp = useCallback((_ref: any) => {
        return (
            <PopupOtp ref={_ref} onEndingTextOtp={onProcessNewPwd} reSendOtp={onResendOtp} phone={phoneNumber} />
        );
    }, [onProcessNewPwd, onResendOtp, phoneNumber]);

    return (
        <View style={styles.container}>
            <HeaderLogo />
            <SafeAreaView style={styles.container}>
                <View style={styles.wrapContent}>
                    <View style={styles.wrapAvatar}>
                        <MyImageView
                            style={styles.imageAvatar}
                            imageUrl={userInfo?.avatar} />
                    </View>
                    <ScrollViewWithKeyboard>
                        <View style={styles.wrapInput}>
                            <Text style={styles.textScreen}>
                                {Languages.forgotPwd.enterPwdNew}
                            </Text>
                            <Text style={styles.description}>
                                {Languages.forgotPwd.enterInputPwdNew}
                            </Text>
                            {renderInput(phoneRef, Languages.forgotPwd.phone, Languages.forgotPwd.phone, phoneNumber, true, true, 10)}
                            {renderInput(newPwdRef, Languages.forgotPwd.enterPwdNew, Languages.forgotPwd.enterPwdNew, newPwd)}
                            {renderInput(rePwdRef, Languages.forgotPwd.enterConfirmPwdNew, Languages.forgotPwd.enterConfirmPwdNew, rePwd)}
                        </View>
                    </ScrollViewWithKeyboard>

                    <View style={styles.wrapBt}>
                        <Button
                            onPress={onUpdateNewPwd}
                            fontSize={Configs.FontSize.size14}
                            style={styles.button}
                            label={Languages.forgotPwd.changePwd}
                            buttonStyle={!disable ? BUTTON_STYLES.WHITE : BUTTON_STYLES.GREEN} />
                    </View>
                </View>
                {isLoading && <MyLoading isOverview />}
            </SafeAreaView>
            {renderPopupOtp(popupOtpRef)}
        </View>
    );
});

export default UpdateNewPwd;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    container1: {
        flex: 1,
        backgroundColor: COLORS.WHITE
    },
    wrapContent: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        borderLeftColor: COLORS.GREEN
    },
    wrapAvatar: {
        width: 100,
        height: 100,
        backgroundColor: COLORS.WHITE,
        borderRadius: 50,
        alignSelf: 'center',
        top: -40,
        borderColor: COLORS.WHITE,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 5
    },
    wrapInput: {
        marginTop: Configs.IconSize.size100
    },
    textPass: {
        ...Styles.typography.medium,
        color: COLORS.GRAY_7,
        marginBottom: 15,
        marginTop: 20
    },
    wrapBt: {
        flexDirection: 'row',
        width: '100%',
        marginVertical: 15,
        alignItems: 'center'
    },
    button: {
        width: '100%',
        paddingVertical: 4
    },
    test: {
        height: 45,
        justifyContent: 'center'
    },
    input: {
        height: '100%',
        justifyContent: 'center'
    },
    imageAvatar: {
        width: 100,
        height: 100,
        borderRadius: 40,
        borderColor: COLORS.WHITE,
        borderWidth: 5,
        alignSelf: 'center'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    height100: {
        height: 100
    },
    circle: {
        ...Styles.shadow,
        width: 50,
        height: 50,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 15
    },
    bottom: {
        justifyContent: 'flex-start',
        flex: 1
    },
    content: {
        flex: 2,
        justifyContent: 'center'
    },
    hisLop: {
        paddingVertical: 10,
        paddingLeft: 10
    },
    textScreen: {
        ...Styles.typography.medium,
        color: COLORS.GREEN,
        fontSize: Configs.FontSize.size16
    },
    description: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_12,
        marginTop: 15,
        marginBottom: 15
    },
    loginNow: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_12,
        textAlign: 'center',
        marginTop: Configs.IconSize.size40
    },
    textLogin: {
        ...Styles.typography.medium,
        color: COLORS.GREEN
    }
});
