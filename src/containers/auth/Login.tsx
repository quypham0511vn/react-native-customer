import { observer } from 'mobx-react';
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import { ICONS } from '@/assets/icons/constant';
import AppleIcon from '@/assets/images/ic_apple.svg';
import CheckIcon from '@/assets/images/ic_check.svg';
import CloseIcon from '@/assets/images/ic_close.svg';
import FacebookIcon from '@/assets/images/ic_facebook.svg';
import GoogleIcon from '@/assets/images/ic_google.svg';
import UnCheckIcon from '@/assets/images/ic_uncheck.svg';
import {
    Configs,
    isIOS,
    PADDING_BOTTOM,
    PADDING_TOP,
    STATUSBAR_HEIGHT
} from '@/commons/Configs';
import { ENUM_PROVIDER } from '@/commons/constants';
import Languages from '@/commons/Languages';
import ScreenNames, { TabNames, TabNamesArray } from '@/commons/ScreenNames';
import { Touchable } from '@/components';
import { MyTextInput } from '@/components/elements/textfield';
import { TextFieldActions } from '@/components/elements/textfield/types';
import { useAppStore } from '@/hooks';
import SessionManager from '@/managers/SessionManager';
import { LoginWithThirdPartyModel } from '@/models/auth';
import Navigator from '@/routers/Navigator';
import { COLORS, Styles } from '@/theme';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import FormValidate from '@/utils/FormValidate';
import {
    loginWithApple,
    loginWithFacebook,
    loginWithGoogle
} from '@/utils/SocialAuth';
import FooterItem from '@/components/FooterItem';
import { UserInfoModel } from '@/models/user-model';
import MyLoading from '@/components/MyLoading';
import ScrollViewWithKeyboard from '@/components/KeyboardAwareView';

const pathLogo = require('@/assets/images/img_logo.png');

