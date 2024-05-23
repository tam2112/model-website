import React from 'react';

import { ChartsHeader, LineChart } from '../../components';

const Line = ({ showSidebar }) => {
    return (
        <>
            <div className={`${showSidebar ? 'ml-[300px]' : 'ml-0'} h-screen`}>
                <div className="m-4 md:m-10 md:mt-4 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
                    <ChartsHeader category="Line" title="Inflation Rate" />
                    <div className="w-full">
                        <LineChart />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Line;
