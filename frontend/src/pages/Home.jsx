import { useEffect } from 'react';
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
    useEffect(() => {
        window.document.title = 'Home Page'
    }, [])

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
