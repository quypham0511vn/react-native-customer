import { observer } from 'mobx-react';
import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Configs, HEADER_PADDING, PADDING_BOTTOM } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { HeaderBar, Touchable } from '@/components';
import { BUTTON_STYLES } from '@/components/elements/button/constants';
import { Button } from '@/components/elements/button/index';
import { MyTextInput } from '@/components/elements/textfield/index';
import { TextFieldActions, TypeKeyBoard } from '@/components/elements/textfield/types';
import { MyImageView } from '@/components/image';
import ScrollViewWithKeyboard from '@/components/KeyboardAwareView';
import MyDatePicker, { MyDatePickerActions } from '@/components/MyDatePicker';
import MyLoading from '@/components/MyLoading';
import { PopupActions } from '@/components/popup/types';
import PopupUploadImage from '@/components/PopupUploadImage';
import { useAppStore } from '@/hooks';
import SessionManager from '@/managers/SessionManager';
import { UserInfoModel } from '@/models/user-model';
import Navigator from '@/routers/Navigator';
import FormValidate from '@/utils/FormValidate';
import { COLORS, Styles } from '../../theme';

const EditProfile = observer(() => {

    const { apiServices, userManager } = useAppStore();
    const [userInfo] = useState<UserInfoModel | undefined>(userManager.userInfo);

    const [imageAvatar, setImageAvatar] = useState<any>();
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [card, setCard] = useState<string>('');
    const [birthDate, setBirthDate] = useState<string>(userInfo?.birth_date || '');

    const userNameRef = useRef<TextFieldActions>(null);
    const emailRef = useRef<TextFieldActions>(null);
    const cardRef = useRef<TextFieldActions>(null);
    const birthDateRef = useRef<MyDatePickerActions>(null);

    const popupUploadImageRef = useRef<PopupActions>(null);

    const [isLoading, setLoading] = useState<boolean>(false);

    const renderInput = useCallback((_title: any, _placeHolder: any, _value: any,
        _ref: any, onChangeText: any, maxLength?: number, keyboardType?: keyof typeof TypeKeyBoard) => {
        return <View style={styles.groupInput}>
            <Text style={styles.title}>{_title}</Text>
            <MyTextInput
                ref={_ref}
                value={_value}
                placeHolder={_placeHolder}
                containerInput={styles.input}
                onChangeText={onChangeText}
                maxLength={maxLength || 50}
                keyboardType={keyboardType || 'DEFAULT'}
            />
        </View>;
    }, []);

    const onChangeText = useCallback((value: string, tag?: string) => {
        switch (tag) {
            case Languages.editProFile.placename:
                setUsername(value);
                break;
            case Languages.editProFile.placeEmail:
                setEmail(value);
                break;
            case Languages.editProFile.placeBirthDate:
                setBirthDate(value);
                break;
            case Languages.editProFile.placeCard:
                setCard(value);
                break;
            default:
                break;
        }
    }, []);

    const onValidation = useCallback(() => {
        const errMsgUsername = username ? FormValidate.userNameValidate(username) : '';
        const errMsgEmail = email ? FormValidate.emailValidate(email) : '';
        const errMsgCard = card ? FormValidate.cardValidate(card) : '';
        const errMsgBirthDate = birthDate ? FormValidate.birthdayValidator(birthDate) : '';

        userNameRef.current?.setErrorMsg(errMsgUsername);
        emailRef.current?.setErrorMsg(errMsgEmail);
        cardRef.current?.setErrorMsg(errMsgCard);
        birthDateRef.current?.setError?.(errMsgBirthDate);

        console.log(birthDate);

        if (`${errMsgUsername}${errMsgEmail}${errMsgCard}${errMsgBirthDate}`.length === 0) {
            return true;
        }
        return false;
    }, [birthDate, card, email, username]);

    const onPressEdit = useCallback(async () => {
        if (onValidation()) {
            // upload avatar
            let avatar = SessionManager.userInfo?.avatar as string;
            if (imageAvatar) {
                const resUpload = await apiServices.imageServices.uploadImage(imageAvatar);
                console.log('d', JSON.stringify(resUpload));
                if (resUpload.success && resUpload.data?.path) {
                    avatar = resUpload.data?.path;
                }
            }

            setLoading(true);
            const res = await apiServices.auth.updateUserInf(card, username, birthDate, email, avatar);
            if (res.success) {
                const infoRes = await apiServices.auth.getUserInfo();
                setLoading(false);

                const data = infoRes.data as UserInfoModel;

                userManager.updateUserInfo({
                    ...userManager.userInfo as UserInfoModel,
                    avatar,
                    full_name: data.full_name,
                    indentify: data.indentify,
                    identify: data.identify,
                    email: data.email,
                    birth_date: data.birth_date
                });
                Navigator.goBack();
            } else {
                setLoading(false);
            }
        }
    }, [onValidation, imageAvatar, apiServices.auth, apiServices.imageServices, card, username, birthDate, email, userManager]);

    const openLibrary = useCallback(() => {
        popupUploadImageRef.current?.show();
    }, []);

    const onImageSelected = useCallback((data: any) => {
        setImageAvatar(data?.images[0]?.path);
    }, []);

    const onConfirmValue = (date: string) => {
        setBirthDate(date);
    };

    return (
        <View style={styles.container}>
            <HeaderBar
                title={Languages.editProFile.title} />
            <ScrollViewWithKeyboard>

                <View style={styles.image}>
                    <Touchable radius={100} onPress={openLibrary}>
                        <MyImageView
                            style={styles.imageAvatar}
                            imageUrl={imageAvatar || userInfo?.avatar} />
                    </Touchable>
                </View>

                <View style={styles.group}>
                    {renderInput(Languages.profileAuth.username, Languages.editProFile.placename, userInfo?.full_name, userNameRef, onChangeText)}
                    {renderInput(Languages.profileAuth.email, Languages.editProFile.placeEmail, userInfo?.email, emailRef, onChangeText, 50, 'EMAIL')}
                    {renderInput(Languages.profileAuth.card, Languages.editProFile.placeCard, userInfo?.indentify || userInfo?.identify, cardRef, onChangeText, 12, 'NUMBER')}

                    <MyDatePicker
                        ref={birthDateRef}
                        title={Languages.profileAuth.birthDate}
                        onConfirmDatePicker={onConfirmValue}
                        dateString={userInfo?.birth_date}
                        maximumDate={new Date()}
                        date={new Date()} />
                </View>
            </ScrollViewWithKeyboard>
            <View style={styles.button}>
                <Button radius={25} label={Languages.button.btnEditProfile} onPress={onPressEdit} buttonStyle={BUTTON_STYLES.GREEN} />
            </View>
            <PopupUploadImage
                ref={popupUploadImageRef}
                onImageSelected={onImageSelected}
                maxSelect={1}
            />

            {isLoading && <MyLoading isOverview />}
        </View>
    );
});

export default EditProfile;

const AVATAR_SIZE = 100;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between'
    },
    image: {
        paddingTop: HEADER_PADDING,
        alignItems: 'center'
    },
    imageAvatar: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        borderColor: COLORS.GRAY_5,
        borderWidth: 1
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
    content: {
        ...Styles.typography.regular,
        color: COLORS.BLACK,
        marginLeft: 10
    },
    button: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: PADDING_BOTTOM + 10
    },
    input: {
        borderColor: COLORS.GRAY_2,
        height: Configs.FontSize.size45,
        fontSize: Configs.FontSize.size14,
        borderRadius: 50
    }
});

