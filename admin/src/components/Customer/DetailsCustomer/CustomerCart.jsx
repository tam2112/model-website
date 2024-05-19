import { useEffect } from "react";
import { useState } from "react"

const CustomerCart = ({ showSidebar, product, size, quantity }) => {
    const [allSizes, setAllSizes] = useState([]);

    const fetchAllSizes = async () => {
        await fetch('http://localhost:5000/allsizes')
        .then((res) => res.json())
        .then((data) => {setAllSizes(data)});
    }

    useEffect(() => {
        fetchAllSizes();
    }, [])

    const getSizeName = (sizeId) => {
        const size = allSizes.find(size => size._id === sizeId);
        return size ? size.name : ''
    }

    return (
        <div key={product.id}>
            <div className="flex items-center lg:space-x-6 sm:space-x-4">
                <div>
                    <img src={product.main_img} alt="" className="w-28" />
                </div>
                <p className={`${showSidebar ? 'w-[314px]' : 'w-[346px]'} truncate`}>{product.name}</p>
                <p className={`${showSidebar ? 'w-[162px]' : 'w-[162px]'}`}>${product.price.toFixed(2)}</p>
                <p className='w-[158px] cursor-default'>
                    <span className='px-3 py-1 border-primary/50 border-[1px]'>{getSizeName(size)}</span>
                </p>
                <div className="w-[158px] select-none">
                    <button className="px-3 py-1 border-primary/50 border-[1px] cursor-default">
                        {quantity}
                    </button>
                </div>
                <p className="w-[158px]" style={{ marginRight: '20px' }}>
                    ${(product.price * quantity).toFixed(2)}
                </p>
            </div>
        </div>
    )
}

export default CustomerCart