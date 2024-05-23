import React from 'react';
import { BsCurrencyDollar } from 'react-icons/bs';
import { GoDotFill } from 'react-icons/go';
import { Stacked, Pie, SparkLine } from '../../components';
import { earningData, SparklineAreaData, ecomPieChartData } from '../../assets/dummy';

const Home = ({ showSidebar }) => {
    return (
        <>
            <div className={`${showSidebar ? 'ml-[300px]' : 'ml-0'}`}>
                <div className="mt-4 ml-6">
                    <div className="flex flex-wrap lg:flex-nowrap justify-center">
                        <div className="bg-white dark:text-gray-200 dark:bg-light-gray h-44 rounded-xl w-full lg:w-80 p-8 pt-9 m-3 bg-[url('https://media3.giphy.com/media/wjjvv8CEWSdAcdlgtP/200.webp?cid=ecf05e47wm1pr6wxcpyolz7javuxqm4k820yuetpcb8e42yo&ep=v1_gifs_search&rid=200.webp&ct=g')] bg-no-repeat bg-cover bg-center">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-gray-400">Earnings</p>
                                    <p className="text-2xl text-white">$63,448.78</p>
                                </div>
                            </div>
                            <div className="mt-6">
                                <button className='btn-primary bg-white rounded-md'>Download</button>
                            </div>
                        </div>
                        <div className="flex m-3 flex-wrap justify-center gap-1 items-center">
                            {earningData.map((item) => (
                                <div
                                    key={item.title}
                                    className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-4 pt-9 rounded-2xl md:w-56"
                                >
                                    <button
                                        type="button"
                                        style={{ color: item.iconColor, backgroundColor: item.iconBg }}
                                        className="text-2xl opacity-0.9 rounded-full p-4 hover:drop-shadow-xl"
                                    >
                                        {item.icon}
                                    </button>
                                    <p className="mt-3">
                                        <span className="text-lg font-semibold">{item.amount}</span>
                                        <span className={`text-sm text-${item.pcColor} ml-2`}>{item.percentage}</span>
                                    </p>
                                    <p className="text-sm text-gray-400 mt-1">{item.title}</p>
                                </div>
                            ))}
                        </div>
                    </div>
        
                    <div className="flex gap-10 flex-wrap justify-center">
                        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg m-3 p-4 rounded-2xl md:w-780">
                            <div className="flex justify-between">
                                <p className="font-semibold text-xl">Revenue Update</p>
                                <div className="flex items-center gap-4">
                                    <p className="flex items-center text-gray-600 hover:drop-shadow-xl">
                                        <span>
                                            <GoDotFill />
                                        </span>
                                        <span>Expense</span>
                                    </p>
                                    <p className="flex items-center text-green-400 hover:drop-shadow-xl">
                                        <span>
                                            <GoDotFill />
                                        </span>
                                        <span>Budget</span>
                                    </p>
                                </div>
                            </div>
                            <div className="mt-10 flex gap-10 flex-wrap justify-center">
                                <div className="border-r-1 border-color m-4 pr-10">
                                    <div>
                                        <p>
                                            <span className="text-3xl font-semibold">$93,438</span>
                                            <span className="p-1.5 hover:drop-shadow-xl cursor-pointer rounded-full text-white bg-green-400 ml-3 text-xs">
                                                23%
                                            </span>
                                        </p>
                                        <p className="text-gray-500 mt-1">Budget</p>
                                    </div>
                                    <div className="mt-8">
                                        <p>
                                            <span className="text-3xl font-semibold">$48,438</span>
                                        </p>
                                        <p className="text-gray-500 mt-1">Expense</p>
                                    </div>
        
                                    <div className="mt-5">
                                        <SparkLine
                                            id="line-sparkline"
                                            type="Line"
                                            height="80px"
                                            width="250px"
                                            data={SparklineAreaData}
                                        />
                                    </div>
        
                                    <div className="mt-10">
                                        <button className='btn-primary bg-white rounded-md px-8'>Download report</button>
                                    </div>
                                </div>
                                <div>
                                    <Stacked width="320px" height="360px" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
