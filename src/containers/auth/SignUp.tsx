import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { ICONS } from '@/assets/icons/constant';
import Bg_logo from '@/assets/images/bg_logo_signin.png';
import { Configs, HEADER_PADDING, STATUSBAR_HEIGHT } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { ItemProps } from '@/components/BottomSheet';
import { BUTTON_STYLES } from '@/components/elements/button/constants';
import { Button } from '@/components/elements/button/index';
import { MyTextInput } from '@/components/elements/textfield/index';
import { TextFieldActions } from '@/components/elements/textfield/types';
import { HeaderSignUp } from '@/components/HeaderSignUp';
import ScrollViewWithKeyboard from '@/components/KeyboardAwareView';
import PickerValuation, { PickerAction } from '@/components/PickerValuation';
import { useAppStore } from '@/hooks';
import { ChannelModel } from '@/models/channel';
import Navigator from '@/routers/Navigator';
import { SCREEN_HEIGHT } from '@/utils/DimensionUtils';
import FormValidate from '@/utils/FormValidate';
import ScreenNames from '../../commons/ScreenNames';
import { COLORS, Styles } from '../../theme';
import MyLoading from '@/components/MyLoading';

const SignUp = observer(() => {

    const { apiServices } = useAppStore();
    const [isLoading, setLoading] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [card, setCard] = useState<string>('');
    const [pass, setPass] = useState<string>('');
    const [conFirmPass, setConFirmPass] = useState<string>('');
    const [keyRefer, setKeyRerFe] = useState<string>('');
    const [disable, setDisable] = useState<boolean>(false);
    const [channel, setChannel] = useState<ItemProps>();
    const [dataChannel, setDataChannel] = useState<ItemProps[]>();

    const userNameRef = useRef<TextFieldActions>(null);
    const phoneRef = useRef<TextFieldActions>(null);
    const emailRef = useRef<TextFieldActions>(null);
    const cardRef = useRef<TextFieldActions>(null);
    const pwdRef = useRef<TextFieldActions>(null);
    const pwdCfRef = useRef<TextFieldActions>(null);
    const keyReferRef = useRef<TextFieldActions>(null);
    const channelRef = useRef<PickerAction>(null);

    const _backToLogin = () => {
        Navigator.navigateScreen(ScreenNames.login);
    };

    const onStatusButtonSignUp = useCallback(() => {
        // if (username !== '' && phone !== '' && email !== '' && card !== '' && pass !== '' && conFirmPass !== '') {
        //     setDisable(true);
        // }
    }, []);

    const onValidation = useCallback(() => {
        const errMsgUsername = FormValidate.userNameValidate(username);
        const errMsgPhone = FormValidate.passConFirmPhone(phone);
        const errMsgEmail = FormValidate.emailValidate(email);
        const errMsgCard = FormValidate.cardValidate(card);
        const errMsgPwd = FormValidate.passValidate(pass);
        const errMsgConFirmPwd = FormValidate.passConFirmValidate(pass, conFirmPass);
        if (keyRefer) {
            const errMsgKeyRefer = FormValidate.passConFirmKeyRefer(keyRefer);
            keyReferRef.current?.setErrorMsg(errMsgKeyRefer);
            if (`${errMsgKeyRefer}`.length === 0) {
                return true;
            }
            return false;
        }

        userNameRef.current?.setErrorMsg(errMsgUsername);
        phoneRef.current?.setErrorMsg(errMsgPhone);
        emailRef.current?.setErrorMsg(errMsgEmail);
        cardRef.current?.setErrorMsg(errMsgCard);
        pwdRef.current?.setErrorMsg(errMsgPwd);
        pwdCfRef.current?.setErrorMsg(errMsgConFirmPwd);

        if (`${errMsgUsername}${errMsgEmail}${errMsgCard}${errMsgPwd}${errMsgConFirmPwd}${errMsgPhone}`.length === 0) {
            return true;
        }
        return false;
    }, [card, conFirmPass, email, keyRefer, pass, phone, username]);

    const onPressSignUp = useCallback(async () => {
        if (onValidation()) {
            setLoading(true);
            setDisable(!disable);
            const res = await apiServices.auth.registerAuth(phone, username, pass, conFirmPass, email, card, keyRefer, channel?.value);
            setLoading(false);
            if (res.success) {
                Navigator.pushScreen(ScreenNames.otpSignUp, {
                    phone,
                    data: res.data
                });
            }
        }

    }, [onValidation, disable, apiServices.auth, phone, username, pass, conFirmPass, email, card, keyRefer, channel?.value]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        const res = await apiServices.auth.getChanelSource();
        if (res.success) {
            setLoading(false);
            const data = res.data as ChannelModel[];
            const temp = [] as ItemProps[];
            data?.forEach((item: any) => {
                temp.push({
                    value: item?.name,
                    id: item.type
                });
            });
            setDataChannel(temp);
        }
        setLoading(false);
    }, [apiServices.auth]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const onChangeFormality = useCallback((item: any) => {
        setChannel(item);
    }, []);

    const onChangeText = useCallback((value: string, tag?: string) => {
        switch (tag) {
            case Languages.profileAuth.username:
                setUsername(value);
                onStatusButtonSignUp();
                break;
            case Languages.profileAuth.numberPhone:
                setPhone(value);
                onStatusButtonSignUp();
                break;
            case Languages.profileAuth.email:
                setEmail(value);
                onStatusButtonSignUp();
                break;
            case Languages.profileAuth.card:
                setCard(value);
                onStatusButtonSignUp();
                break;
            case Languages.profileAuth.enterPwd:
                setPass(value);
                onStatusButtonSignUp();
                break;
            case Languages.profileAuth.currentPass:
                setConFirmPass(value);
                onStatusButtonSignUp();
                break;
            case Languages.profileAuth.enterKeyRefer:
                setKeyRerFe(value);
                break;
            default:
                break;
        }
    }, [onStatusButtonSignUp]);

    const renderSection = useCallback((title: string, isRequired?: boolean) => {
        return <Text style={styles.label}>{title}
            {isRequired && <Text style={styles.startVal}> *</Text>}
        </Text>;
    }, []);

    return (
        <View style={styles.container}>
            <HeaderSignUp onGoBack={_backToLogin} hasBack title={Languages.signIn.title} />
            <Image source={Bg_logo} resizeMode="cover" style={styles.image} />

            <View style={styles.swapInput}>
                <ScrollViewWithKeyboard contentContainerStyle={styles.content}>
                    <View style={styles.formInput}>
                        {renderSection(Languages.profileAuth.username, true)}
                        <MyTextInput
                            ref={userNameRef}
                            value={username}
                            leftIcon={ICONS.USER}
                            placeHolder={Languages.profileAuth.username}
                            onChangeText={onChangeText}
                            maxLength={100}
                        />
                    </View>
                    <View style={styles.formInput}>
                        {renderSection(Languages.profileAuth.numberPhone, true)}
                        <MyTextInput
                            ref={phoneRef}
                            value={phone}
                            leftIcon={ICONS.PHONE}
                            placeHolder={Languages.profileAuth.numberPhone}
                            onChangeText={onChangeText}
                            maxLength={10}
                            keyboardType={'NUMERIC'}
                        />
                    </View>
                    <View style={styles.formInput}>
                        {renderSection(Languages.profileAuth.email, true)}
                        <MyTextInput
                            ref={emailRef}
                            value={email}
                            leftIcon={ICONS.MAIL}
                            placeHolder={Languages.profileAuth.email}
                            onChangeText={onChangeText}
                            maxLength={100}
                            keyboardType={'EMAIL'}
                        />
                    </View>
                    <View style={styles.formInput}>
                        {renderSection(Languages.profileAuth.card, true)}
                        <MyTextInput
                            ref={cardRef}
                            value={card}
                            leftIcon={ICONS.CARD}
                            placeHolder={Languages.profileAuth.card}
                            onChangeText={onChangeText}
                            keyboardType={'NUMERIC'}
                            maxLength={12}
                        />
                    </View>
                    <View style={styles.formInput}>
                        {renderSection(Languages.profileAuth.pass, true)}
                        <MyTextInput
                            ref={pwdRef}
                            value={pass}
                            isPassword
                            leftIcon={ICONS.LOCK}
                            placeHolder={Languages.profileAuth.enterPwd}
                            onChangeText={onChangeText}
                            maxLength={50}
                        />
                    </View>
                    <View style={styles.formInput}>
                        {renderSection(Languages.profileAuth.confirmPwd, true)}
                        <MyTextInput
                            ref={pwdCfRef}
                            isPassword
                            value={conFirmPass}
                            leftIcon={ICONS.LOCK}
                            placeHolder={Languages.profileAuth.currentPass}
                            onChangeText={onChangeText}
                            maxLength={50}
                        />
                    </View>
                    <PickerValuation
                        ref={channelRef}
                        containerStyle={styles.channelContainer}
                        leftIcon={ICONS.LOCATION}
                        label={Languages.profileAuth.about}
                        placeholder={Languages.profileAuth.knowChannel}
                        onPressItem={onChangeFormality}
                        value={channel?.value}
                        data={dataChannel}
                        optional
                    />

                    <View style={styles.formInput}>
                        {renderSection(Languages.profileAuth.keyRefer, false)}
                        <MyTextInput
                            ref={keyReferRef}
                            value={keyRefer}
                            leftIcon={ICONS.ARROWS}
                            placeHolder={Languages.profileAuth.enterKeyRefer}
                            onChangeText={onChangeText}
                            iconSize={Configs.FontSize.size11}
                            maxLength={12}
                        />
                    </View>
                </ScrollViewWithKeyboard>
                <Button
                    style={styles.buttonContainer}
                    onPress={onPressSignUp}
                    radius={5}
                    buttonStyle={BUTTON_STYLES.GREEN}
                    label={Languages.button.btnSignIn} />
            </View>
            {isLoading && <MyLoading isOverview />}
        </View>
    );
});

export default SignUp;
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    txt: {
        fontSize: Configs.FontSize.size18,
        color: COLORS.BLACK
    },
    image: {
        position: 'absolute',
        zIndex: -1
    },
    form: {
        height: SCREEN_HEIGHT - (HEADER_PADDING + STATUSBAR_HEIGHT)
    },
    swapInput: {
        flex: 1,
        paddingHorizontal: 15,
        paddingTop: 15
    },
    content: {
        flex: 0
    },
    formInput: {
        marginBottom: 15
    },
    startVal: {
        ...Styles.typography.regular,
        color: COLORS.RED
    },
    label: {
        ...Styles.typography.regular,
        marginBottom: 5
    },
    buttonContainer: {
        marginVertical: 20
    },
    channelContainer: {
        marginTop: 0,
        marginBottom: 15
    }
});
