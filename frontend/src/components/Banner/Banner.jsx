import { Link } from 'react-router-dom';
import BannerImg from '../Assets/banner/banner1.png';

const Banner = () => {
    return (
        <>
            <div className='overflow-hidden'>
                <div className="container" data-aos='flip-up'>
                    <div className="bg-third lg:h-[400px] sm:h-[350px] h-[600px] overflow-hidden">
                        <div className="grid place-items-center grid-cols-1 sm:grid-cols-2 gap-8 h-full">
                            {/* Banner img */}
                            <>
                                <img
                                    src={BannerImg}
                                    alt=""
                                    className="object-cover lg:w-[300px] sm:w-[200px] w-[150px] scale-150 sm:translate-y-10 lg:translate-y-24 translate-y-12"
                                />
                            </>

                            {/* text content */}
                            <div className="sm:max-w-[300px] lg:max-w-[500px] space-y-6 px-4 sm:px-0 text-center sm:text-left">
                                <h1 className="text-3xl lg:text-5xl sm:text-4xl font-marcellus">About Clothes & TM</h1>
                                <p className="line-clamp-3 text-center sm:text-left">
                                    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magni repellat quae sunt
                                    accusamus itaque dicta temporibus non. Sapiente, tenetur veniam.
                                </p>
                                <div><Link to={'/kids'} className="btn-primary">Shop Now</Link></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Banner;
