import { useEffect, useState } from 'react';
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import Swal from 'sweetalert2';
import ReCAPTCHA from 'react-google-recaptcha';
import { useTranslation } from 'react-i18next'

import BannerImg from '../components/Assets/banner/sign-in.jpg';

const LoginSignup = () => {
    const { t, i18n } = useTranslation();

    useEffect(() => {
        window.document.title = t('sign in title')
    }, [i18n.language])

    const [state, setState] = useState("Sign Up");
    const [formData, setFormData] = useState({
        name: '',
        password: '',
        email: '',
    })

    const [inputBlur, setInputBlur] = useState({
        name: false,
        email: false,
        password: false,
    });
    const [passwordError, setPasswordError] = useState('');
    const [captchaToken, setCaptchaToken] = useState(null);

    const changeHandler = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (name === 'password' && value.length < 6) {
            setPasswordError(t('password must be at least 6 characters'));
        } else {
            setPasswordError('');
        }
    }

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setInputBlur({ ...inputBlur, [name]: true });
        if (name === 'password') {
            if (value.length < 6) {
                setPasswordError(t('password must be at least 6 characters'));
            } else {
                setPasswordError('');
            }
        }
    }

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    const onCaptchaChange = (token) => {
        setCaptchaToken(token);
    };

    const login = async () => {
        console.log('Login Func Executed', formData);

        if (!formData.email || !formData.password) {
            Swal.fire({
                icon: 'error',
                title: t('title swal'),
                text: t('please enter complete information'),
                position: 'center',
            })
            return;
        }

        if (!captchaToken) {
            Swal.fire({
                icon: 'error',
                title: t('title swal'),
                text: t('please verify CAPTCHA'),
                position: 'center',
            })
            return;
        }

        let responseData;
        await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                Accept: 'application/form-data',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...formData, captchaToken })
        }).then((res) => res.json()).then((data) => responseData = data)

        if (responseData.success) {
            localStorage.setItem('auth-token', responseData.token);
            localStorage.setItem('userId', responseData.userId);
            window.location.replace('/');
        }
        else {
            Swal.fire({
                icon: 'error',
                title: t('title swal'),
                text: t(responseData.errors),
                position: 'center',
            })
        }
    }

    const signup = async () => {
        console.log('Signup Func Executed', formData);

        if (!formData.name || !formData.email || !formData.password) {
            Swal.fire({
                icon: 'error',
                title: t('title swal'),
                text: t('please enter complete information'),
                position: 'center',
            })
            return;
        }

        // Kiểm tra xem mật khẩu có ít nhất 6 ký tự không
        if (formData.password.length < 6) {
            Swal.fire({
                icon: 'error',
                title: t('title swal'),
                text: t('password must be at least 6 characters'),
                position: 'center',
            })
            return;
        }

        if (!captchaToken) {
            Swal.fire({
                icon: 'error',
                title: t('title swal'),
                text: t('please verify CAPTCHA'),
                position: 'center',
            })
            return;
        }
        
        let responseData;
        await fetch('http://localhost:5000/signup', {
            method: 'POST',
            headers: {
                Accept: 'application/form-data',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...formData, captchaToken })
        }).then((res) => res.json()).then((data) => responseData = data)

        if (responseData.success) {
            localStorage.setItem('auth-token', responseData.token);
            localStorage.setItem('userId', responseData.userId);
            window.location.replace('/');
        }
        else {
            Swal.fire({
                icon: 'error',
                title: t('title swal'),
                text: t(responseData.errors),
                position: 'center',
            })
        }
    }

    return (
        <>
            <div className="h-screen py-14 pt-24 bg-third overflow-hidden">
                <div className="container">
                    <div className="grid grid-cols-5">
                        {/* img */}
                        <div className="col-span-3" data-aos='zoom-in'>
                            <img src={BannerImg} alt="" className="h-[640px] object-cover rounded-l-sm" />
                        </div>

                        {/* text content */}
                        <div className="bg-white col-span-2 rounded-r-sm h-full px-10" data-aos='fade-left'>
                            <div className="flex flex-col justify-center h-full">
                                <h1 className="font-marcellus font-bold text-center text-4xl">{state === 'Login' ? `${t('welcome back')}!` : `${t('get started')}!`}</h1>
                                <p className="text-sm text-gray-400 mt-1 text-center font-semibold">
                                    {state === 'Login' ? t('continue to upgrade yourself by purchasing our clothes') : t('start upgrading yourself by purchasing our clothes')}
                                </p>
                                
                                <div className="py-8 space-y-4">
                                    {state === 'Sign Up' ? <div className="flex flex-col">
                                        <label htmlFor="name" className="font-semibold">
                                            {t('name user')} <span className='text-red-500'>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={changeHandler}
                                            onBlur={handleBlur}
                                            id="name"
                                            placeholder={t('enter your name')}
                                            className={`border-2 py-2 px-4 rounded-md mt-2 ${inputBlur.name && !formData.name && 'border-red-500'}`}
                                        />
                                        {inputBlur.name && !formData.name && (
                                            <p className='text-red-500 text-sm mt-1'>{t('name cannot be blank')}</p>
                                        )}
                                    </div> : <></>}
                                    <div className="flex flex-col">
                                        <label htmlFor="email" className="font-semibold">
                                            {t('email')} <span className='text-red-500'>*</span>
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={changeHandler}
                                            onBlur={handleBlur}
                                            placeholder={t('example email')}
                                            className={`w-full border-2 py-2 px-4 rounded-md mt-2 ${inputBlur.email && !formData.email && 'border-red-500'}`}
                                        />
                                        {inputBlur.email && !formData.email && (
                                            <p className='text-red-500 text-sm mt-1'>{t('email cannot be blank')}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <label htmlFor="password" className="font-semibold">
                                            {t('password')} <span className='text-red-500'>*</span>
                                        </label>
                                        <div className='relative'>
                                            <input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={formData.password}
                                                onChange={changeHandler}
                                                onBlur={handleBlur}
                                                placeholder={t('enter your password')}
                                                className={`w-full border-2 py-2 px-4 rounded-md mt-2 ${inputBlur.password && formData.password.length < 6 && 'border-red-500'}`}
                                            />
                                            <p className='absolute top-[20px] right-5 cursor-pointer' onClick={togglePasswordVisibility}>
                                                {showPassword ? <IoEyeOutline size={22} /> : <IoEyeOffOutline size={22} />}
                                            </p>
                                        </div>
                                        {inputBlur.password && formData.password.length < 6 && (
                                            <p className='text-red-500 text-sm mt-1 select-none'>{passwordError}</p>
                                        )}
                                    </div>
                                    <ReCAPTCHA
                                        sitekey="6Le9ouEpAAAAAFRwgXd3W4s6t8FySSGJKKMWPm0C"
                                        onChange={onCaptchaChange}
                                    />
                                    {state === 'Login' ? <p className="text-right font-semibold cursor-pointer">{t('forgot password')}?</p> : <></>}
                                </div>
                                <button onClick={() => { state === 'Login' ? login() : signup() }} className="btn-primary bg-primary text-white border-none hover:border-none py-4 hover:bg-primary/80">
                                    {state === 'Login' ? t('continue') : t('become a member')}
                                </button>
                                <p className={`${state === 'Login' ? 'mt-12' : 'mt-6'} text-center`}>
                                    {state === 'Login' ? `${t('have not account')}?` : `${t('already have an account')}?`}{' '}
                                    {state === 'Login' ? 
                                        <span onClick={() => setState('Sign Up')} className="font-semibold cursor-pointer">{t('sign up')}</span>
                                    : 
                                        <span onClick={() => setState('Login')} className="font-semibold cursor-pointer">{t('login')}</span>
                                    }
                                    
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginSignup;
