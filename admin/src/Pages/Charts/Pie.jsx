import React from 'react';

import { pieChartData } from '../../assets/dummy';
import { ChartsHeader, Pie as PieChart } from '../../components';

const Pie = ({ showSidebar }) => {
    return (
        <>
            <div className={`${showSidebar ? 'ml-[300px]' : 'ml-0'} h-screen`}>
                <div className="m-4 md:m-10 md:mt-4 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
                    <ChartsHeader category="Pie" title="Project Cost Breakdown" />
                    <div className="w-full">
                        <PieChart id="chart-pie" data={pieChartData} legendVisibility height="full" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Pie;
