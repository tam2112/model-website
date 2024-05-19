import p1_1m from './men/product_1-1.png';
import p1_2m from './men/product_1-2.png';
import p1_3m from './men/product_1-3.png';
import p2_1m from './men/product_2-1.png';
import p2_2m from './men/product_2-2.png';
import p2_3m from './men/product_2-3.png';
import p16_1m from './men/product_16-1.png';
import p16_2m from './men/product_16-2.png';
import p16_3m from './men/product_16-3.png';
import p7_1w from './women/product_7-1.png';
import p7_2w from './women/product_7-2.png';
import p7_3w from './women/product_7-3.png';
import p7_4w from './women/product_7-4.png';
import p11_1w from './women/product_11-1.png';
import p11_2w from './women/product_11-2.png';
import p11_3w from './women/product_11-3.png';
import p11_4w from './women/product_11-4.png';
import p17_1w from './women/product_17-1.png';
import p17_2w from './women/product_17-2.png';
import p17_3w from './women/product_17-3.png';
import p17_4w from './women/product_17-4.png';
import p14_1k from './kids/product_14-1.png';
import p14_2k from './kids/product_14-2.png';
import p14_3k from './kids/product_14-3.png';
import p20_1k from './kids/product_20-1.png';
import p20_2k from './kids/product_20-2.png';
import p20_3k from './kids/product_20-3.png';
import p20_4k from './kids/product_20-4.png';

let new_product = [
    {
        id: 1,
        name: 'OVERSIZED BOXY PALM RIBBED KNITTED HOODIE',
        category: 'men',
        main_img: p1_1m,
        sub_img: [
            { id: 1, pic: p1_2m },
            { id: 2, pic: p1_3m },
        ],
        price: 30.0,
    },
    {
        id: 2,
        name: 'PALM JACQUARD RIBBED KNITTED JORT',
        category: 'men',
        main_img: p2_1m,
        sub_img: [
            { id: 1, pic: p2_2m },
            { id: 2, pic: p2_3m },
        ],
        price: 25.0,
    },
    {
        id: 16,
        name: '4 WAY STRETCH MA1 OVERSHIRT BLACK',
        category: 'men',
        main_img: p16_1m,
        sub_img: [
            { id: 1, pic: p16_2m },
            { id: 2, pic: p16_3m },
        ],
        price: 30.0,
    },
    {
        id: 27,
        name: 'BLACK OVERSIZED OVER THE HEAD HOODIE',
        category: 'women',
        main_img: p7_1w,
        sub_img: [
            { id: 1, pic: p7_2w },
            { id: 2, pic: p7_3w },
            { id: 3, pic: p7_4w },
        ],
        price: 16.0,
    },
    {
        id: 54,
        name: '2-piece Sweatsuit',
        category: 'kids',
        main_img: p14_1k,
        sub_img: [
            { id: 1, pic: p14_2k },
            { id: 2, pic: p14_3k },
        ],
        price: 24.99,
    },
    {
        id: 37,
        name: 'LIMITED EDITION GRAPHIC PRINTED OVERSIZED HOODIE',
        category: 'women',
        main_img: p17_1w,
        sub_img: [
            { id: 1, pic: p17_2w },
            { id: 2, pic: p17_3w },
            { id: 3, pic: p17_4w },
        ],
        price: 22.0,
    },
    {
        id: 31,
        name: 'WARDROBE ESSENTIALS SLOGAN OVERSIZED HOODIE',
        category: 'women',
        main_img: p11_1w,
        sub_img: [
            { id: 1, pic: p11_2w },
            { id: 2, pic: p11_3w },
            { id: 3, pic: p11_4w },
        ],
        price: 20.0,
    },
    {
        id: 60,
        name: 'DryMove™ Hooded Sports Jacket',
        category: 'kids',
        main_img: p20_1k,
        sub_img: [
            { id: 1, pic: p20_2k },
            { id: 2, pic: p20_3k },
            { id: 3, pic: p20_4k },
        ],
        price: 34.99,
    },
];

export default new_product;
