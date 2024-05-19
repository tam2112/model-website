import p17_1m from './men/product_17-1.png';
import p17_2m from './men/product_17-2.png';
import p17_3m from './men/product_17-3.png';
import p20_1m from './men/product_20-1.png';
import p20_2m from './men/product_20-2.png';
import p20_3m from './men/product_20-3.png';

import p5_1w from './women/product_5-1.png';
import p5_2w from './women/product_5-2.png';
import p5_3w from './women/product_5-3.png';
import p5_4w from './women/product_5-4.png';

import p3_1k from './kids/product_3-1.png';
import p3_2k from './kids/product_3-2.png';
import p3_3k from './kids/product_3-3.png';

let explore = [
    {
        id: 25,
        name: 'TIE DETAIL CORSET',
        category: 'women',
        main_img: p5_1w,
        sub_img: [
            { id: 1, pic: p5_2w },
            { id: 2, pic: p5_3w },
            { id: 3, pic: p5_4w },
        ],
        price: 19.0,
    },
    {
        id: 17,
        name: 'SMART UTILITY STRETCH OVERSHIRT',
        category: 'men',
        main_img: p17_1m,
        sub_img: [
            { id: 1, pic: p17_2m },
            { id: 2, pic: p17_3m },
        ],
        price: 30.0,
    },
    {
        id: 20,
        name: 'JERSEY UTILITY BUTTON THROUGH OVERSHIRT',
        category: 'men',
        main_img: p20_1m,
        sub_img: [
            { id: 1, pic: p20_2m },
            { id: 2, pic: p20_3m },
        ],
        price: 20.0,
    },
    {
        id: 43,
        name: 'Cotton Dress',
        category: 'kids',
        main_img: p3_1k,
        sub_img: [
            { id: 1, pic: p3_2k },
            { id: 2, pic: p3_3k },
        ],
        price: 12.99,
    },
];

export default explore;
