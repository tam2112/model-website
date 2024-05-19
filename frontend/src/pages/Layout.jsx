import { Outlet, useLocation } from 'react-router-dom';
import { Navbar, Footer, Newsletter } from '../components';
import { useEffect, useState } from 'react';

const Layout = () => {
    const [isShowNewsletter, setIsShowNewsletter] = useState(false);

    const location = useLocation();

    const shouldDisplayNewsletter = () => {
        switch (location.pathname) {
            case '/login':
            case '/myprofile':
                setIsShowNewsletter(false)
                break;
            default:
                setIsShowNewsletter(true)
        }
    }

    useEffect(() => {
        shouldDisplayNewsletter();
    }, [isShowNewsletter])

    return (
        <>
            <Navbar />
            <Outlet />
            {isShowNewsletter && <Newsletter />}
            <Footer />
        </>
    );
};

export default Layout;
