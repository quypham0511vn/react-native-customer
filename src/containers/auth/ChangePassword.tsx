import { observer } from 'mobx-react';
import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Configs } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { HeaderBar } from '@/components';
import { BUTTON_STYLES } from '@/components/elements/button/constants';
import { Button } from '@/components/elements/button/index';
import { MyTextInput } from '@/components/elements/textfield/index';
import { TextFieldActions } from '@/components/elements/textfield/types';
import ScrollViewWithKeyboard from '@/components/KeyboardAwareView';
import MyLoading from '@/components/MyLoading';
import { useAppStore } from '@/hooks';
import SessionManager from '@/managers/SessionManager';
import FormValidate from '@/utils/FormValidate';
import ToastUtils from '@/utils/ToastUtils';
import { COLORS, Styles } from '../../theme';

const ChangePassword = observer(() => {

    const { apiServices, userManager } = useAppStore();

    const [oldPwd, setOldPwd] = useState<string>('');
    const [newPwd, setNewPwd] = useState<string>('');
    const [rePwd, setRePwd] = useState<string>('');
    const [visibleOldPass, setVisibleOldPass] = useState<boolean>(!userManager.userInfo?.password);

    const oldPwdRef = useRef<TextFieldActions>(null);
    const newPwdRef = useRef<TextFieldActions>(null);
    const rePwdRef = useRef<TextFieldActions>(null);

    const [isLoading, setLoading] = useState<boolean>(false);

    const renderInput = useCallback((_ref: any, _title: any, _placeHolder: any, _value: string, onChangeText: any, visible?: boolean) => {
        if (!visible) {
            return <View style={styles.groupInput}>
                <Text style={styles.title}>{_title}</Text>
                <MyTextInput
                    value={_value}
                    placeHolder={_placeHolder}
                    containerInput={styles.input}
                    ref={_ref}
                    onChangeText={onChangeText}
                    isPassword
                    maxLength={50}
                />
            </View>;
        }
        return null;
    }, []);

    const onChangeText = useCallback((value: string, tag?: string) => {
        switch (tag) {
            case Languages.changePwd.placeOldPass:
                setOldPwd(value);
                break;
            case Languages.changePwd.placeNewPass:
                setNewPwd(value);
                break;
            case Languages.changePwd.currentNewPass:
                setRePwd(value);
                break;
            default:
                break;
        }
    }, []);

    const onValidation = useCallback(() => {
        let errMsgOldPwd = '';
        if (!visibleOldPass) {
            errMsgOldPwd = FormValidate.passValidate(oldPwd);
        }
        const errMsgNewPwd = FormValidate.passValidate(newPwd);
        const errMsgRePwd = FormValidate.passConFirmValidate(newPwd, rePwd);

        oldPwdRef.current?.setErrorMsg(errMsgOldPwd);
        newPwdRef.current?.setErrorMsg(errMsgNewPwd);
        rePwdRef.current?.setErrorMsg(errMsgRePwd);

        if (`${errMsgNewPwd}${errMsgRePwd}${errMsgOldPwd}`.length === 0) {
            return true;
        }
        return false;
    }, [newPwd, oldPwd, rePwd, visibleOldPass]);

    const logOut = useCallback(() => {
        SessionManager.logout();
        userManager.updateUserInfo(null);
    }, [userManager]);

    const changePwd = useCallback(async () => {
        if (onValidation()) {
            setLoading(true);
            const res = await apiServices.auth.changePwdAuth(oldPwd, newPwd, rePwd);
            setLoading(false);
            if (res.success) {
                ToastUtils.showSuccessToast(Languages.changePwd.toastSuccess);
                logOut();
            }
        }
    }, [apiServices.auth, logOut, newPwd, oldPwd, onValidation, rePwd]);

    return (
        <View style={styles.container}>
            <HeaderBar
                title={visibleOldPass ? Languages.changePwd.updatePass : Languages.changePwd.title} />
            <ScrollViewWithKeyboard>
                <View style={styles.group}>
                    {renderInput(oldPwdRef, Languages.changePwd.oldPass, Languages.changePwd.placeOldPass, oldPwd, onChangeText, visibleOldPass)}
                    {renderInput(newPwdRef, Languages.changePwd.newPass, Languages.changePwd.placeNewPass, newPwd, onChangeText)}
                    {renderInput(rePwdRef, Languages.changePwd.currentNewPass, Languages.changePwd.currentNewPass, rePwd, onChangeText)}
                </View>
            </ScrollViewWithKeyboard>
            <View style={styles.button}>
                <Button radius={25} onPress={changePwd} label={visibleOldPass ? Languages.changePwd.updatePass : Languages.changePwd.title} buttonStyle={BUTTON_STYLES.GREEN} />
            </View>

            {isLoading && <MyLoading isOverview />}
        </View>
    );
});

export default ChangePassword;
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    group: {
        paddingTop: 20,
        paddingRight: 15,
        paddingLeft: 15
    },
    groupInput: {
        marginBottom: 20
    },
    title: {
        ...Styles.typography.medium,
        marginBottom: 5,
        marginLeft: 15
    },
    button: {
        position: 'absolute',
        width: '100%',
        paddingLeft: 15,
        paddingRight: 15,
        left: 0,
        right: 0,
        bottom: 20
    },
    input: {
        borderColor: COLORS.GRAY_2,
        height: Configs.FontSize.size45,
        fontSize: Configs.FontSize.size14,
        borderRadius: 50
    }
});

