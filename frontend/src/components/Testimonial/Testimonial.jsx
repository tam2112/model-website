import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { useTranslation } from 'react-i18next';

const TestimonialData = [
    {
        id: 1,
        name: 'Victor',
        text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque reiciendis inventore iste ratione ex alias quis magni at optio',
        img: 'https://picsum.photos/101/101',
    },
    {
        id: 2,
        name: 'Satya Nadella',
        text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque reiciendis inventore iste ratione ex alias quis magni at optio',
        img: 'https://picsum.photos/102/102',
    },
    {
        id: 3,
        name: 'Virat Kohli',
        text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque reiciendis inventore iste ratione ex alias quis magni at optio',
        img: 'https://picsum.photos/104/104',
    },
    {
        id: 5,
        name: 'Sachin Tendulkar',
        text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque reiciendis inventore iste ratione ex alias quis magni at optio',
        img: 'https://picsum.photos/103/103',
    },
];

const Testimonial = () => {
    var settings = {
        dots: true,
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        cssEase: 'linear',
        pauseOnHover: true,
        pauseOnFocus: true,
        responsive: [
            {
                breakpoint: 10000,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                },
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    initialSlide: 2,
                },
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    const { t } = useTranslation();

    return (
        <>
            <div className="pt-20">
                <div className="container">
                    {/* header */}
                    <div className="text-center">
                        <h1 className="lg:text-5xl sm:text-4xl text-3xl font-bold font-marcellus text-primary pb-8" data-aos='fade-up'>
                            {t('customers saying')}
                        </h1>
                    </div>

                    {/* testimonial card */}
                    <div data-aos='zoom-in'>
                        <Slider {...settings}>
                            {TestimonialData.map((item) => (
                                <div key={item.id} className="my-6">
                                    <div className="flex flex-col gap-4 shadow-lg py-8 px-6 mx-4 rounded-xl dark:bg-gray-800 bg-primary/10 relative">
                                        <div className="mb-4">
                                            <img src={item.img} alt="" className="rounded-full w-20 h-20" />
                                        </div>
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="space-y-3">
                                                <p className="text-xs text-gray-500">{item.text}</p>
                                                <h1 className="text-xl font-bold text-black/80 dark:text-white">
                                                    {item.name}
                                                </h1>
                                            </div>
                                        </div>
                                        <p className="text-black/20 text-9xl font-serif absolute top-0 right-0">,,</p>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Testimonial;