const Login = observer(({ route }: any) => {
    const {
        apiServices,
        userManager,
        fastAuthInfoManager: fastAuthInfo,
        appManager
    } = useAppStore();
    const [phone, setPhone] = useState<any>('');
    const [pass, setPass] = useState<any>('');

    const refPhone = useRef<TextFieldActions>(null);
    const refPass = useRef<TextFieldActions>(null);

    const isFocus = useIsFocused();

    const [checked, setCheck] = useState<boolean>(false);
    const [isLoading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (SessionManager.getPhoneLogin()) {
            setPhone(SessionManager.getPhoneLogin());
            setCheck(true);
        }
        if (SessionManager.getPwdLogin()) {
            setPass(SessionManager.getPwdLogin());
            setCheck(true);
        }
    }, []);

    useEffect(() => {
        if (isFocus) {
            setPhone(SessionManager.getPhoneLogin());
            setCheck(true);
            setPass('');
        }
    }, [isFocus]);

    const renderItem = useCallback((icon: any, _onPress: any, color: string) => {
        return (
            <Touchable
                radius={25}
                style={[styles.circle, { backgroundColor: color || COLORS.WHITE }]}
                onPress={_onPress}
            >
                {icon}
            </Touchable>
        );
    }, []);

    const onChangeChecked = useCallback(() => {
        setCheck(last => !last);

    }, []);

    const checkbox = useMemo(() => {
        if (checked) {
            return <CheckIcon width={20} height={20} />;
        }
        return <UnCheckIcon width={20} height={20} />;
    }, [checked]);

    const onChangeText = useCallback((value: string, tag?: string) => {
        switch (tag) {
            case Languages.login.phoneNumber:
                setPhone(value);
                break;
            case Languages.login.password:
                setPass(value);
                break;
            default:
                break;
        }
    }, []);

    const onLoginPhone = useCallback(async () => {
        const errMsgPhone = FormValidate.passConFirmPhone(phone);
        const errMsgPwd = FormValidate.passValidate(pass);

        refPhone.current?.setErrorMsg(errMsgPhone);
        refPass.current?.setErrorMsg(errMsgPwd);

        if (`${errMsgPwd}${errMsgPhone}`.length === 0) {
            setLoading(true);
            const res = await apiServices.auth.loginPhone(phone, pass);
            setLoading(false);
            if (res.success) {
                if (!checked) {
                    SessionManager.setSavePhoneLogin('');
                } else {
                    SessionManager.setSavePhoneLogin(phone);
                }
                userManager.updateUserInfo(res.data as UserInfoModel);
                fastAuthInfo.setEnableFastAuthentication(false);
                setTimeout(() => {
                    if (SessionManager.lastTabIndexBeforeOpenAuthTab) {
                        Navigator.navigateToDeepScreen(
                            [ScreenNames.tabs],
                            TabNamesArray[SessionManager.lastTabIndexBeforeOpenAuthTab]
                        );
                    }
                }, 100);
            }
        }
    }, [apiServices.auth, checked, fastAuthInfo, pass, phone, userManager]);

    const initUser = useCallback(
        async (typeLogin: string, providerId: string) => {
            setLoading(true);
            const res = await apiServices?.auth?.loginWithThirdParty(
                typeLogin,
                providerId
            );
            setLoading(false);
            if (res.success) {
                const data = res.data as LoginWithThirdPartyModel;
                if (data?.token_app) {
                    userManager.updateUserInfo(res.data as UserInfoModel);
                    fastAuthInfo.setEnableFastAuthentication(false);
                    setTimeout(() => {
                        if (SessionManager.lastTabIndexBeforeOpenAuthTab) {
                            Navigator.navigateToDeepScreen(
                                [ScreenNames.tabs],
                                TabNamesArray[SessionManager.lastTabIndexBeforeOpenAuthTab]
                            );
                        }
                    }, 100);
                }
                if (!data?.token_app) {
                    Navigator.pushScreen
                    (ScreenNames.confirmPhoneNumber, {
                        id: data?.id
                    });
                }
            }
        }, [apiServices?.auth, fastAuthInfo, userManager]);

    const onLoginGoogle = useCallback(async () => {
        const userInfo = await loginWithGoogle();
        if (userInfo) initUser(ENUM_PROVIDER.GOOGLE, userInfo?.user?.id);
    }, [initUser]);

    const onLoginFacebook = useCallback(async () => {
        const data = await loginWithFacebook();
        if (data?.userID)
            initUser(ENUM_PROVIDER.FACEBOOK, data?.userID);
    }, [initUser]);

    const onLoginApple = useCallback(async () => {
        const data = await loginWithApple();
        if (data?.user) initUser(ENUM_PROVIDER.APPLE, data?.user);
    }, [initUser]);

    const goBack = useCallback(() => {
        Navigator.navigateToDeepScreen([ScreenNames.tabs], TabNames.homeTab);
    }, []);

    const _onSignIn = () => {
        Navigator.navigateScreen(ScreenNames.signUp);
    };

    const onNavigateForgotPwd = () => {
        Navigator.navigateScreen(ScreenNames.updateNewPwd);
    };

    const renderLoginApple = useMemo(() => {
        if (isIOS) {
            return (
                <Touchable radius={25} style={styles.circle} onPress={onLoginApple}>
                    <AppleIcon width={25} height={25} />
                </Touchable>
            );
        }
        return null;
    }, [onLoginApple]);

    const renderBottom = useMemo(() => {
        return !appManager.isAppInReview && <>
            <View style={styles.wrapLine}>
                <View style={styles.line} />
                <Text style={styles.txtOr}>{Languages.common.or}</Text>
                <View style={styles.line} />
            </View>
            <View style={styles.wrapIcon}>
                {renderItem(
                    <FacebookIcon width={25} height={25} />,
                    onLoginFacebook,
                    COLORS.WHITE
                )}
                {renderItem(
                    <GoogleIcon width={25} height={25} />,
                    onLoginGoogle,
                    COLORS.WHITE
                )}
                {renderLoginApple}
            </View>
        </>;
    }, [appManager.isAppInReview, onLoginFacebook, onLoginGoogle, renderItem, renderLoginApple]);

    return (
        <ScrollViewWithKeyboard>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Touchable style={styles.hisLop} onPress={goBack}>
                        <CloseIcon width={20} height={20} />
                    </Touchable>
                </View>
                <View style={styles.wrapContent}>
                    <View style={styles.wrapLogo}>
                        <Image style={styles.logo} source={pathLogo} />
                    </View>
                    <View style={styles.wrapAll}>
                        <View style={styles.content}>
                            <MyTextInput
                                ref={refPhone}
                                value={phone}
                                leftIcon={ICONS.PROFILE}
                                placeHolder={Languages.login.phoneNumber}
                                containerInput={styles.inputPhone}
                                onChangeText={onChangeText}
                                keyboardType={'NUMBER'}
                                maxLength={10}
                            />
                            <MyTextInput
                                ref={refPass}
                                value={pass}
                                leftIcon={ICONS.LOCK}
                                placeHolder={Languages.login.password}
                                containerInput={styles.inputPass}
                                onChangeText={onChangeText}
                                isPassword
                                maxLength={50}
                            />
                            <View style={styles.rowInfo}>
                                <View style={styles.row}>
                                    <Touchable style={styles.checkbox} onPress={onChangeChecked}>
                                        {checkbox}
                                    </Touchable>
                                    <Text style={styles.txtSave}>{Languages.login.saveInfo}</Text>
                                </View>
                                <Touchable onPress={onNavigateForgotPwd}>
                                    <Text style={styles.txtForgot}>
                                        {Languages.login.forgotPwd}
                                    </Text>
                                </Touchable>
                            </View>
                            <Touchable style={styles.button} onPress={onLoginPhone}>
                                <Text style={styles.txtLogin}>
                                    {Languages.authentication.login.toLocaleUpperCase()}
                                </Text>
                            </Touchable>
                        </View>

                        <View style={styles.bottom}>
                            <View style={styles.wrapText}>
                                <Text style={styles.txtHaveAccount}>
                                    {Languages.login.haveAccount}{' '}
                                </Text>
                                <Touchable onPress={_onSignIn}>
                                    <Text style={styles.txtRegisterNow}>
                                        {Languages.login.registerNow}
                                    </Text>
                                </Touchable>
                            </View>

                            {renderBottom}
                        </View>
                        <FooterItem />
                    </View>
                </View>
                {isLoading && <MyLoading isOverview />}
            </View>
        </ScrollViewWithKeyboard>
    );
});

