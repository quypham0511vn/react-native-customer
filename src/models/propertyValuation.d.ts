import { BaseModel } from './base-model';

export interface Depreciation {
  id: string;
  value: string;
  price: string;
}

export interface DepreciationModel extends BaseModel {
  name: string;
  slug_name: string;
  parent_id: string;
  status: string;
  created_at: number;
  created_by: string;
  year_property: string;
  phan_khuc: string;
  price: string;
  type_property: string;
  xuat_xu: string;
  slug_xuat_xu: string;
  ban_xang_dau: string;
  str_name: string;
  giam_tru_tieu_chuan: string;
  depreciations: Depreciation[];
}
export interface FormalityModel extends BaseModel {
  code: string;
  created_at: number;
  name: string;
  percent: any;
  updated_at: boolean;
  updated_by: string;
  _id: any;
}

export interface PropertyPriceModel {
  gia_tri_tai_san: number;
  so_tien_co_the_vay: number;
}
export interface StatusRegisterModel {
  data: any;
}
