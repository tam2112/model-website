import { Routes, Route } from 'react-router-dom'

import Sidebar from "./components/Sidebar/Sidebar"
import Navbar from "./components/Navbar/Navbar"
import { useState } from 'react'
import Admin from './Pages/Admin/Admin'

const App = () => {
    const [showSidebar, setShowSidebar] = useState(true)

    const toggleShow = () => {
        setShowSidebar(!showSidebar)
    }

    return (
        <>
            <div className='w-screen h-screen bg-third'>
                <Navbar showSidebar={showSidebar} toggleShow={toggleShow} />
                <Admin showSidebar={showSidebar} />
            </div>
        </>
    )
}

export default App