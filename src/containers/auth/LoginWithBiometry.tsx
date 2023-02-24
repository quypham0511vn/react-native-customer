import PasscodeAuth from '@el173/react-native-passcode-auth';
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, useBottomSheetTimingConfigs } from '@gorhom/bottom-sheet';
import { observer } from 'mobx-react';
import React, {
    useCallback, useEffect, useMemo,
    useRef,
    useState
} from 'react';
import {
    Keyboard, Platform, StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import TouchID from 'react-native-touch-id';

import { ICONS } from '@/assets/icons/constant';
import FaceIdIcon from '@/assets/images/ic_faceid_big.svg';
import FingerprintIcon from '@/assets/images/ic_fingerprint.svg';
import { Configs, PADDING_BOTTOM } from '@/commons/Configs';
import { ERROR_BIOMETRIC, StorageKeys } from '@/commons/constants';
import Languages from '@/commons/Languages';
import ScreenNames, { TabNamesArray } from '@/commons/ScreenNames';
import { Button } from '@/components';
import { BUTTON_STYLES } from '@/components/elements/button/constants';
import { MyTextInput } from '@/components/elements/textfield';
import { TextFieldActions } from '@/components/elements/textfield/types';
import FooterItem from '@/components/FooterItem';
import HeaderLogo from '@/components/HeaderLogo';
import { MyImageView } from '@/components/image';
import { PinCode, PinCodeT } from '@/components/pinCode';
import PopupAlertFinger from '@/components/PopupAlertFinger';
import {
    ENUM_BIOMETRIC_TYPE
} from '@/components/popupFingerprint/types';
import { useAppStore } from '@/hooks';
import SessionManager from '@/managers/SessionManager';
import { PopupActionTypes } from '@/models/typesPopup';
import { UserInfoModel } from '@/models/user-model';
import Navigator from '@/routers/Navigator';
import { COLORS, Styles } from '@/theme';
import FormValidate from '@/utils/FormValidate';
import StorageUtils from '@/utils/StorageUtils';
import MyLoading from '@/components/MyLoading';
import ToastUtils from '@/utils/ToastUtils';

const customTexts = {
    set: Languages.setPassCode
};

const LoginWithBiometry = observer(({ navigation }: any) => {
    console.log('tab', SessionManager.lastTabIndexBeforeOpenAuthTab);
    const popupAlert = useRef<PopupActionTypes>(null);
    const [password, setPassword] = useState<string>('');
    const [errorText, setErrorText] = useState<string>('');
    const [isLoading, setLoading] = useState<boolean>(false);

    const { fastAuthInfoManager: fastAuthInfo } = useAppStore();
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const { apiServices, userManager } = useAppStore();
    const [userInfo, setUserInfo] = useState<UserInfoModel | undefined>(userManager.userInfo);
    const refPass = useRef<TextFieldActions>(null);

    useEffect(() => {
        setUserInfo(userManager.userInfo);
        if (!userManager?.userInfo) {
            Navigator.navigateScreen(ScreenNames.auth);
        }
    }, [userManager?.userInfo]);

    const popupError = useMemo(() => {
        return <PopupAlertFinger title={errorText} ref={popupAlert} />;
    }, [errorText, popupAlert]);

    const onChangeText = useCallback((text: string) => {
        setPassword(text);
    }, []);

    const onLoginSuccess = useCallback(() => {
        fastAuthInfo.setEnableFastAuthentication(false);
        setTimeout(() => {
            if (SessionManager.lastTabIndexBeforeOpenAuthTab) {
                Navigator.navigateToDeepScreen([ScreenNames.tabs], TabNamesArray[SessionManager.lastTabIndexBeforeOpenAuthTab]);
            }
        }, 100);
    }, [fastAuthInfo]);


    const keyboardDismiss = useCallback(() => {
        Keyboard.dismiss();
    }, []);

    const auth = useCallback(() => {
        if (Platform.OS === 'android') {
            TouchID.authenticate(Languages.quickAuThen.description, {
                title: Languages.biometry.useFingerprint,
                imageColor: COLORS.RED,
                imageErrorColor: COLORS.RED,
                sensorDescription: Languages.biometry.useFingerPrintError,
                sensorErrorDescription: Languages.biometry.useFingerPrintManyTimesError,
                cancelText: Languages.common.close,
                cancelTextManyTime: Languages.common.agree,
                passcodeFallback: true
            }).then((data: any) => {
                onLoginSuccess();
            })
                .catch((error: any) => {
                    if (error.code === ERROR_BIOMETRIC.NOT_ENROLLED) {
                        ToastUtils.showErrorToast(Languages.errorBiometryType.NOT_ENROLLED);
                    } else if (error.code === ERROR_BIOMETRIC.FINGERPRINT_ERROR_LOCKOUT || error.code === ERROR_BIOMETRIC.FINGERPRINT_ERROR_LOCKOUT_PERMANENT) {
                        bottomSheetModalRef.current?.present?.();
                    }
                });
        } else {
            PasscodeAuth.authenticate(Languages.quickAuThen.description)
                .then(() => {
                    onLoginSuccess();
                })
                .catch(() => {});
        }
    }, [onLoginSuccess]);

    const touchIdType = useMemo(() => {
        if (fastAuthInfo.supportedBiometry === ENUM_BIOMETRIC_TYPE.TOUCH_ID) {
            return (
                <TouchableOpacity onPress={auth}>
                    <LinearGradient
                        colors={[COLORS.WHITE_GREEN, COLORS.WHITE]}
                        style={styles.iconFinger}
                    >
                        <FingerprintIcon width={25} height={25} />
                    </LinearGradient>
                </TouchableOpacity>
            );
        }
        if (fastAuthInfo.supportedBiometry === ENUM_BIOMETRIC_TYPE.FACE_ID) {
            return (
                <TouchableOpacity onPress={auth}>
                    <LinearGradient
                        colors={[COLORS.WHITE_GREEN, COLORS.WHITE]}
                        style={styles.iconFinger}
                    >
                        <FaceIdIcon width={25} height={25} />
                    </LinearGradient>
                </TouchableOpacity>
            );
        }

        return null;
    }, [auth, fastAuthInfo.supportedBiometry]);

    const checkPin = useCallback(async (value: any) => {
        const pin = await StorageUtils.getDataByKey(StorageKeys.KEY_PIN);
        if (pin === value) {
            return true;
        }
        return false;
    }, []);

    const CustomBackdrop = (props: BottomSheetBackdropProps) => {
        return <BottomSheetBackdrop {...props} pressBehavior="close" />;
    };

    const animationConfigs = useBottomSheetTimingConfigs({
        duration: 800
    });

    const onLoginSuccessWithPIn = useCallback(() => {
        bottomSheetModalRef?.current?.close();
        onLoginSuccess();
    }, [onLoginSuccess]);
    const renderPinCode = useMemo(() => {
        return (
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={1}
                snapPoints={['20%', '82%']}
                keyboardBehavior={'interactive'}
                enablePanDownToClose={true}
                backdropComponent={CustomBackdrop}
                animationConfigs={animationConfigs}
            >
                <View style={styles.wrapPin}>
                    <PinCode
                        mode={PinCodeT.Modes.Enter}
                        visible={true}
                        options={{
                            pinLength: 4,
                            maxAttempt: 4,
                            lockDuration: 10000,
                            disableLock: false
                        }}
                        mainStyle={customStyles.main}
                        textOptions={customTexts}
                        titleStyle={customStyles.title}
                        buttonsStyle={customStyles.buttons}
                        subTitleStyle={customStyles.subTitle}
                        buttonTextStyle={customStyles.buttonText}
                        pinContainerStyle={customStyles.pinContainer}
                        checkPin={checkPin}
                        onEnterSuccess={onLoginSuccessWithPIn}
                    />
                </View>
            </BottomSheetModal>
        );
    }, [animationConfigs, checkPin, onLoginSuccessWithPIn]);

    const loginWithPassword = useCallback(async () => {
        const errMsgPwd = FormValidate.passValidate(password);
        refPass.current?.setErrorMsg(errMsgPwd);
        if (userInfo?.phone_number && `${errMsgPwd}`.length === 0) {
            setLoading(true);
            const res = await apiServices.auth.loginPhone(userInfo?.phone_number, password);
            if (res.success) {
                onLoginSuccess();
            }
            setLoading(false);
        }
    }, [apiServices.auth, onLoginSuccess, password, userInfo?.phone_number]);

    const navigateToOther = useCallback(() => {
        Navigator.navigateScreen(ScreenNames.login);
    }, []);

    const onNavigateForgotPwd = useCallback(() => {
        Navigator.navigateScreen(ScreenNames.updateNewPwd);
    }, []);

    return (
        <TouchableWithoutFeedback onPress={keyboardDismiss}>
            <View style={styles.container1}>
                <HeaderLogo />
                <View style={styles.container}>
                    <View style={styles.wrapContent}>
                        <View style={styles.wrapAvatar}>
                            <MyImageView
                                style={styles.imageAvatar}
                                imageUrl={userInfo?.avatar} />
                        </View>
                        <View style={styles.wrapText}>
                            <Text style={styles.txtHello}>
                                {Languages.authentication.hello}
                            </Text>
                            <Text style={styles.txtName}>{userInfo?.full_name}</Text>
                        </View>
                        <View style={styles.wrapInput}>
                            <Text style={styles.textPass}>
                                {Languages.authentication.password}
                            </Text>
                            <View style={styles.test}>
                                <MyTextInput
                                    ref={refPass}
                                    placeHolder={Languages.authentication.password}
                                    leftIcon={ICONS.LOCK}
                                    value={password}
                                    onChangeText={onChangeText}
                                    inputStyle={styles.input}
                                    isPassword
                                    maxLength={50}
                                />
                            </View>
                        </View>
                        <View style={styles.wrapUnderTxt}>
                            <TouchableOpacity onPress={navigateToOther}>
                                <Text style={styles.greenText}>
                                    {Languages.authentication.otherLogin}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onNavigateForgotPwd}>
                                <Text style={styles.redText}>
                                    {Languages.authentication.forgotPwd}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.wrapBt}>
                            <Button onPress={loginWithPassword}
                                fontSize={Configs.FontSize.size14}
                                style={styles.button}
                                label={Languages.authentication.login}
                                buttonStyle={BUTTON_STYLES.GREEN} />
                            {touchIdType}
                        </View>
                    </View>
                    <FooterItem />
                </View>
                {popupError}
                {renderPinCode}
                {isLoading && <MyLoading isOverview />}
            </View>
        </TouchableWithoutFeedback>
    );
});

