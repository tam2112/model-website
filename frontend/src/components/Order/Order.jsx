import { useState, useContext, useEffect } from "react"
import { ShopContext } from "../../Context/ShopContext"
import axios from 'axios'
import { Link } from "react-router-dom"
import Swal from 'sweetalert2'
import { useTranslation } from "react-i18next"

const Order = () => {
    const { t } = useTranslation()

    const { getTotalCartAmount, userInfo, setUserInfo, selectedPayment, selectedPay, selectedProducts, addOrder } = useContext(ShopContext)
    const userId = localStorage.getItem('userId')
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        district: '',
        commune: '',
        country: '',
        city: '',
        province: '',
    });

    useEffect(() => {
        window.document.title = 'Order Page'
    }, [])

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    useEffect(() => {
        axios.get(`http://localhost:5000/detailsuser/${userId}`)
            .then(response => {
                setUser(response.data.user);

                const userDetails = response.data.user;

                setUserInfo(prevUserInfo => ({
                    ...prevUserInfo,
                    name: userDetails.name,
                    email: userDetails.email,
                    address: userDetails.address,
                    phone: userDetails.phone,
                    city: userDetails.city,
                    province: userDetails.province,
                    district: userDetails.district,
                    commune: userDetails.commune,
                    country: userDetails.country,
                }));
            })
            .catch(error => {
                console.error('Error fetching user details:', error);
            });
    }, [userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));

        setUserInfo(prevUser => ({
            ...prevUser,
            [name]: value
        }));

    };
    console.log(userInfo);

    const handleOrder = async () => {
        try {
            // Thực hiện đặt hàng
            await addOrder(userId, userInfo, selectedProducts, selectedPayment, selectedPay, getTotalCartAmount(), Object.keys(selectedProducts).length);

            Swal.fire({
                icon: 'success',
                title: t('title swal'),
                text: t('order success'),
                position: 'center',
            }).then(() => {
                window.location.href = '/myorders';
            })

        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

    return (
        <>
            <div className="py-20">
                <div className="container">
                    <div className="">
                        <h2 data-aos='fade-up' className="mt-8 font-marcellus font-bold text-4xl">{t('delivery info')}</h2>
                        <div className="mt-8">
                            <div className='space-y-6' data-aos='zoom-in'>
                                <div className="flex gap-16">
                                    <div className="w-[60%] space-y-6">
                                        <div className="space-y-2">
                                            <div className="flex gap-4">
                                                <div className="w-[50%] space-y-2">
                                                    <p>{t('name user')}</p>
                                                    <input value={user.name} onChange={handleInputChange}  type="text" name="name" className="w-[100%] px-2 py-1 border-[1px] border-primary" />
                                                </div>
                                                <div className="w-[50%] space-y-2">
                                                    <p>{t('email')}</p>
                                                    <input value={user.email} onChange={handleInputChange} type="email" name="email" className="w-[100%] px-2 py-1 border-[1px] border-primary" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p>{t('address')}</p>
                                            <input value={user.address} onChange={handleInputChange} type="text" name="address" className="w-[100%] px-2 py-1 border-[1px] border-primary" />
                                        </div>
                                        <div className="space-y-2">
                                            <p>{t('phone')}</p>
                                            <input value={user.phone} onChange={handleInputChange} type="text" name="phone" className="w-[100%] px-2 py-1 border-[1px] border-primary" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex gap-4">
                                                <div className="w-[50%] space-y-2">
                                                    <p>{t('city')}</p>
                                                    <input value={user.city} onChange={handleInputChange} type="text" name="city" className="w-[100%] px-2 py-1 border-[1px] border-primary" />
                                                </div>
                                                <div className="w-[50%] space-y-2">
                                                    <p>{t('province')}</p>
                                                    <input value={user.province} onChange={handleInputChange} type="text" name="province" className="w-[100%] px-2 py-1 border-[1px] border-primary" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex gap-4">
                                                <div className="w-[50%] space-y-2">
                                                    <p>{t('district')}</p>
                                                    <input value={user.district} onChange={handleInputChange} type="text" name="district" className="w-[100%] px-2 py-1 border-[1px] border-primary" />
                                                </div>
                                                <div className="w-[50%] space-y-2">
                                                    <p>{t('commune')}</p>
                                                    <input value={user.commune} onChange={handleInputChange} type="text" name="commune" className="w-[100%] px-2 py-1 border-[1px] border-primary" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p>{t('country')}</p>
                                            <input value={user.country} onChange={handleInputChange} type="text" name="country" className="w-[100%] px-2 py-1 border-[1px] border-primary" />
                                        </div>
                                    </div>
                                    <div className="w-[40%]">
                                        <div className="space-y-8">
                                            <h1 className="sm:text-4xl text-3xl font-marcellus font-semibold" data-aos='fade-up'>{t('cart totals')}</h1>
                                            <div data-aos='zoom-in'>
                                                <div className="flex justify-between items-center">
                                                    <p>{t('subtotal')}</p>
                                                    <p>${getTotalCartAmount()}</p>
                                                </div>
                                                <hr className="my-[10px]" />
                                                <div className="flex justify-between items-center">
                                                    <p>{t('shipping')}</p>
                                                    <p>{t('free')}</p>
                                                </div>
                                                <hr className="my-[10px]" />
                                                <div className="flex justify-between items-center font-semibold">
                                                    <p>{t('total')}</p>
                                                    <p>${getTotalCartAmount()}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4 space-x-6 mt-8">
                                            <button onClick={handleOrder} className="btn-primary uppercase">{t('order now')}</button>
                                            <Link to={'/orderpayment'}>
                                                <button className='btn-primary uppercase'>{t('proceed to payment')}</button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Order