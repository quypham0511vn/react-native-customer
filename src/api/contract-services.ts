import { BaseService } from './base-service';
import { API_CONFIG } from './constants';

export class ContractServices extends BaseService {
    getContracts = async (status: number, lastIndex: number, keyword: string, pageSize: number) => this.api().post(API_CONFIG.CONTRACTS, this.buildFormData({
        status,
        per_page: pageSize,
        uriSegment: lastIndex,
        code_contract_disbursement: keyword
    }));

    getContractDetail = async (id: string) => this.api().post(API_CONFIG.CONTRACT_DETAIL, this.buildFormData({
        id
    }));

    getContractDocument = async (id: string) => this.api().post(API_CONFIG.DOCUMENT, this.buildFormData({
        id
    }));

    getContractTransaction = async (contract_id: string) => this.api().post(API_CONFIG.CONTRACT_PAYMENT, this.buildFormData({
        contract_id
    }));
}

