import { COLORS} from '@/theme';

export const InsuranceData = [
    {
        id: 0,
        name: 'BẢO HIỂM QUÂN ĐỘI MIC'
        // image: LogoMic
    },
    {
        id: 1,
        name: 'BẢO HIỂM SỨC KHỎE VBI'
        // image: LogoVbi
    },
    {
        id: 2,
        name: 'BẢO HIỂM TOÀN CẦU GIC'
        // image: LogoGic
    }
];

export const NewsData = [
    {
        id: 0,
        name: 'CTKM Tháng 4 | Miễn giảm 100% lãi suất 3 tháng!',
        date: '03/04/2021'
    },
    {
        id: 1,
        name: 'CTKM Tháng 4 | Miễn giảm 100% lãi suất 3 tháng!',
        date: '03/04/2021'
    },
    {
        id: 2,
        name: 'CTKM Tháng 4 | Miễn giảm 100% lãi suất 3 tháng!',
        date: '03/04/2021'
    },
    {
        id: 3,
        name: 'CTKM Tháng 4 | Miễn giảm 100% lãi suất 3 tháng!',
        date: '03/04/2021'
    }
];

export const HistoryData = [
    {
        id: 0,
        title: 'Tháng 5',
        month: [
            {
                id: 11,
                name: 'HĐCC/ĐKXM/HN26VP/2005/38',
                status: 'Thành công',
                timeCreate: '09:06 - 09/04/2021',
                price: '-3.000.000đ',
                // image_avatar: '@/assets/images/contract.png',
                check_status: '1',
                color: COLORS.GREEN
            },
            {
                id: 22,
                name: 'BẢO HIỂM Bảo hiểm VBI',
                status: 'Thành công',
                timeCreate: '09:06 - 09/04/2021',
                price: '-1.000.000đ',
                // image_avatar: '@/assets/images/insurance.png',
                check_status: '1',
                color: COLORS.GREEN
            },
            {
                id: 33,
                name: 'Hóa đơn nước',
                status: 'Thất bại',
                timeCreate: '09:06 - 09/04/2021',
                price: '-400.000đ',
                // image_avatar: '@/assets/images/water.png',
                check_status: '2',
                color: COLORS.RED
            }

        ]
    },
    {
        id: 1,
        title: 'Tháng 4',
        month: [
            {
                id: 44,
                name: 'Hóa đơn nước',
                status: 'Thất bại',
                timeCreate: '09:06 - 09/04/2021',
                price: '-400.000đ',
                // image_avatar: '@/assets/images/water.png',
                check_status: '2',
                color: COLORS.RED
            },
            {
                id: 55,
                name: 'BẢO HIỂM Bảo hiểm VBI',
                status: 'Thành công',
                timeCreate: '09:06 - 09/04/2021',
                price: '-1.000.000đ',
                // image_avatar: '@/assets/images/insurance.png',
                check_status: '1',
                color: COLORS.GREEN
            },
            {
                id: 66,
                name: 'HĐCC/ĐKXM/HN26VP/2005/38',
                status: 'Thành công',
                timeCreate: '09:06 - 09/04/2021',
                price: '-3.000.000đ',
                // image_avatar: '@/assets/images/contract.png',
                check_status: '1',
                color: COLORS.GREEN

            }
        ]

    }
];

export const detaisHistoryData = {
    id: 0,
    services: 'Thanh toán kỳ hợp đồng',
    name: 'CTKM Tháng 4 | Miễn giảm 100% lãi suất 3 tháng!',
    username: '',
    date: '03/04/2021',
    price: '3.000.000đ'
};


export const ListNotify = [
    {
        id: 0,
        title: 'HỢP ĐỒNG',
        status: 'Phê duyệt thành công!',
        description: 'Hợp đồng 000621 đã được hội sở phê duyệt thành công.',
        datecreatat: '2021/05/17 11:41:39',
        image: '',
        unread: '1'
    },
    {
        id: 1,
        title: 'BẢO HIỂM',
        status: 'Thanh toán bảo hiểm thành công!',
        description: 'Bảo hiểm VBI - Sốt xuất huyết cá nhân gói vàng đã được thanh toán 450.000đ thành công.',
        datecreatat: '2021/05/17 11:41:39',
        image: '',
        unread: '2'
    },
    {
        id: 2,
        title: 'THANH TOÁN',
        status: 'Hóa đơn điện đã quá 7 ngày chưa thanh toán?',
        description: 'Đã quá 7 ngày bạn chưa thanh toán hóa đơn Điện lực miền Bắc, số hợp đồng PA00CPCP000111, số tiền: 100.000đ.',
        datecreatat: '2021/05/17 11:41:39',
        image: '',
        unread: '2'
    },
    {
        id: 3,
        title: 'HỢP ĐỒNG',
        status: 'Phê duyệt thành công!',
        description: 'Hợp đồng 000621 đã được hội sở phê duyệt thành công.',
        datecreatat: '2021/05/17 11:41:39',
        image: '',
        unread: '1'
    },
    {
        id: 4,
        title: 'BẢO HIỂM',
        status: 'Thanh toán bảo hiểm thành công!',
        description: 'Bảo hiểm VBI - Sốt xuất huyết cá nhân gói vàng đã được thanh toán 450.000đ thành công.',
        datecreatat: '2021/05/17 11:41:39',
        image: '',
        unread: '2'
    }
];
export const profileAuth = {
    id: 0,
    nameLogin: '0989999999',
    username: 'NGUYỄN VĂN ABC',
    numberPhone: '0989999999',
    card: '022199000000',
    date: '31/07/2019',
    place: 'CUC CS',
    address: 'TRUNG HÒA, CẦU GIẤY, HÀ NỘI',
    email: 'abcnv@gmail.com'
};
export const dataHistoryPaymentProp = {
    totalPayed : 4000000,
    debtTotal: 8000000,
    finalSettlement:8500000,
    shouldPay:[
        {
            period: 4,
            datePay: '01/06/2021',
            moneyPayed :2000000,
            debt : 3000000,
            status:'false'
        },
        {
            period: 5,
            datePay: '01/07/2021',
            moneyPayed :2000000,
            debt : 1000000,
            status:'false'
        },
        {
            period: 6,
            datePay: '01/08/2021',
            moneyPayed :1000000,
            debt : 1000000,
            status:'false'
        }
    ],
    payed:[
        {
            period :1,
            status:'success'
        },
        {
            period :2,
            status:'success'
        },
        {
            period :3,
            status:'success'
        }
    ]
};

