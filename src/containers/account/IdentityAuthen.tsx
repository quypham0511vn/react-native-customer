import { useIsFocused } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import HTMLView from 'react-native-htmlview';

import IcAvatarKyc from '@/assets/images/ic_avatar_kyc.svg';
import IcBehindCard from '@/assets/images/ic_behind_card.svg';
import IcFrontCard from '@/assets/images/ic_front_card.svg';
import IcReChoose from '@/assets/images/ic_re_choose_img.svg';
import { Configs } from '@/commons/Configs';
import { noteAvatar, noteKYC, STATE_AUTH_ACC } from '@/commons/constants';
import Languages from '@/commons/Languages';
import { Button, HeaderBar, Touchable } from '@/components';
import { MyImageView } from '@/components/image';
import MyLoading from '@/components/MyLoading';
import { PopupActions } from '@/components/popup/types';
import PopupUploadImage from '@/components/PopupUploadImage';
import { useAppStore } from '@/hooks';
import { ImageFile } from '@/models/image-file';
import { UserInfoModel } from '@/models/user-model';
import { COLORS, HtmlStylesSeen, Styles } from '@/theme';
import ToastUtils from '@/utils/ToastUtils';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/utils/DimensionUtils';

const IdentityAuthen = observer(() => {
    const { userManager, apiServices } = useAppStore();
    const isFocused = useIsFocused();

    const [imageAvatar, setImageAvatar] = useState<any>();
    const [imageFrontCard, setImageFrontCard] = useState<any>();
    const [imageBehindCard, setImageBehindCard] = useState<any>();
    const [isLoading, setLoading] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);


    const popupAvatarImageRef = useRef<PopupActions>(null);
    const popupFrontCardImageRef = useRef<PopupActions>(null);
    const popupBehindCardImageRef = useRef<PopupActions>(null);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        const resUser = await apiServices.auth.getUserInfo();
        setRefreshing(false);
        if (resUser.success) {
            const dataUser = resUser.data as UserInfoModel;
            userManager.updateUserInfo({
                ...userManager.userInfo,
                ...dataUser,
                portrait: dataUser?.portrait,
                front_facing_card: dataUser?.front_facing_card,
                card_back: dataUser?.card_back
            });
            setImageAvatar(undefined);
            setImageFrontCard(undefined);
            setImageBehindCard(undefined);
        }
    }, [apiServices.auth, userManager]);

    const renderTopNotification = useMemo(() => {
        return (
            <>
                {userManager.userInfo?.auth === STATE_AUTH_ACC.RE_VERIFIED &&
                    <Text style={styles.textErrorEKyc}>
                        {Languages.errorMsg.failEkyc}
                    </Text>}
                {userManager.userInfo?.auth === STATE_AUTH_ACC.WAIT &&
                    <Text style={styles.textLoadingEKyc}>
                        {Languages.errorMsg.loadingEkyc}
                    </Text>}
            </>
        );
    }, [userManager.userInfo?.auth]);

    const renderNoteTypePhoto = useCallback((_title: string, _note1: string, _note2: string) => {
        return (
            <View style={styles.noteTypePhotoContainer}>
                <Text style={styles.textTitleNotePhoto}>
                    {_title}
                </Text>
                {(!userManager.userInfo?.portrait && !userManager.userInfo?.front_facing_card && !userManager.userInfo?.card_back) &&
                    <>
                        <Text style={styles.textDescribeNotePhoto}>
                            {_note1}
                        </Text>
                        <Text style={styles.textDescribeNotePhoto}>
                            {_note2}
                        </Text>
                    </>
                }
            </View>
        );
    }, [userManager.userInfo?.card_back, userManager.userInfo?.front_facing_card, userManager.userInfo?.portrait]);

    const renderStorePhoto = useCallback((_title: string, _icon: any, _isAvatarImg: boolean, _onPress: any, _imgCache?: any, _imgUploaded?: string, _disableText?: boolean) => {
        return (
            <View style={!_isAvatarImg && styles.typePhotoContainer}>
                <View style={styles.titleTypePhotoWrap}>
                    {!_disableText && <Text style={styles.textTitleTypePhoto}>
                        {_title}
                    </Text>}
                    {_imgCache && <Touchable onPress={_onPress} style={styles.iconReChooseWrap}>
                        <IcReChoose />
                    </Touchable>}
                </View>

                <View style={styles.imgWrap} >
                    {_imgCache || _imgUploaded ?
                        <MyImageView
                            style={_isAvatarImg ? styles.imageAvatar : styles.imageCard}
                            imageUrl={_imgCache || _imgUploaded}
                            underlayColor={COLORS.TRANSPARENT}
                        />
                        :
                        <Touchable onPress={_onPress}>
                            {_icon}
                        </Touchable>
                    }
                </View>
            </View>
        );
    }, []);

    const openPopupAvatarCapture = useCallback(() => {
        popupAvatarImageRef.current?.show();
    }, []);

    const openPopupFrontCardCapture = useCallback(() => {
        popupFrontCardImageRef.current?.show();
    }, []);

    const openPopupBehindCardCapture = useCallback(() => {
        popupBehindCardImageRef.current?.show();
    }, []);

    const onImageAvatarSelected = useCallback((_data: ImageFile) => {
        setImageAvatar(_data?.images?.[0]?.path);
    }, []);

    const onImageFrontSelected = useCallback((_data: ImageFile) => {
        setImageFrontCard(_data?.images?.[0]?.path);
    }, []);

    const onImageBehindSelected = useCallback((_data: ImageFile) => {
        setImageBehindCard(_data?.images?.[0]?.path);
    }, []);

    const renderPopupChooseTypeImage = useCallback((_ref: any, _onTypeImageSelect: any) => {

        return (
            <PopupUploadImage
                ref={_ref}
                onImageSelected={_onTypeImageSelect}
                maxSelect={1}
            />
        );
    }, []);

    const fetchPathImageBeforeUpload = useCallback(async (_typeImage: string) => {
        const getResPath = await apiServices.imageServices.uploadImage(_typeImage);
        if (getResPath.success) {
            const data = getResPath?.data?.path as string;
            console.log('image = ', data);
            return data;
        } return '';
    }, [apiServices.imageServices]);

    const fetchUploadKyc = useCallback(async (_imgPortrait?: string, _imgFront?: string, _imgBehind?: string) => {
        if (_imgPortrait && _imgFront && _imgBehind) {
            setLoading(true);
            const res = await apiServices?.auth?.uploadIdentity(_imgPortrait, _imgFront, _imgBehind);
            setLoading(false);
            if (res.success) {
                onRefresh();
                ToastUtils.showSuccessToast(Languages.eKyc.successUploadImage);
            }
        } else {
            ToastUtils.showErrorToast(Languages.errorMsg.enoughEKyc);
        }
    }, [apiServices?.auth, onRefresh]);

    const handleUpload = useCallback(async (_response: any) => {
        let imgAvatar;
        let imgFront;
        let imgBehind;
        if (_response?.length === 3) {
            imgAvatar = Object.values(_response[0]).join('');
            imgFront = Object.values(_response[1]).join('');
            imgBehind = Object.values(_response[2]).join('');

            fetchUploadKyc(imgAvatar, imgFront, imgBehind);

            console.log('response', _response);

            console.log('_imgFront', imgFront);
            console.log('_imgBehind', imgBehind);
            console.log('_imgAvatar', imgAvatar);
        }
    }, [fetchUploadKyc]);

    const onConfirmUpLoad = useCallback(() => {
        if (imageAvatar && imageAvatar && imageAvatar) {
            Promise.all([
                fetchPathImageBeforeUpload(imageAvatar),
                fetchPathImageBeforeUpload(imageFrontCard),
                fetchPathImageBeforeUpload(imageBehindCard)
            ]).then((value) => { handleUpload(value); });
        } else {
            ToastUtils.showErrorToast(Languages.errorMsg.enoughEKyc);
        }
    }, [handleUpload, fetchPathImageBeforeUpload, imageAvatar, imageBehindCard, imageFrontCard]);

    const renderBottom = useMemo(() => {
        return (
            <View style={styles.bottomContainer}>
                {(!userManager.userInfo?.portrait && !userManager.userInfo?.front_facing_card && !userManager.userInfo?.card_back) &&
                    <>
                        <HTMLView
                            value={Languages.eKyc.noteEKyc}
                            stylesheet={HtmlStylesSeen}
                        />
                        <Button label={Languages.eKyc.confirmDocument}
                            buttonStyle={'GREEN'}
                            onPress={onConfirmUpLoad}
                            isLowerCase
                            style={styles.buttonConfirmDocumentWrap}
                        />
                    </>
                }
            </View>
        );
    }, [onConfirmUpLoad, userManager.userInfo?.card_back, userManager.userInfo?.front_facing_card, userManager.userInfo?.portrait]);

    return (
        <View style={styles.container}>
            <HeaderBar
                title={Languages.eKyc.confirmKyc} />
            <ScrollView style={styles.mainContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {renderTopNotification}
                {renderNoteTypePhoto(Languages.eKyc.imageKyc, noteKYC[0], noteKYC[1])}
                {renderStorePhoto(Languages.eKyc.frontKyc, <IcFrontCard />, false, openPopupFrontCardCapture, imageFrontCard, userManager.userInfo?.front_facing_card)}
                {renderStorePhoto(Languages.eKyc.behindKyc, <IcBehindCard />, false, openPopupBehindCardCapture, imageBehindCard, userManager.userInfo?.card_back)}
                {renderNoteTypePhoto(Languages.eKyc.avatarImageKyc, noteAvatar[0], noteAvatar[1])}
                {renderStorePhoto(Languages.eKyc.avatarKyc, <IcAvatarKyc />, true, openPopupAvatarCapture, imageAvatar, userManager.userInfo?.portrait, !!userManager.userInfo?.portrait)}
                {renderBottom}
            </ScrollView>
            {renderPopupChooseTypeImage(popupAvatarImageRef, onImageAvatarSelected)}
            {renderPopupChooseTypeImage(popupFrontCardImageRef, onImageFrontSelected)}
            {renderPopupChooseTypeImage(popupBehindCardImageRef, onImageBehindSelected)}
            {isLoading && <MyLoading isOverview />}
        </View>
    );
});

