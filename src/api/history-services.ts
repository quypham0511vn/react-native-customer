import { BaseService } from './base-service';
import { API_CONFIG } from './constants';

export class HistoryServices extends BaseService {

    getHistory = async (lastIndex: number, pageSize: number) => this.api().post(API_CONFIG.HISTORY, this.buildFormData({
        uriSegment: lastIndex,
        per_page: pageSize
    }));

    getDetailsHistory = async (id: number) => this.api().post(API_CONFIG.DETAILS_HISTORY, this.buildFormData({
        id
    }));
}