export default Login;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.WHITE
    },
    header: {
        width: SCREEN_WIDTH,
        paddingHorizontal: 16,
        alignItems: 'flex-end',
        marginTop: STATUSBAR_HEIGHT + PADDING_TOP
    },
    wrapContent: {
        paddingHorizontal: 16,
        flex: 1
    },
    wrapLogo: {
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    logo: {
        width: 200,
        height: 80,
        resizeMode: 'contain'
    },
    inputPhone: {
        borderRadius: 30,
        height: Configs.FontSize.size50,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    inputPass: {
        marginTop: 20,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        height: Configs.FontSize.size50
    },
    rowInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        alignItems: 'flex-end',
        marginHorizontal: 4
    },
    wrapIcon: {
        flexDirection: 'row',
        marginTop: 20,
        marginBottom: Configs.IconSize.size30,
        justifyContent: 'center'
    },
    txtForgot: {
        fontFamily: Configs.FontFamily.medium,
        color: COLORS.GREEN,
        fontSize: Configs.FontSize.size12
    },
    txtSave: {
        fontFamily: Configs.FontFamily.medium,
        color: COLORS.BLACK,
        fontSize: Configs.FontSize.size12,
        marginLeft: 5
    },
    txtRegisterNow: {
        fontFamily: Configs.FontFamily.medium,
        color: COLORS.GREEN,
        fontSize: Configs.FontSize.size14
    },
    txtHaveAccount: {
        fontFamily: Configs.FontFamily.medium,
        color: COLORS.BLACK,
        fontSize: Configs.FontSize.size14,
        marginLeft: 5
    },
    button: {
        backgroundColor: COLORS.GREEN,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        paddingVertical: 15
    },
    txtLogin: {
        color: COLORS.WHITE,
        fontSize: Configs.FontSize.size14,
        fontFamily: Configs.FontFamily.medium
    },
    wrapText: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 14
    },
    wrapLine: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30
    },
    line: {
        width: (SCREEN_WIDTH - 32 - 80) / 2,
        height: 0.5,
        backgroundColor: COLORS.DARK_GRAY
    },
    txtOr: {
        width: 70,
        textAlign: 'center',
        fontSize: Configs.FontSize.size14,
        fontFamily: Configs.FontFamily.medium,
        color: COLORS.GRAY_1
    },
    buttonFB: {
        backgroundColor: COLORS.BLUE,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        paddingVertical: 15
    },
    buttonGoogle: {
        backgroundColor: COLORS.WHITE,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        paddingVertical: 15
    },
    icon: {
        marginLeft: 10
    },
    wrapAll: {
        flex: 1,
        paddingBottom: PADDING_BOTTOM
    },
    checkbox: {
        justifyContent: 'flex-end'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    inputStyle: {},
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
        marginHorizontal: 5
        // marginLeft: 15
    },
    bottom: {
        justifyContent: 'flex-start',
        flex: 1
    },
    content: {
        flex: 1.5,
        justifyContent: 'center'
    },
    hisLop: {
        paddingVertical: 10,
        paddingLeft: 10
    }
});
