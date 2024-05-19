import { Link } from 'react-router-dom';
import HeroImg from '../Assets/hero/hero_image.png';
import HeroImg2 from '../Assets/hero/hero_image2.png';

const Hero = () => {
    return (
        <>
            <div className="py-10 pt-24 overflow-hidden">
                <div className="container">
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 lg:pb-0 pb-4 space-y-6 sm:space-y-0">
                        {/* first col */}
                        <div className="sm:col-span-3 space-y-6">
                            <div className="bg-third grid place-items-center h-[76%] rounded-sm" data-aos='fade-right'>
                                <img src={HeroImg} alt="" className="w-[46%] object-cover" data-aos='zoom-in' />
                            </div>
                            <h1 className="font-bold lg:text-6xl sm:text-5xl text-4xl text-primary max-w-[600px] font-marcellus" data-aos='fade-up'>
                                Elevate Your Look With Our Clothes.
                            </h1>
                        </div>

                        {/* second col */}
                        <div className="sm:col-span-2 space-y-6">
                            <div className="bg-third grid place-items-center h-[76%] rounded-sm" data-aos='fade-left'>
                                <img src={HeroImg2} alt="" className="w-[60%] sm:w-[77%] object-cover" data-aos='zoom-in' />
                            </div>
                            <p className="truncate" data-aos='fade-up'>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit nisi aliquam tempore
                                consequuntur rem nostrum molestiae inventore nulla libero rerum?
                            </p>
                            <div data-aos='fade-up' data-aos-offset='0'>
                                <Link to={'/men'} className="btn-primary">Shop Now</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Hero;