export default LoginWithBiometry;
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    container1: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
        paddingBottom: PADDING_BOTTOM
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
        borderRadius: 60,
        alignSelf: 'center',
        top: -40,
        borderColor: COLORS.WHITE,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 5
    },
    wrapText: {
        alignSelf: 'center',
        flexDirection: 'row',
        marginTop: 70
    },
    txtHello: {
        ...Styles.typography.medium,
        alignSelf: 'flex-end'
    },
    txtName: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size18,
        color: COLORS.GREEN,
        marginLeft: 6,
        fontWeight: '600'
    },
    wrapInput: {
        marginTop: 40
    },
    textPass: {
        ...Styles.typography.medium,
        color: COLORS.DARK_GRAY,
        marginBottom: 10
    },
    wrapUnderTxt: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 25
    },
    greenText: {
        ...Styles.typography.medium,
        color: COLORS.GREEN,
        fontSize: Configs.FontSize.size14
    },
    redText: {
        ...Styles.typography.medium,
        color: COLORS.RED
    },
    wrapBt: {
        flexDirection: 'row',
        width: '100%',
        marginTop: 25,
        alignItems: 'center'
    },
    button: {
        width: '80%',
        paddingVertical: 4
    },
    // textSubmit: {
    //     fontSize: Configs.FontSize.size18,
    //     color: COLORS.GRAY
    // },
    iconFinger: {
        borderRadius: 20,
        marginLeft: 10,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    test: {
        height: 45,
        justifyContent: 'center'
    },
    input: {
        height: '100%',
        justifyContent: 'center'
    },
    wrapPin: {
        flex: 1
    },
    imageAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderColor: COLORS.WHITE,
        borderWidth: 5,
        alignSelf: 'center'
    }
});
const customStyles = StyleSheet.create({
    main: {
        marginTop: 20,
        paddingHorizontal: 20
        // justifyContent: 'center'
    },

    title: {
        fontSize: Configs.FontSize.size16,
        fontFamily: Configs.FontFamily.medium,
        color: COLORS.GREEN
    },
    subTitle: {
        color: COLORS.BLACK
    },
    buttonText: {
        color: COLORS.GREEN,
        fontSize: Configs.FontSize.size32,
        fontFamily: Configs.FontFamily.medium
    },
    buttons: {
        backgroundColor: COLORS.WHITE,
        borderWidth: 1.5,
        marginHorizontal: 15,
        borderColor: COLORS.GREEN,
        width: 65,
        height: 65,
        borderRadius: 35
    },
    pinContainer: {
        height: 30,
        justifyContent: 'center',
        marginBottom: 10
    }
});
