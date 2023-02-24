import Languages from '@/commons/Languages';
import { ContractTypeModel } from '@/models/contract-type';
import { HistoryTypeModel } from '@/models/history-type';
import { NotifyTypeModel } from '@/models/notify-type';

export const PHONE_PREFIX = '+84';

export const PHONE_REGEX = /^0+[3,5,7,8,9]{1}[0-9]{1}[1-9]{1}[0-9]{6}$/;
export const NUMBER_REGEX = /^[0-9]*$/;
export const EMAIL_REGEX = /^[\w+][\w\.\-]+@[\w\-]+(\.\w{2,10})+$/;
export const PASSWORD_REGEX = /^\w{6,20}$/;

export const SECONDS_IN_DAY = 864e5;
export const DELAY_CLICK = 3e2;
export const INDEX_ITEM = 4;

export enum StorageKeys {
    KEY_ACCESS_TOKEN = 'KEY_ACCESS_TOKEN',
    KEY_DEVICE_TOKEN = 'KEY_DEVICE_TOKEN',
    KEY_DEVICE_TOKEN_FIREBASE = 'KEY_DEVICE_TOKEN_FIREBASE',
    KEY_USER_INFO = 'KEY_USER_INFO',
    KEY_SKIP_ONBOARDING = 'KEY_SKIP_ONBOARDING',
    KEY_LAST_POSITION = 'KEY_LAST_POSITION',
    KEY_LAST_LOGIN_INFO = 'KEY_LAST_LOGIN_INFO',
    KEY_LATEST_NOTIFY_ID = 'KEY_LATEST_NOTIFY_ID',
    KEY_SAVED_API_VERSION = 'KEY_SAVED_API_VERSION',
    KEY_BIOMETRY_TYPE = 'KEY_BIOMETRY_TYPE',
    KEY_FAST_AUTHENTICATION = 'KEY_FAST_AUTHENTICATION',
    KEY_PASSCODE = 'KEY_PASSCODE',
    KEY_RATE = 'KEY_RATING',
    KEY_ENABLE_FAST_AUTHENTICATION = 'KEY_FAST_AUTHENTICATION',
    KEY_PIN = 'KEY_PIN',
    KEY_TEMP_DATA_FOR_PROPERTY_VALUATION = 'TEMP_DATA_FOR_PROPERTY_VALUATION',
    KEY_SAVE_LOGIN_PHONE = 'KEY_SAVE_LOGIN_PHONE',
}

export enum ENUM_BIOMETRIC_TYPE {
    TOUCH_ID = 'TouchID',
    FACE_ID = 'FaceID',
    KEY_PIN = 'KEY_PIN',
}
export enum ERROR_BIOMETRIC {
    // ios
    RCTTouchIDNotSupported = 'RCTTouchIDNotSupported',
    RCTTouchIDUnknownError = 'RCTTouchIDUnknownError',
    LAErrorTouchIDNotEnrolled = 'LAErrorTouchIDNotEnrolled',
    LAErrorTouchIDNotAvailable = 'LAErrorTouchIDNotAvailable',
    LAErrorTouchIDLockout = 'LAErrorTouchIDLockout',
    LAErrorAuthenticationFailed = 'LAErrorAuthenticationFailed',
    // android
    NOT_SUPPORTED = 'NOT_SUPPORTED',
    NOT_AVAILABLE = 'NOT_AVAILABLE',
    NOT_ENROLLED = 'NOT_ENROLLED',
    FINGERPRINT_ERROR_LOCKOUT_PERMANENT = 'FINGERPRINT_ERROR_LOCKOUT_PERMANENT',
    ErrorFaceId = 'ErrorFaceId',
    FINGERPRINT_ERROR_LOCKOUT = 'FINGERPRINT_ERROR_LOCKOUT',
}
export function messageError(value: string) {
    switch (value) {
        case ERROR_BIOMETRIC.RCTTouchIDNotSupported:
            return Languages.errorBiometryType.RCTTouchIDNotSupported;
        case ERROR_BIOMETRIC.RCTTouchIDUnknownError:
            return Languages.errorBiometryType.RCTTouchIDUnknownError;
        case ERROR_BIOMETRIC.LAErrorTouchIDNotEnrolled:
            return Languages.errorBiometryType.LAErrorTouchIDNotEnrolled;
        case ERROR_BIOMETRIC.LAErrorTouchIDLockout:
            return Languages.errorBiometryType.LAErrorTouchIDLockout;
        case ERROR_BIOMETRIC.NOT_ENROLLED:
            return Languages.errorBiometryType.NOT_ENROLLED;
        case ERROR_BIOMETRIC.ErrorFaceId:
            return Languages.errorBiometryType.ErrorFaceId;
        default:
            return Languages.errorBiometryType.NOT_DEFINE;
    }
}

