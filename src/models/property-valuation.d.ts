import { ItemProps } from '@/components/BottomSheet';

export interface PropertyValuationModel {
    fromScreen:string,
    isCar:boolean,
    formality:ItemProps,
    dataFormality:ItemProps[],
    brandName:ItemProps,
    dataBrandName:ItemProps[],
    dataModelName:ItemProps[],
    modelName:ItemProps,
    propertyName:ItemProps,
    dataPropertyName:ItemProps[],
    depreciation:ItemProps[],
    propertyValue:number,
    propertyMaxLoan:number,
    itemsSelectedDepreciation:ItemProps[]
}

