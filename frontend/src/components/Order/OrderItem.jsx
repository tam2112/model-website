import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next";

const OrderItem = ({ product, quantity, size }) => {
    const { t } = useTranslation()

    const [allSizes, setAllSizes] = useState([]);

    const fetchAllSizes = async () => {
        try {
            const res = await fetch('http://localhost:5000/allsizes');
            const data = await res.json();
            setAllSizes(data)
        }
        catch(error) {
            console.error('Error fetching sizes: ', error);
        }
    }

    useEffect(() => {
        fetchAllSizes();
    }, [])

    const getSizeName = (sizeId) => {
        const size = allSizes.find(size => size._id === sizeId);
        return size ? size.name : ''
    }

    return (
        <>
            <div>
                <img src={product.main_img} alt="" className="w-14" />
            </div>
            <div className="space-y-1">
                <p className="max-w-[500px] truncate">{product.name}</p>
                <div>
                    <p className="text-sm font-light">{t('size')}: {getSizeName(size)}</p>
                    <p className="text-sm font-light">{t('quantity')}: {quantity}</p>
                </div>
            </div>
            <p className="ml-auto">${product.price.toFixed(2)}</p>
        </>
    )
}

export default OrderItem