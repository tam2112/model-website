import React from 'react';
import {
    AccumulationChartComponent,
    AccumulationSeriesCollectionDirective,
    AccumulationSeriesDirective,
    Inject,
    AccumulationLegend,
    AccumulationDataLabel,
    AccumulationTooltip,
    PyramidSeries,
    AccumulationSelection,
} from '@syncfusion/ej2-react-charts';

import { PyramidData } from '../../assets/dummy';
import { ChartsHeader } from '../../components';

const Pyramid = ({ showSidebar }) => {

    return (
        <>
            <div className={`${showSidebar ? 'ml-[300px]' : 'ml-0'} h-screen`}>
                <div className="m-4 md:m-10 md:mt-4 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
                    <ChartsHeader category="Pyramid" title="Food Comparison Chart" />
                    <div className="w-full">
                        <AccumulationChartComponent
                            id="pyramid-chart"
                            legendSettings={{ background: 'white' }}
                            tooltip={{ enable: true }}
                            background={'#FFF'}
                        >
                            <Inject
                                services={[
                                    AccumulationDataLabel,
                                    AccumulationTooltip,
                                    PyramidSeries,
                                    AccumulationLegend,
                                    AccumulationSelection,
                                ]}
                            />
                            <AccumulationSeriesCollectionDirective>
                                <AccumulationSeriesDirective
                                    name="Food"
                                    dataSource={PyramidData}
                                    xName="x"
                                    yName="y"
                                    type="Pyramid"
                                    width="45%"
                                    height="80%"
                                    neckWidth="15%"
                                    gapRatio={0.03}
                                    explode
                                    emptyPointSettings={{ mode: 'Drop', fill: 'red' }}
                                    dataLabel={{
                                        visible: true,
                                        position: 'Inside',
                                        name: 'Text',
                                    }}
                                />
                            </AccumulationSeriesCollectionDirective>
                        </AccumulationChartComponent>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Pyramid;
