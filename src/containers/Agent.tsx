import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';
import { observer } from 'mobx-react';
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Image
} from 'react-native';
import MapView, {
    Callout,
    Marker,
    PROVIDER_GOOGLE
} from 'react-native-maps';
import { debounce } from 'lodash';
import FastImage from 'react-native-fast-image';

import { ICONS } from '@/assets/icons/constant';
import { IconTienngay } from '@/assets/icons/icon-tienngay';
import { Configs, isIOS, PADDING_BOTTOM } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { HeaderBar, Touchable } from '@/components';
import { MyTextInput } from '@/components/elements/textfield';
import HideKeyboard from '@/components/HideKeyboard';
import { COLORS, Styles } from '@/theme';
import Utils from '@/utils/Utils';
import { useAppStore } from '@/hooks';
import { StoreModel } from '@/models/store';
import IcMarker from '@/assets/images/ic_marker.svg';
import IcPhone from '@/assets/images/ic_phone.svg';
import MyLoading from '@/components/MyLoading';

const imgAgent = require('@/assets/images/img_agent.jpg');
const imgAgentCallout = require('@/assets/images/img_agent_callout.jpg');

const IMG_HEADER_HEIGHT = (SCREEN_WIDTH / 375) * 85;
const initialRegion = {
    latitude: 21.028511,
    longitude: 105.834160
};

const Agent = observer(() => {
    const { apiServices } = useAppStore();
    const [listStore, setListStore] = useState<StoreModel[]>([]);
    const [dataFilter, setDataFilter] = useState<StoreModel[]>([]);
    const [isLoading, setLoading] = useState<boolean>(true);

    const mapRef = React.useRef<MapView>(null);
    const flatListRef = useRef<FlatList>(null);

    const fetchData = useCallback(async () => {
        const res = await apiServices.common.getStore();
        const data = res.data as StoreModel[];
        if (res.success) {
            setListStore(data.filter(item => item.location !== undefined && !Number.isNaN(item.location.lng) && Number(item.location.lng) > 0));
        }
        setLoading(false);
    }, [apiServices.common]);

    useEffect(() => {
        fetchData();
    }, []);

    const focusToLocation = useCallback((latitude: any, longitude: any) => {
        const camera = {
            center: {
                latitude,
                longitude
            },
            zoom: 14
        };
        mapRef.current?.animateCamera(camera);
    }, []);

    const searchItem = useCallback(
        (text: string) => {
            if (text) {
                setDataFilter(
                    listStore?.filter((item) =>
                        item?.name?.toUpperCase().includes(text.toUpperCase())
                    )
                );
            } else {
                setDataFilter(listStore);
            }
        },
        [listStore]
    );

    const debounceSearchItem = useCallback(
        debounce((text: string) => searchItem(text), 300),
        [searchItem]
    );

    const handleInputOnchange = useCallback(
        (value: string) => {
            debounceSearchItem(value);
        },
        [debounceSearchItem]
    );

    const renderItem = useCallback(
        ({ item }: { item: StoreModel }) => {
            const onPress = () => {
                focusToLocation(item.location.lat, item.location.lng);
            };

            return (
                <Touchable
                    onPress={onPress}
                    style={styles.item}>
                    <FastImage
                        style={styles.image} source={imgAgent}
                    />
                    <View style={styles.infoAgent}>
                        <Text style={styles.agentName}>
                            {item.name}
                        </Text>
                        <Text numberOfLines={2} style={styles.address}>
                            {item.address}
                        </Text>
                        <View style={styles.row}>
                            <Text style={styles.phone}>{item.phone}</Text>
                        </View>
                    </View>
                </Touchable>
            );
        },
        [focusToLocation]
    );

    const callNumber = useCallback((phone: string) => {
        Utils.callNumber(phone);
    }, []);

    const keyExtractor = useCallback((item: StoreModel, index: number) => {
        return `${item._id} ${item._id?.$oid}${index}`;
    }, []);

    const scrollListTo = useCallback(
        (id: any) => {
            let index: number = 0;
            index = listStore.findIndex((item) => item?._id?.$oid === id);
            flatListRef.current?.scrollToIndex({ animated: true, index });
        },
        [listStore]
    );

    const scrollToIndexFail = useCallback((info: any) => {
        const wait = new Promise((resolve) => setTimeout(resolve, 700));
        wait.then(() => {
            flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
        });
    }, []);

    const renderMarkerItem = useCallback((marker: StoreModel) => {
        return <Marker
            key={marker._id.$oid}
            identifier={marker._id.$oid}
            coordinate={{
                latitude: marker.location.lat,
                longitude: marker.location.lng
            }}
            onPress={() => {
                scrollListTo(marker?._id?.$oid);
            }}
            onCalloutPress={() => callNumber(marker?.phone)}
        >
            <IcMarker />
            <Callout>
                <View style={styles.callout}>
                    {isIOS && <Image
                        style={styles.imageCallout}
                        source={imgAgentCallout}
                    />}

                    <View style={styles.infCallout}>
                        <Text style={styles.agentName}>{marker.name}</Text>
                        <View style={styles.row}>
                            <IcPhone />
                            <Text style={styles.phoneCallout}>{marker.phone}</Text>
                        </View>
                        <Text numberOfLines={4} style={styles.addressCallout}>
                            {marker.address}
                        </Text>
                    </View>
                </View>
            </Callout>
        </Marker>;
    }, [callNumber, scrollListTo]);

    const renderMarkers = useMemo(() => {
        return dataFilter.map(renderMarkerItem);
    }, [dataFilter, renderMarkerItem]);

    const renderMap = useMemo(() => {
        return <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
                latitude: initialRegion.latitude,
                longitude: initialRegion.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
            }}
            zoomEnabled={true}
            showsUserLocation={true}
            style={styles.mapContainer}
        >
            {renderMarkers}
        </MapView>;
    }, [renderMarkers]);

    return (
        <HideKeyboard>
            <View style={styles.container}>
                <HeaderBar title={Languages.agent.title} />
                {isLoading ? <MyLoading /> : <>

                    {renderMap}

                    <View style={styles.wrapInput}>
                        <MyTextInput
                            placeHolder={Languages.agent.search}
                            containerInput={styles.input}
                            rightIcon={ICONS.SEARCH}
                            onChangeText={handleInputOnchange}
                            maxLength={50}
                        />
                    </View>

                    <FlatList
                        ref={flatListRef}
                        data={dataFilter}
                        renderItem={renderItem}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={keyExtractor}
                        style={styles.flatList}
                        onScrollToIndexFailed={scrollToIndexFail}
                    />
                    <View style={styles.wrapButton}>
                        <Touchable
                            radius={40}
                            onPress={() => callNumber(Languages.common.telePhone)}
                            style={styles.button}
                        >
                            <IconTienngay
                                style={styles.icPhone}
                                name={ICONS.PHONE}
                                color={COLORS.WHITE}
                            />
                            <Text style={styles.txtBt}>{Languages.common.telePhone}</Text>
                        </Touchable>
                    </View>
                </>}
            </View>
        </HideKeyboard>
    );
});

