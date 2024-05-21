import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
    Hero,
    Banner,
    Explore,
    NewIn,
    UpcomingProd,
    TrendingProd,
    BlogComp,
    Testimonial,
    Newsletter,
} from '../components';

const Home = () => {
    const { t, i18n } = useTranslation();

    useEffect(() => {
        window.document.title = i18n.language === 'en' ? `${t('home')} Page` : `${t('home')}`
    }, [t('home')])

    return (
        <>
            <Hero />
            <Banner />
            <Explore />
            <NewIn />
            <UpcomingProd />
            <TrendingProd />
            <BlogComp />
            <Testimonial />
        </>
    );
};

export default Home;
