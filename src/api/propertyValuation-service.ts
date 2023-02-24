import { BaseService } from './base-service';
import { API_CONFIG } from './constants';

export class PropertyValuationServices extends BaseService {
    getListFormalityLoan = async () =>
        this.api().post(
            API_CONFIG.GET_LIST_FORMALITY,
            this.buildFormData({
            })
        );

    getBrandName = async (codeMain: string) =>
        this.api().post(
            API_CONFIG.GET_LIST_BRAND_NAME,
            this.buildFormData({
                code_main: codeMain
            })
        );

    getModelName = async (parentId: string) =>
        this.api().post(
            API_CONFIG.GET_LIST_MODEL_NAME,
            this.buildFormData({
                parent_id: parentId
            })
        );

    getPropertyName = async (model: string) =>
        this.api().post(
            API_CONFIG.GET_LIST_PROPERTY_NAME,
            this.buildFormData({
                model
            })
        );

    getDepreciationProperty = async (
        id: string,
        loanProduct: string
    ) =>
        this.api().post(
            API_CONFIG.GET_LIST_DEPRECIATION_PROPERTY,
            this.buildFormData({
                id,
                loan_product: loanProduct
            })
        );

    getPropertyPrice = async (
        propertyId: string,
        codeTypeProperty: string,
        typeLoan: string,
        depreciationPrice: any,
        productLoan?: string
    ) =>
        this.api().post(
            API_CONFIG.GET_PRICE_PROPERTY,
            this.buildFormData({
                property_id: propertyId,
                code_type_property: codeTypeProperty,
                type_loan: typeLoan,
                'depreciation_price[]': depreciationPrice,
                loan_product: productLoan || ''
            })
        );

    getFormalityOfPayment = async () =>
        this.api().post(API_CONFIG.GET_LIST_FORMALITY_OF_PAYMENT, this.buildFormData({
        }));

    getTimeLoan = async () =>
        this.api().post(API_CONFIG.GET_LIST_TIME_LOAN, this.buildFormData({
        }));

    getMainProperty = async (
        code_main: string
    ) =>
        this.api().post(
            API_CONFIG.GET_LIST_MAIN_PROPERTY,
            this.buildFormData({
                code_main
            })
        );

    getProductLoan = async (
        type_loan: string,
        code_type_property: string

    ) =>
        this.api().post(
            API_CONFIG.GET_LIST_PRODUCT_LOAN,
            this.buildFormData({
                type_loan,
                code_type_property
            })
        );

    registerLoan = async(
        customer_name:string,
        customer_phone_number:string,
        amount_money:number,
        number_day_loan:string,
        type_repay:string
    )=>this.api().post(
        API_CONFIG.CREATE_CONTRACT_LOAN,this.buildFormData({
            customer_name,
            customer_phone_number,
            amount_money,
            number_day_loan,
            type_repay
        })
    );

}