export default Agent;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: PADDING_BOTTOM
    },
    mapContainer: {
        flex: 1,
        width: SCREEN_WIDTH
    },
    wrapInput: {
        position: 'absolute',
        width: '100%',
        left: 0,
        right: 0,
        top: IMG_HEADER_HEIGHT - 10
    },
    input: {
        ...Styles.shadow,
        marginTop: 30,
        marginHorizontal: 16,
        borderRadius: 40,
        borderColor: COLORS.WHITE
    },
    textSearch: {
        flex: 1,
        height: 40,
        paddingLeft: 20,
        fontSize: Configs.FontSize.size16
    },
    containerFlatList: {
        position: 'absolute',
        bottom: 150
        // marginLeft:20
    },
    item: {
        ...Styles.shadow,
        backgroundColor: COLORS.WHITE,
        marginLeft: 15,
        width: 225,
        height: 160,
        borderRadius: 10
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    infoAgent: {
        marginLeft: 10,
        marginTop: 4,
        paddingBottom: 5
    },
    infCallout: {
        minWidth: 100,
        maxWidth: 180,
        justifyContent: 'flex-start',
        marginLeft: 10
    },
    image: {
        width: '100%',
        height: '50%',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10
    },
    imageCallout: {
        width: 80,
        height: 90
    },
    agentName: {
        ...Styles.typography.medium,
        color: COLORS.GREEN,
        fontSize: Configs.FontSize.size13
    },
    address: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size10,
        marginTop: 5,
        color: COLORS.DARK_GRAY,
        paddingRight: 4
    },
    addressCallout: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size10,
        marginTop: 5,
        color: COLORS.GRAY_12,
        width: 160
    },
    phone: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size10,
        marginLeft: 0,
        color: COLORS.DARK_GRAY,
        marginTop: 4
    },
    phoneCallout: {
        ...Styles.typography.bold,
        fontSize: Configs.FontSize.size10,
        marginLeft: 5,
        color: COLORS.DARK_GRAY,
        marginTop: 5
    },
    wrapButton: {
        paddingVertical: 8,
        backgroundColor: COLORS.WHITE
    },
    button: {
        paddingVertical: 10,
        flexDirection: 'row',
        backgroundColor: COLORS.GREEN,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Configs.FontSize.size30,
        marginHorizontal: 16
    },
    txtBt: {
        ...Styles.typography.bold,
        color: COLORS.WHITE,
        fontSize: Configs.FontSize.size20
    },
    callout: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    icPhone: {
        fontSize: Configs.FontSize.size28,
        position: 'absolute',
        left: 20
    },
    flatList: {
        height: 180,
        position: 'absolute',
        bottom: 100
    },
    imgCallout: {
        resizeMode: 'contain',
        width: 250,
        height: 120
    }
});
