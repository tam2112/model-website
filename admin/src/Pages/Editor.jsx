import React from 'react';
import {
    HtmlEditor,
    Image,
    Inject,
    Link,
    QuickToolbar,
    RichTextEditorComponent,
    Toolbar,
} from '@syncfusion/ej2-react-richtexteditor';

import { Header } from '../components';

const Editor = ({ showSidebar }) => {
    return (
        <>
            <div className={`${showSidebar ? 'ml-[300px]' : 'ml-0'}`}>
                <div className="m-2 md:m-10 md:mt-4 mt-24 p-2 md:p-10 bg-white rounded-3xl">
                    <Header category="App" title="Editor" />
                    <RichTextEditorComponent>
                        <Inject services={[HtmlEditor, Toolbar, Image, Link, QuickToolbar]} />
                    </RichTextEditorComponent>
                </div>
            </div>
        </>
    );
};

export default Editor;
