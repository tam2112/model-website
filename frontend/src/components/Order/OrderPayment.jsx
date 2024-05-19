import { useContext, useEffect, useState } from "react"
import { ShopContext } from "../../Context/ShopContext"
import OrderItem from "./OrderItem"
import { useNavigate } from "react-router-dom"

const OrderPayment = () => {
    const { selectedProducts, all_product, getTotalCartAmount, addOrder, userId, userInfo } = useContext(ShopContext)

    const [allPayments, setAllPayments] = useState([])
    const [allPays, setAllPays] = useState([])

    const fetchAllPayments = async () => {
        try {
            const response = await fetch('http://localhost:5000/allpayments');
            const data = await response.json();
            setAllPayments(data);
        } catch (error) {
            console.error('Error fetching payments:', error);
        }
    }

    const fetchAllPays = async () => {
        try {
            const response = await fetch('http://localhost:5000/allpays');
            const data = await response.json();
            setAllPays(data);
        } catch (error) {
            console.error('Error fetching pays:', error);
        }
    }

    useEffect(() => {
        fetchAllPayments();
        fetchAllPays();

        console.log(selectedProducts);
    }, [])

    const [selectedPayment, setSelectedPayment] = useState('')
    const [selectedPay, setSelectedPay] = useState('');
    const [filteredPays, setFilteredPays] = useState([]);

    const handlePaymentChange = (e) => {
        setSelectedPayment(e.target.value);
        setSelectedPay('')
    };

    const handlePayIdChange = (payId) => {
        setSelectedPay(payId);
    };

    const getPaymentName = (paymentId) => {
        const payment = allPayments.find(payment => payment._id === paymentId)

        return payment ? payment.name : ''
    }

    const handlePayChange = (paymentName) => {
        const filterPay = allPays.filter(item => item.type === paymentName)

        return filterPay;
    }

    useEffect(() => {
        if (selectedPayment !== '') {
            const typePays = handlePayChange(getPaymentName(selectedPayment));
            setFilteredPays(typePays);
        }
        else {
            setFilteredPays([]);
        }

        console.log(selectedPayment);
    }, [selectedPayment, allPays])

    const [cardNumber, setCardNumber] = useState('');

    const handleInputChange = (event) => {
        let value = event.target.value.replace(/\D/g, ''); // Loại bỏ tất cả các ký tự không phải số
        value = value.replace(/(\d{4})(?=\d)/g, '$1 '); // Thêm dấu cách sau mỗi 4 số
        setCardNumber(value);
    };

    const handlePay = async () => {
        try {
            // Thực hiện đặt hàng
            await addOrder(userId, userInfo, selectedProducts, selectedPayment, selectedPay, getTotalCartAmount(), Object.keys(selectedProducts).length);

            window.location.href = '/myorders';
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };


    return (
        <>
            <div className="py-20">
                <div className="container">
                    <div className="my-8 grid grid-cols-2 gap-8">
                        <div className="bg-[#f8f8f8] rounded-md py-4 min-h-[500px]">
                            <h2 className="font-marcellus text-3xl font-bold text-center">Total: <span className="font-sans font-normal text-2xl">${getTotalCartAmount()}</span></h2>
                            
                            <div className="">
                                {Object.keys(selectedProducts).map((productId) => {
                                    const product = all_product.find((p) => p.id === parseInt(productId));
                                    const { quantity, size } = selectedProducts[productId];
    
                                    if (product && quantity > 0) {
                                        return (
                                            <div key={productId} className="flex gap-4 items-center mt-8 px-4">
                                                <OrderItem product={product} quantity={quantity} size={size} />
                                            </div>
                                        )
                                    }
                                })}
                            </div>
                        </div>
                        <div className="bg-[#f8f8f8] rounded-md py-4">
                            <h2 className="font-marcellus text-3xl font-bold text-center">Payment</h2>

                            {/* Payment */}
                            <div className="px-4">
                                <div className="mt-8 space-y-6">
                                    <div className="space-y-2">
                                        <select value={selectedPayment} onChange={handlePaymentChange} name="payment" className="border-[1px] border-primary py-1 px-2 w-[100%]">
                                            <option value="">--- Select Payment ---</option>
                                            {allPayments.map(payment => (
                                                <option key={payment._id} value={payment._id}>{payment.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    {/* Payment selected */}
                                    <div className="grid w-full gap-6 md:grid-cols-2">
                                        {filteredPays.map((pay) => (
                                            <div key={pay.id}>
                                                <input type="radio" id={pay.name.trim()} name={pay.type.trim()} value={pay.name.trim()} className="hidden peer" required />
                                                <label 
                                                    htmlFor={pay.name.trim()} 
                                                    className="inline-flex items-center justify-between w-full min-h-[80px] p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                                                    onClick={() => handlePayIdChange(pay._id)}
                                                >
                                                    <div className="flex justify-between items-center w-full">
                                                        <p>{pay.name}</p>
                                                        <img src={pay.image} alt="" className="w-20 object-contain" />
                                                    </div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Information pay */}
                                    {selectedPayment !== '' && getPaymentName(selectedPayment) === 'credit' && <div className="space-y-4">
                                        <h2 className="text-xl font-semibold">Credit information</h2>
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <p>Card number</p>
                                                <input type="text" value={cardNumber} onChange={handleInputChange} className="border-[1px] border-primary px-3 py-1 w-full" placeholder="1111 1111 1111 1111" />
                                            </div>
                                            <div className="space-y-2">
                                                <p>Cardholder name</p>
                                                <input type="text" className="border-[1px] border-primary px-3 py-1 w-full" placeholder="Full name on card" />
                                            </div>
                                            <div className="space-y-2">
                                                <p>Country or region</p>
                                                <input type="text" className="border-[1px] border-primary px-3 py-1 w-full" placeholder="Ex: Viet Nam" />
                                            </div>
                                        </div>
                                    </div>}

                                    {/* Button */}
                                    {selectedPayment !== '' && <div>
                                        <button onClick={handlePay} className="btn-primary mt-4 w-full bg-primary text-white hover:bg-primary/85">PAY</button>
                                    </div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OrderPayment