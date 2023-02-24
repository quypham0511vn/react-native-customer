
import { BaseService } from './base-service';
import { API_CONFIG } from './constants';

export class CommonServices extends BaseService {
    getNews = async () => this.api().post(API_CONFIG.GET_NEWS, {});

    getInsurances = async () => this.api().post(API_CONFIG.GET_INSURANCES, {});

    getBanners = async () => this.api().post(API_CONFIG.GET_BANNERS, {});

    getStore = async () => this.api('', true).post(API_CONFIG.GET_ALL_STORE, this.buildFormData({}));

    getRate = async (point:any, note?:string) => this.api().post(API_CONFIG.GET_RATE, this.buildFormData({
        point,
        note
    }));

    getAppInReview = async () => this.api().post(API_CONFIG.CHECK_APP_REVIEW);
}

