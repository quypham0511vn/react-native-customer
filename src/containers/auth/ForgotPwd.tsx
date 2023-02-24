import { observer } from 'mobx-react';
import React, {
    useCallback, useRef,
    useState
} from 'react';
import {
    StyleSheet,
    Text, View
} from 'react-native';

import { ICONS } from '@/assets/icons/constant';
import { Configs, PADDING_BOTTOM } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import ScreenNames from '@/commons/ScreenNames';
import { Button } from '@/components';
import { BUTTON_STYLES } from '@/components/elements/button/constants';
import { MyTextInput } from '@/components/elements/textfield';
import { TextFieldActions } from '@/components/elements/textfield/types';
import FooterItem from '@/components/FooterItem';
import HeaderLogo from '@/components/HeaderLogo';
import { MyImageView } from '@/components/image';
import MyLoading from '@/components/MyLoading';
import { useAppStore } from '@/hooks';
import { UserInfoModel } from '@/models/user-model';
import Navigator from '@/routers/Navigator';
import { COLORS, Styles } from '@/theme';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import FormValidate from '@/utils/FormValidate';
import ScrollViewWithKeyboard from '@/components/KeyboardAwareView';

const ForgotPwd = observer(() => {

    const [phone, setPhone] = useState<any>();
    const [isLoading, setLoading] = useState<boolean>(false);
    const { apiServices, userManager } = useAppStore();
    const [userInfo] = useState<UserInfoModel | undefined>(userManager.userInfo);
    const refPass = useRef<TextFieldActions>(null);
    const [disable, setDisable] = useState<boolean>(false);

    const onChangeText = useCallback((text: string) => {
        setPhone(text);
        if (phone !== '') {
            setDisable(true);
        } else {
            setDisable(false);
        }
    }, [phone]);

    const onSendOtp = useCallback(async () => {
        const errMsgPwd = FormValidate.passConFirmPhone(phone);
        refPass.current?.setErrorMsg(errMsgPwd);
        if (`${errMsgPwd}`.length === 0) {
            setLoading(true);
            const res = await apiServices.auth.otpResetPwd(phone);
            if (res.success) {
                setLoading(false);
                setTimeout(() => {
                    Navigator.pushScreen(ScreenNames.otpForgotPwd, {
                        phone
                    });
                }, 300);
            }
            setLoading(false);
        }
    }, [apiServices.auth, phone]);

    const onLoginNow = useCallback(async () => {
        Navigator.navigateScreen(ScreenNames.login);
    }, []);

    return (
        <ScrollViewWithKeyboard>
            <View style={styles.container}>
                <HeaderLogo />
                <View style={styles.wrapContent}>
                    <View style={styles.wrapAvatar}>
                        <MyImageView
                            style={styles.imageAvatar}
                            imageUrl={userInfo?.avatar} />
                    </View>
                    <View style={styles.wrapInput}>
                        <Text style={styles.textScreen}>
                            {Languages.forgotPwd.enterPhone}
                        </Text>
                        <Text style={styles.description}>
                            {Languages.forgotPwd.descriptionEnterPhone}
                        </Text>
                        <Text style={styles.textPass}>
                            {Languages.login.phoneNumber}
                        </Text>
                        <View style={styles.test}>
                            <MyTextInput
                                ref={refPass}
                                placeHolder={Languages.login.phoneNumber}
                                leftIcon={ICONS.USER}
                                value={phone}
                                onChangeText={onChangeText}
                                inputStyle={styles.input}
                                keyboardType='NUMBER'
                            />
                        </View>
                    </View>

                    <View style={styles.wrapBt}>
                        <Button onPress={onSendOtp}
                            fontSize={Configs.FontSize.size14}
                            style={styles.button}
                            label={Languages.forgotPwd.btnOtp}
                            buttonStyle={!disable ? BUTTON_STYLES.WHITE : BUTTON_STYLES.GREEN} />
                    </View>

                    <Text style={styles.loginNow}>
                        {Languages.forgotPwd.haveAccount}
                        <Text style={styles.textLogin} onPress={onLoginNow}> {Languages.forgotPwd.loginNow}</Text>
                    </Text>
                </View>
                <FooterItem />
                {isLoading && <MyLoading isOverview />}
            </View>
        </ScrollViewWithKeyboard>
    );
});

export default ForgotPwd;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: PADDING_BOTTOM
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
    wrapText: {
        alignSelf: 'center',
        flexDirection: 'row',
        marginTop: 70
    },
    wrapIcon: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
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
        marginTop: Configs.IconSize.size100
    },
    textPass: {
        ...Styles.typography.medium,
        color: COLORS.GRAY_7,
        marginBottom: 15
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
        width: 80,
        textAlign: 'center',
        fontSize: Configs.FontSize.size14,
        fontFamily: Configs.FontFamily.medium,
        color: COLORS.GRAY_12
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
    wrapAll: {
        flex: 1
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
        marginHorizontal: 8,
        textAlign: 'center'
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
        marginBottom: 20
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
