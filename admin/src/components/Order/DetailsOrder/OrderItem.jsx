import { useEffect, useState } from "react";

const OrderItem = ({ product, quantity, size }) => {
    const [allSizes, setAllSizes] = useState([])

    const fetchAllSizes = async () => {
        await fetch('http://localhost:5000/allsizes')
        .then((res) => res.json())
        .then((data) => {setAllSizes(data)});
    }

    useEffect(() => {
        fetchAllSizes();
    }, [])

    const getSizeName = (sizeId) => {
        const size = allSizes.find(size => size._id === sizeId)
        return size ? size.name : ''
    }

    return (
        <>
            <div className="space-y-6 ml-28">
                <div className="mb-4">
                    <p className="max-w-[360px] line-clamp-1">{product && product.name}</p>
                    <div className="flex gap-4">
                        <span className="text-sm">Quantity: {quantity}</span>
                        <span className="text-sm">Size: {allSizes && getSizeName(size)}</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OrderItem