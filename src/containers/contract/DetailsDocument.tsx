import { observer } from 'mobx-react';
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { FlatList, StyleSheet, View, Image } from 'react-native';

import { HeaderBar, Touchable } from '@/components';
import { ImagesModel } from '@/models/contract';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import { COLORS } from '@/theme';
import { MyImageView } from '@/components/image';
import Navigator from '@/routers/Navigator';
import ScreenNames from '@/commons/ScreenNames';
import IcYoutube from '@/assets/images/ic_youtube.png';
import IcAudio from '@/assets/images/ic_audio.png';
import { PADDING_BOTTOM } from '@/commons/Configs';

const DetailsDocument = observer(({ route }: { route: any }) => {

    const data = route.params.data;
    const title = route.params.title;

    const [images, setImages] = useState<ImagesModel[]>([]);

    useEffect(() => {
        const tmpImages: ImagesModel[] = [];

        data.forEach((item: { file_type: string; path: any; file_name: any; }) => {
            if (item.file_type.split('/')[0] === 'image') {
                tmpImages.push({
                    url: item.path,
                    type: 'image',
                    name: item.file_name
                });
            }else if (item.file_type.split('/')[0] === 'audio') {
                tmpImages.push({
                    url: item.path,
                    type: 'audio',
                    name: item.file_name
                });
            }else if (item.file_type.split('/')[0] === 'video') {
                tmpImages.push({
                    url: item.path,
                    type: 'video',
                    name: item.file_name
                });
            }
        });

        setImages(tmpImages);
    }, [data]);

    const renderFile = useCallback(({ item }: { item: ImagesModel }) => {

        const onNavigatePlayScreen = () => {
            Navigator.pushScreen(ScreenNames.playVideoScreen, item.url);
        };

        let view;
        switch (item.type) {
            case 'image':
                view = (
                    <View style={styles.containerRenderFile}>
                        <MyImageView
                            style={styles.progressiveImage}
                            imageUrl={item.url}
                        />
                    </View>
                );
                break;
            case 'video':
                view = (
                    <Touchable onPress={onNavigatePlayScreen} style={styles.containerRenderFile}>
                        <View style={styles.containerFile}>
                            <Image source={IcYoutube} />
                        </View>
                    </Touchable>
                );
                break;
            case 'audio':
                view = (
                    <Touchable onPress={onNavigatePlayScreen} style={styles.containerRenderFile}>
                        <View style={styles.containerFile}>
                            <Image source={IcAudio} />
                        </View>
                    </Touchable>
                );
                break;
            default:
                break;
        }
        return view;
    }, []);

    const keyExtractor = useCallback((item: ImagesModel) => {
        return item.url.toString();
    }, []);

    const renderListFile = useMemo(() => {
        return <FlatList
            data={images}
            extraData={images}
            renderItem={renderFile}
            showsHorizontalScrollIndicator={false}
            onEndReachedThreshold={0.01}
            numColumns={2}
            contentContainerStyle={styles.contentContainer}
            {...{ keyExtractor }}
        />;
    }, [images, keyExtractor, renderFile]);

    return (
        <View style={styles.container}>
            <HeaderBar
                title={title} />
            {renderListFile}
        </View>
    );
});

export default DetailsDocument;
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    contentContainer: {
        paddingBottom: PADDING_BOTTOM
    },
    containerRenderFile: {
        width: SCREEN_WIDTH / 2,
        height: 170,
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    progressiveImage: {
        width: 150,
        height: 150
    },
    containerFile: {
        width: 150,
        height: '100%',
        backgroundColor: COLORS.GRAY_3,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: COLORS.GRAY_1,
        borderWidth: 1
    }
});
