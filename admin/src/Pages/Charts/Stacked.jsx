import React from 'react';

import { ChartsHeader, Stacked as StackedChart } from '../../components';

const Stacked = ({ showSidebar }) => {
    return (
        <>
            <div className={`${showSidebar ? 'ml-[300px]' : 'ml-0'} h-screen`}>
                <div className="m-4 md:m-10 md:mt-4 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
                    <ChartsHeader category="Stacked" title="Revenue Breakdown" />
                    <div className="w-full">
                        <StackedChart />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Stacked;
