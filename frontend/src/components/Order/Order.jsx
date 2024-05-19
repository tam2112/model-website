import { useState, useContext, useEffect } from "react"
import { ShopContext } from "../../Context/ShopContext"
import axios from 'axios'
import { Link } from "react-router-dom"

const Order = () => {
    const { getTotalCartAmount, userInfo, setUserInfo } = useContext(ShopContext)
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

    return (
        <>
            <div className="py-20">
                <div className="container">
                    <div className="">
                        <h2 data-aos='fade-up' className="mt-8 font-marcellus font-bold text-4xl">Delivery Information</h2>
                        <div className="mt-8">
                            <div className='space-y-6' data-aos='zoom-in'>
                                <div className="flex gap-16">
                                    <div className="w-[60%] space-y-6">
                                        <div className="space-y-2">
                                            <div className="flex gap-4">
                                                <div className="w-[50%] space-y-2">
                                                    <p>Name</p>
                                                    <input value={user.name} onChange={handleInputChange}  type="text" name="name" className="w-[100%] px-2 py-1 border-[1px] border-primary" />
                                                </div>
                                                <div className="w-[50%] space-y-2">
                                                    <p>Email</p>
                                                    <input value={user.email} onChange={handleInputChange} type="email" name="email" className="w-[100%] px-2 py-1 border-[1px] border-primary" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p>Address</p>
                                            <input value={user.address} onChange={handleInputChange} type="text" name="address" className="w-[100%] px-2 py-1 border-[1px] border-primary" />
                                        </div>
                                        <div className="space-y-2">
                                            <p>Phone</p>
                                            <input value={user.phone} onChange={handleInputChange} type="text" name="phone" className="w-[100%] px-2 py-1 border-[1px] border-primary" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex gap-4">
                                                <div className="w-[50%] space-y-2">
                                                    <p>City</p>
                                                    <input value={user.city} onChange={handleInputChange} type="text" name="city" className="w-[100%] px-2 py-1 border-[1px] border-primary" />
                                                </div>
                                                <div className="w-[50%] space-y-2">
                                                    <p>Province</p>
                                                    <input value={user.province} onChange={handleInputChange} type="text" name="province" className="w-[100%] px-2 py-1 border-[1px] border-primary" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex gap-4">
                                                <div className="w-[50%] space-y-2">
                                                    <p>District</p>
                                                    <input value={user.district} onChange={handleInputChange} type="text" name="district" className="w-[100%] px-2 py-1 border-[1px] border-primary" />
                                                </div>
                                                <div className="w-[50%] space-y-2">
                                                    <p>Commune</p>
                                                    <input value={user.commune} onChange={handleInputChange} type="text" name="commune" className="w-[100%] px-2 py-1 border-[1px] border-primary" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p>Country</p>
                                            <input value={user.country} onChange={handleInputChange} type="text" name="country" className="w-[100%] px-2 py-1 border-[1px] border-primary" />
                                        </div>
                                    </div>
                                    <div className="w-[40%]">
                                        <div className="space-y-8">
                                            <h1 className="sm:text-4xl text-3xl font-marcellus font-semibold" data-aos='fade-up'>Cart Totals</h1>
                                            <div data-aos='zoom-in'>
                                                <div className="flex justify-between items-center">
                                                    <p>Subtotal</p>
                                                    <p>${getTotalCartAmount()}</p>
                                                </div>
                                                <hr className="my-[10px]" />
                                                <div className="flex justify-between items-center">
                                                    <p>Shipping Free</p>
                                                    <p>Free</p>
                                                </div>
                                                <hr className="my-[10px]" />
                                                <div className="flex justify-between items-center font-semibold">
                                                    <p>Total</p>
                                                    <p>${getTotalCartAmount()}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-8">
                                            <Link to={'/orderpayment'}>
                                                <button className='btn-primary'>PROCEED TO PAYMENT</button>
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