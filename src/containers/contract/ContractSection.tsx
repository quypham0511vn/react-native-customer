import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import IcBox from '@/assets/images/ic_box.svg';
import { BOTTOM_HEIGHT, PAGE_SIZE } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import ItemContract from '@/components/items/ItemContract';
import MyFlatList from '@/components/MyFlatList';
import MyLoading from '@/components/MyLoading';
import { useAppStore } from '@/hooks';
import { ContractModel } from '@/models/contract';
import { COLORS, Styles } from '@/theme';

const ContractSection = observer(({ contractType, keyword }: { contractType: number, keyword: string }) => {
    const { apiServices } = useAppStore();

    const [contracts, setContracts] = useState<ContractModel[]>([]);

    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [canLoadMore, setLoadMore] = useState<boolean>(true);
    const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState<boolean>(true);
    const [lastId, setLastId] = useState<number>(0);
    const pageSize = PAGE_SIZE;

    const fetchData = useCallback(async (isLoadMore?: boolean) => {
        const res = await apiServices.contract.getContracts(contractType, isLoadMore ? lastId : 0, keyword, pageSize);
        const newContracts = res.data as ContractModel[];

        if (res.ok && newContracts?.length > 0) {
            setLastId(last => last + newContracts.length);

            if (isLoadMore) {
                setContracts(last => [...last, ...newContracts]);
            } else {
                setContracts(newContracts);
            }
            setLoadMore(newContracts?.length >= pageSize);
        } else {
            setLoadMore(false);
        }
    }, [apiServices.contract, contractType, lastId, keyword, pageSize]);

    useEffect(() => {
        fetchData();
    }, [keyword]);

    const renderContractItem = useCallback(({ item }: { item: ContractModel }) => {
        return <ItemContract
            contract={item}
            tabType={contractType} />;
    }, [contractType]);

    const keyExtractor = useCallback((item: ContractModel) => {
        return `${item.id} ${item.id?.$oid}`;
    }, []);

    const renderFooter = useMemo(() => {
        return <View>
            {canLoadMore && <MyLoading isOverview={false} />}
        </View>;
    }, [canLoadMore]);

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        fetchData();
        setIsRefreshing(false);
    }, [fetchData]);

    const onMomentumScrollBegin = useCallback(() => {
        setOnEndReachedCalledDuringMomentum(false);
    }, []);

    const onEndReached = useCallback(() => {
        if (!onEndReachedCalledDuringMomentum && canLoadMore) {
            setOnEndReachedCalledDuringMomentum(true);
            fetchData(true);
        }
    }, [canLoadMore, fetchData, onEndReachedCalledDuringMomentum]);

    const renderNoData = useMemo(() => {
        return <View style={styles.noDataContainer}>
            <IcBox />
            <Text style={styles.txtNoData}>
                {Languages.contracts.noContract}
            </Text>
        </View>;
    }, []);

    const renderContracts = useMemo(() => {
        return (
            <MyFlatList
                contentContainerStyle={styles.listContainer}
                data={contracts}
                extraData={contracts}
                renderItem={renderContractItem}
                showsHorizontalScrollIndicator={false}
                ListFooterComponent={renderFooter}
                onEndReached={onEndReached}
                onMomentumScrollBegin={onMomentumScrollBegin}
                onEndReachedThreshold={0.01}
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                {...{ keyExtractor }}
            />
        );
    }, [contracts, isRefreshing, keyExtractor, onEndReached, onMomentumScrollBegin, onRefresh, renderContractItem, renderFooter]);

    return (
        <View style={styles.container}>
            {(contracts?.length === 0 && !canLoadMore) ? renderNoData : renderContracts}
        </View>
    );
});

export default ContractSection;
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    contractItem: {
        padding: 10,
        borderRadius: 10,
        marginHorizontal: 5,
        backgroundColor: COLORS.LIGHT_GREEN
    },
    listContainer: {
        paddingBottom: BOTTOM_HEIGHT
    },
    noDataContainer: {
        ...Styles.shadow,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        margin: 15
    },
    txtNoData: {
        ...Styles.typography.regular,
        color: COLORS.RED,
        marginTop: 20
    }
});
