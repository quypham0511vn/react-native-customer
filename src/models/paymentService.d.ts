import { any, string } from 'prop-types';

import { BaseModel } from './base-model';
import { Id } from './id';

interface Item {
    name: string;
    code: string;
}
export interface ProvidersServiceModel extends BaseModel {
    name: string;
    publisher: Item[];
    service_code: string;
    _id: Id;
}

export interface InformationRequestPaymentModel {
    error_code: string;
    error_message: string;
    merchant_code: string;
    checksum: string;
    data: Data;
    code: string;
}

export interface InformationPaymentModel {
    customerCode: string;
    customerName: string;
    customerAddress: string;
    customerOtherInfo: string;
    amount: number;
    code: string;
}

interface Data {
    transaction_id: string;
    billDetail: BillDetail[];
    customerInfo: CustomerInfo;
}

interface BillDetail {
    billNumber: string;
    period: string;
    amount: number;
    billType: string;
    otherInfo: string;
}

interface CustomerInfo {
    customerCode: string;
    customerName: string;
    customerAddress: string;
    customerOtherInfo: string;
}
interface CreateBillPaymentModel {
    type: string,
    url: string,
    status: number
}
