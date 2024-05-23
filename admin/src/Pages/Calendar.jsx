import React from 'react';
import {
    ScheduleComponent,
    Day,
    Week,
    WorkWeek,
    Month,
    Agenda,
    Inject,
    Resize,
    DragAndDrop,
} from '@syncfusion/ej2-react-schedule';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';

import { scheduleData } from '../assets/dummy';
import { Header } from '../components';

const Calendar = ({ showSidebar }) => {
    return (
        <>
            <div className={`${showSidebar ? 'ml-[300px]' : 'ml-0'} overflow-hidden`}>
                <div className="m-2 md:m-10 md:mt-4 mt-24 p-2 md:p-10 bg-white rounded-3xl">
                    <Header category="App" title="Calendar" />
                    <ScheduleComponent
                        height="650px"
                        eventSettings={{ dataSource: scheduleData }}
                        selectedDate={new Date(2021, 0, 10)}
                    >
                        <Inject services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]} />
                    </ScheduleComponent>
                </div>
            </div>
        </>
    );
};

export default Calendar;
