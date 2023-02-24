import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import Edit from '@/assets/images/edit.svg';
import Languages from '@/commons/Languages';
import ScreenNames from '@/commons/ScreenNames';
import { HeaderBar } from '@/components';
import { Touchable } from '@/components/elements/touchable/index';
import { MyImageView } from '@/components/image';
import KeyValue from '@/components/KeyValue';
import { useAppStore } from '@/hooks';
import SessionManager from '@/managers/SessionManager';
import { UserInfoModel } from '@/models/user-model';
import navigator from '@/routers/Navigator';
import { COLORS, IconSize } from '@/theme';

const ProfileInfo = observer(({ navigation }: any) => {
    const { userManager } = useAppStore();
    const [userInfo, setUserInfo] = useState<UserInfoModel | undefined>(userManager.userInfo);

    const isFocused = useIsFocused();

    useEffect(() => {
        if(isFocused){
            if (!userManager.userInfo) {
                SessionManager.logout();
            }else{
                setUserInfo(userManager.userInfo);
            }
        }
    }, [userManager?.userInfo, isFocused]);

    const _editProfile = () => {
        navigator.navigateScreen(ScreenNames.editProFile);
        navigation.navigate(ScreenNames.editProFile);
    };

    return (
        <View style={styles.container}>
            <HeaderBar
                title={Languages.profileAuth.title} />
            <ScrollView style={styles.container}>
                <View style={styles.profile}>
                    <View style={styles.image}>
                        <MyImageView
                            style={styles.imageAvatar}
                            imageUrl={userInfo?.avatar} />
                    </View>
                    <View style={styles.imagEdit}>
                        <Touchable onPress={_editProfile} >
                            <Edit {...IconSize.size25_25} />
                        </Touchable>
                    </View>
                    <View style={styles.showProFile}>
                        <KeyValue label={Languages.profileAuth.nameLogin} value={userInfo?.phone_number} />
                        <KeyValue label={Languages.profileAuth.username} value={userInfo?.full_name} />
                        <KeyValue label={Languages.profileAuth.numberPhone} value={userInfo?.phone_number} />
                        <KeyValue label={Languages.profileAuth.card} value={userInfo?.indentify || userInfo?.identify} />
                        {/* <KeyValue label={Languages.profileAuth.date} />
                        <KeyValue label={Languages.profileAuth.place} />
                        <KeyValue label={Languages.profileAuth.address} /> */}
                        <KeyValue label={Languages.profileAuth.email} value={userInfo?.email} />
                        <KeyValue label={Languages.profileAuth.birthDate} value={userInfo?.birth_date} />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
});

export default ProfileInfo;

const AVATAR_SIZE = 100;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    profile: {
        paddingLeft: 15,
        paddingRight: 15
    },
    imagEdit: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    showProFile: { paddingTop: 5 },
    image: {
        alignItems: 'center',
        marginVertical: 20
    },
    imageAvatar: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        borderColor: COLORS.GRAY_5,
        borderWidth: 1
    }
});

