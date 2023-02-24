import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import FolderGray from '@/assets/images/img_folder_gray.svg';
import FolderGreen from '@/assets/images/img_folder_green.svg';
import { Configs } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import ScreenNames from '@/commons/ScreenNames';
import { HeaderBar, Touchable } from '@/components';
import { useAppStore } from '@/hooks';
import { Document as DocumentModel } from '@/models/contract';
import Navigator from '@/routers/Navigator';
import { COLORS, Styles } from '@/theme';
import Utils from '@/utils/Utils';

const Document = observer(({ route }: { route: any }) => {

    const { apiServices } = useAppStore();

    const [imageAccuracies, setImageAccuracies] = useState<any[]>([]);
    const [imageAccuraciesValue, setImageAccuraciesValue] = useState<any[]>([]);

    const fetchData = useCallback(async () => {
        const res = await apiServices.contract.getContractDocument(route?.params);

        const document = res.data as DocumentModel[];
        const result = Object.values(document);
        const resultKey = Object.keys(document);
        setImageAccuraciesValue(result);
        setImageAccuracies(resultKey);

    }, [apiServices.contract, route?.params]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const renderList = useCallback(({ item, index }: { item: DocumentModel, index: number }) => {
        const onNavigatorDetailsDocument = () => {
            Navigator.pushScreen(ScreenNames.detailsDocument, {
                title: Utils.convertNameImageAccuracies(item.toString()),
                data: imageAccuraciesValue[index]
            });
        };

        return (
            <Touchable style={styles.boxItem}  onPress={imageAccuraciesValue[index].length !== 0 ? onNavigatorDetailsDocument : undefined }>
                {imageAccuraciesValue[index].length !== 0 ? <FolderGreen /> : <FolderGray />}
                <Text style={styles.textFolder} numberOfLines={2} >{Utils.convertNameImageAccuracies(item.toString())}</Text>
            </Touchable>
        );
    }, [imageAccuraciesValue]);

    const keyExtractor = useCallback((item: DocumentModel, index: number) => {
        return `${index} ${item}`;
    }, []);

    const renderContracts = useMemo(() => {
        return (
            <FlatList
                data={imageAccuracies}
                extraData={imageAccuracies}
                renderItem={renderList}
                showsHorizontalScrollIndicator={false}
                numColumns={2}
                {...{ keyExtractor }}
            />
        );
    }, [imageAccuracies, keyExtractor, renderList]);

    return (
        <View style={styles.container}>
            <HeaderBar
                title={Languages.document.title} />
            <View style={styles.boxLicense}>
                {renderContracts}
            </View>
        </View>
    );
});

export default Document;
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    boxLicense: {
        flexDirection: 'row',
        paddingTop: Configs.IconSize.size20
    },
    boxItem: {
        width: '50%',
        marginVertical: Configs.IconSize.size18,
        alignItems: 'center'
    },
    textFolder: {
        ...Styles.typography.bold,
        color: COLORS.DARK_GRAY,
        textAlign: 'center',
        paddingHorizontal: 10
    }
});