export default IdentityAuthen;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    mainContainer: {
        paddingHorizontal: 16
    },
    textTitleNotePhoto: {
        ...Styles.typography.medium,
        color: COLORS.GRAY_13
    },
    textDescribeNotePhoto: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size12,
        color: COLORS.GRAY_12,
        paddingTop: 4
    },
    textTitleTypePhoto: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_7,
        paddingLeft: 14
    },
    textErrorEKyc: {
        ...Styles.typography.medium,
        color: COLORS.RED_2,
        paddingTop: 16
    },
    textLoadingEKyc: {
        ...Styles.typography.medium,
        color: COLORS.YELLOW_2,
        paddingTop: 16
    },
    typePhotoContainer: {
        borderBottomWidth: 1,
        borderColor: COLORS.GRAY_14
    },
    noteTypePhotoContainer: {
        paddingTop: 16,
        paddingBottom: 8
    },
    titleTypePhotoWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 8
    },
    iconReChooseWrap: {
        paddingRight: 12
    },
    buttonConfirmDocumentWrap: {
        marginVertical: 16
    },
    imgWrap: {
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 8
    },
    bottomContainer: {
        paddingTop: 40
    },
    imageAvatar: {
        width: SCREEN_WIDTH * 0.65,
        height: SCREEN_HEIGHT * 0.35,
        borderRadius: 8
    },
    imageCard: {
        width: SCREEN_WIDTH * 0.65,
        height: SCREEN_HEIGHT * 0.16,
        borderRadius: 8
    }
});

