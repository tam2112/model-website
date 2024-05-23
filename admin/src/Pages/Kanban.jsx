import React from 'react';
import { KanbanComponent, ColumnsDirective, ColumnDirective } from '@syncfusion/ej2-react-kanban';

import { kanbanData, kanbanGrid } from '../assets/dummy';
import { Header } from '../components';

const Kanban = ({ showSidebar }) => {
    return (
        <>
            <div className={`${showSidebar ? 'ml-[300px]' : 'ml-0'}`}>
                <div className="m-2 md:m-10 md:mt-4 mt-24 p-2 md:p-10 bg-white rounded-3xl">
                    <Header category="App" title="Kanban" />
                    <KanbanComponent
                        id="kanban"
                        dataSource={kanbanData}
                        cardSettings={{ contentField: 'Summary', headerField: 'Id' }}
                        keyField="Status"
                    >
                        <ColumnsDirective>
                            {kanbanGrid.map((item, index) => (
                                <ColumnDirective key={index} {...item} />
                            ))}
                        </ColumnsDirective>
                    </KanbanComponent>
                </div>
            </div>
        </>
    );
};

export default Kanban;