export enum Events {
    TOAST = 'TOAST',
    LOGOUT = 'LOGOUT',
    SWITCH_KEYBOARD = 'SWITCH_KEYBOARD',
}

export enum ToastTypes {
    ERR = 0, //  red background
    MSG = 1, // dark blue background
    SUCCESS = 2, // green background
    NOT_SHOW = 3,
}

export enum PopupTypes {
    OTP = 1,
    POST_NEWS = 2,
}

export enum ErrorCodes {
    SUCCESS = 0,
    IMAGE_LIMIT_SIZE = 1,
}

export enum HistoryCodes {
    SUCCESS = 1,
    FAILS = 2,
}

export enum UseFastAuth {
    TRUE = '1',
    FALSE = '0',
}

export const configGoogleSignIn = {
    webClientId:
        '924291904930-mvgo75r0tbqurh3vor6u4j9evrnsotuh.apps.googleusercontent.com'
};
export enum MaxText {
    max = 40,
}

export enum PRODUCT {
    CAR = 'OTO',
    MOTOR = 'XM',
    CREDIT = 'TC',
    LAND = 'NĐ',
}

export enum Bill {
    WATER = '0',
    ELECTRIC = '1',
    FINANCE = '2',
}
export enum Type {
    Type = '2',
}
export const ContractTypes = [
    {
        index: 0,
        type: 17,
        label: Languages.contracts.loaning,
        key: Languages.ranking.first
    },
    // { type: 23, label: Languages.contracts.extended },
    {
        index: 1,
        type: 19,
        label: Languages.contracts.paid,
        key: Languages.ranking.second
    }
    // Mặc định là 17, còn các hợp đồng mới tạo và chưa được giải ngân sẽ có status nhỏ hơn 17
] as ContractTypeModel[];

export const NotificationTypes = [
    { key: 0, label: Languages.notify.filters[0] },
    { key: 1, label: Languages.notify.filters[1] }
    // { key: 2, label: Languages.notify.filters[2] },
    // { key: 3, label: Languages.notify.filters[3] },
    // { key: 4, label: Languages.notify.filters[4] },
] as NotifyTypeModel[];

export enum ENUM_PROVIDER {
    GOOGLE = 'google',
    FACEBOOK = 'facebook',
    APPLE = 'apple',
}

export enum ENUM_PROVIDERS_SERVICE {
    BILL_WATER = 'BILL_WATER',
    BILL_FINANCE = 'BILL_FINANCE',
    BILL_ELECTRIC = 'BILL_ELECTRIC',
    LOTTERY = 'LUCKY_LOTT'
}

export const BLACK_LIST_PHONES = ['0988251903', '09734343589'];

export const enum ENUM_ERROR_QUERY_BILL {
    NOT_FOUND = '01',
    PAY_OFF = '26'
}

export enum STATE_AUTH_ACC {
    VERIFIED = 1, // Đã xác nhận thông tinÎ
    WAIT = 2, // Chờ TienNgay xác nhận thông tin
    UN_VERIFIED = 0, // Cần xác thực thông tin CMT/CCCD
    RE_VERIFIED = 3 // Xác thực lại thông tin CMT/CCCD
};

export const noteKYC = [
    '1. Mặt trước rõ, đủ 4 góc',
    '2. Không chụp giấy tờ tuỳ thân photo, chụp thông qua màn hình thiết bị điện tử.'
];

export const noteAvatar = [
    '1. Chụp cận mặt, rõ, thẳng góc, không bị che, không chụp quá xa.',
    '2. Không chụp chân dung từ ảnh, màn hình thiết bị điện tử.'
];
