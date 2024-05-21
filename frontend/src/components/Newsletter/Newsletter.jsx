import { useTranslation } from "react-i18next";

const Newsletter = () => {
    const { t } = useTranslation();

    return (
        <>
            <div className="py-14" data-aos='zoom-in'>
                <div className="container">
                    <div className="bg-primary flex justify-between flex-wrap lg:flex-nowrap items-center sm:p-32 rounded-md p-12">
                        {/* Sign up to our newsletter */}
                        <div className="flex flex-col sm:justify-center items-center text-white text-center space-y-6 w-full">
                            <h3 className="font-bold text-white uppercase lg:text-3xl text-2xl">
                                {t('sign up newsletter')}
                            </h3>
                            <p className="text-sm">Lorem ipsum dolor sit.</p>
                            <button className="btn-primary bg-white inline-block text-primary w-[250px] h-[60px] md:w-[220px] hover:border-2 hover:border-white hover:text-white">
                                {t('subscribe')}
                            </button>
                        </div>

                        <div className="hidden lg:block border-[1px] h-[200px] border-white/30 mx-24"></div>

                        <div className="lg:hidden block border-[1px] w-[450px] h-[1px] border-white/30 my-24"></div>

                        {/* News */}
                        <div className="flex flex-col justify-center items-center text-white text-center space-y-6 w-full">
                            <h3 className="font-bold text-white uppercase lg:text-3xl text-2xl">{t('news')}</h3>
                            <p>Lorem ipsum dolor sit olor sit.</p>
                            <button className="btn-primary border-2 border-white w-[250px] h-[60px] md:w-[220px] hover:bg-white hover:text-primary">
                                {t('subscribe')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Newsletter;
