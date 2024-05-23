import React from 'react';
import {
    ChartComponent,
    SeriesCollectionDirective,
    SeriesDirective,
    Inject,
    DateTime,
    Legend,
    SplineAreaSeries,
} from '@syncfusion/ej2-react-charts';

import { ChartsHeader } from '../../components';
import { areaCustomSeries, areaPrimaryXAxis, areaPrimaryYAxis } from '../../assets/dummy';

const Area = ({ showSidebar }) => {

    return (
        <>
            <div className={`${showSidebar ? 'ml-[300px]' : 'ml-0'} h-screen`}>
                <div className="m-4 md:m-10 md:mt-4 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
                    <ChartsHeader category="Line" title="Inflation Rate" />
                    <ChartComponent
                        id="area-chart"
                        height="420px"
                        primaryXAxis={areaPrimaryXAxis}
                        primaryYAxis={areaPrimaryYAxis}
                        chartArea={{ border: { width: 0 } }}
                        tooltip={{ enable: true }}
                        background={'#FFF'}
                        legendSettings={{ background: 'white' }}
                    >
                        <Inject services={[DateTime, Legend, SplineAreaSeries]} />
                        <SeriesCollectionDirective>
                            {areaCustomSeries.map((item, index) => (
                                <SeriesDirective key={index} {...item} />
                            ))}
                        </SeriesCollectionDirective>
                    </ChartComponent>
                </div>
            </div>
        </>
    );
};

export default Area;
