import { observer } from 'mobx-react';
import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Configs } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import ScreenNames from '@/commons/ScreenNames';
import { MyTextInput } from '@/components/elements/textfield/index';
import { TextFieldActions } from '@/components/elements/textfield/types';
import HeaderSignUp from '@/components/HeaderSignUp';
import { OtpModel } from '@/models/user-model';
import Navigator from '@/routers/Navigator';
import { COLORS, Styles } from '@/theme';
import Validate from '@/utils/Validate';

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

const OTPForgotPwd = observer(({ route }: { route: any }) => {

    const { phone } = route.params;

    const [values] = useState<OtpModel[]>(otp);
    const [disable] = useState<boolean>(true);

    const otp1Ref = useRef<TextFieldActions>();
    const otp2Ref = useRef<TextFieldActions>();
    const otp3Ref = useRef<TextFieldActions>();
    const otp4Ref = useRef<TextFieldActions>();
    const otp5Ref = useRef<TextFieldActions>();
    const otp6Ref = useRef<TextFieldActions>();

    const onPressOtp = useCallback(async () => {
        const OTP = values[0].otp1 + values[0].otp2 + values[0].otp3 + values[0].otp4 + values[0].otp5 + values[0].otp6;

        setTimeout(() => {
            Navigator.pushScreen(ScreenNames.updateNewPwd, {
                phone,
                OTP
            });
        }, 1000);
        values[0].otp1 = '';
        values[0].otp2 = '';
        values[0].otp3 = '';
        values[0].otp4 = '';
        values[0].otp5 = '';
        values[0].otp6 = '';
        
    }, [phone, values]);

    const textInputChange = useCallback((text: any, ref: any) => {
        const value = Validate.stringIsNumberOnly(text) && text.length === 1 ? text.trim() : '';
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

    const onChangeText = useCallback((value: string, tag?: string) => {

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
                if (values[0].otp6.length > 0)
                    onPressOtp();
                break;
            default:
                break;
        }
    }, [onPressOtp, textInputChange, values]);

    const renderInput = useCallback((ref: any, testId: string, value: string, onKeyPress?: any, disabled?: any) => {
        return <MyTextInput
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
        />;
    }, [onChangeText]);

    const backToSignUp = () => {
        Navigator.navigateScreen(ScreenNames.forgotPwd);
    };

    return (
        <View style={styles.container}>
            <HeaderSignUp onGoBack={backToSignUp} hasBack title={Languages.otp.keyOtp} />

            <View style={styles.containerBox}>
                <Text style={styles.confirmOtp}>{Languages.otp.confirmOtp}</Text>

                <View style={styles.boxOtp}>
                    {renderInput(otp1Ref, Languages.otp.otp1, values[0].otp1, onChangeInputOneKeyPress, disable)}
                    {renderInput(otp2Ref, Languages.otp.otp2, values[0].otp2, onChangeInputTwoKeyPress)}
                    {renderInput(otp3Ref, Languages.otp.otp3, values[0].otp3, onChangeInputThreeKeyPress)}
                    {renderInput(otp4Ref, Languages.otp.otp4, values[0].otp4, onChangeInputFourKeyPress)}
                    {renderInput(otp5Ref, Languages.otp.otp5, values[0].otp5, onChangeInputFiveKeyPress)}
                    {renderInput(otp6Ref, Languages.otp.otp6, values[0].otp6, onChangeInputSixKeyPress)}
                </View>
            </View>
        </View>
    );
});

export default OTPForgotPwd;
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
    }
});

