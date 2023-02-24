import { observer } from 'mobx-react';
import React, { useCallback, useRef, useState } from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import { ICONS } from '@/assets/icons/constant';
import Logo from '@/assets/images/log_phone_hand.svg';
import { Configs, isIOS } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import ScreenNames from '@/commons/ScreenNames';
import { Button } from '@/components';
import { MyTextInput } from '@/components/elements/textfield';
import { TextFieldActions } from '@/components/elements/textfield/types';
import HeaderSignUp from '@/components/HeaderSignUp';
import { useAppStore } from '@/hooks';
import Navigator from '@/routers/Navigator';
import { COLORS, Styles } from '@/theme';
import FormValidate from '@/utils/FormValidate';
import MyLoading from '@/components/MyLoading';

const ConfirmPhoneNumber = observer(({ route }: { route: any }) => {
    const { id } = route.params;
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [isLoading, setLoading] = useState<boolean>(false);
    const inputRef = useRef<TextFieldActions>(null);
    const { apiServices } = useAppStore();
    const onChangeText = useCallback((text: string) => {
        setPhoneNumber(text);
    }, []);
    const onClick = useCallback(async () => {
        const msgErrorPhone = FormValidate.passConFirmPhone(phoneNumber);
        inputRef?.current?.setErrorMsg(msgErrorPhone);
        if (!msgErrorPhone) {
            setLoading(true);
            const res = await apiServices?.auth?.confirmPhoneNumber(id, phoneNumber);
            if (res.success) {
                setLoading(false);
                Navigator.pushScreen(ScreenNames.otpSignUp, {
                    phone: phoneNumber,
                    data: null,
                    navigateFrom: ScreenNames.confirmPhoneNumber,
                    id: res?.data?.id_user
                });
            }
            setLoading(false);
        }
    }, [apiServices?.auth, id, phoneNumber]);

    return (
        <KeyboardAvoidingView
            behavior={isIOS ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.container}>
                <View style={styles.container}>
                    <HeaderSignUp onGoBack={() => Navigator.goBack()} hasBack title={Languages.confirmPhone.headerTitle} />
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.wrapLogo}>
                            <Logo />
                            <Text style={styles.title}>{Languages.confirmPhone.title}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <MyTextInput
                        leftIcon={ICONS.PHONE}
                        containerInput={styles.input}
                        keyboardType={'NUMBER'}
                        defaultValue={'76'}
                        ref={inputRef}
                        onChangeText={onChangeText}
                        value={phoneNumber}
                        maxLength={10}
                    />
                    <Button
                        style={styles.button}
                        label={Languages.common.continue}
                        textColor={COLORS.WHITE}
                        onPress={onClick}
                    />
                </View>
            </View>
            {isLoading && <MyLoading isOverview/>}
        </KeyboardAvoidingView>
    );
});

export default ConfirmPhoneNumber;
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    wrapLogo: {
        width: '100%',
        alignItems: 'center'
    },
    title: {
        ...Styles.typography.regular,
        marginTop: 10
    },
    input: {
        marginHorizontal: 16,
        borderColor: COLORS.GRAY_2,
        borderRadius: 40,
        marginTop: 20
    },
    button: {
        marginHorizontal: 16,
        backgroundColor: COLORS.GREEN,
        height: Configs.FontSize.size40,
        marginTop: 20
    }
});
