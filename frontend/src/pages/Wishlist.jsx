import { useEffect } from "react"
import WishlistItems from "../components/WishlistItems/WishlistItems"

const WishList = () => {
    useEffect(() => {
        window.document.title = 'Wishlist'
    }, [])

    return (
        <>
            <div>
                <WishlistItems />
            </div>
        </>
    )
}

export default WishList