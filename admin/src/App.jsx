import Navbar from "./components/Navbar/Navbar"
import { useLayoutEffect, useState } from 'react'
import Admin from './Pages/Admin/Admin'

const App = () => {
    const [showSidebar, setShowSidebar] = useState(true)

    // This will run only once when the component mounts
    useLayoutEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1024) {
                setShowSidebar(true);
            } else {
                setShowSidebar(false);
            }
        };

        // Call the function to set the initial state
        handleResize();

        // Add a resize event listener
        window.addEventListener('resize', handleResize);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const toggleShow = () => {
        setShowSidebar(!showSidebar)
    }

    return (
        <>
            <div className='bg-third'>
                <div>
                    <Navbar showSidebar={showSidebar} toggleShow={toggleShow} />
                    <Admin showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
                </div>
            </div>
        </>
    )
}

export default App