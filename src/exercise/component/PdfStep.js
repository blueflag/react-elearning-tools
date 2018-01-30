//@flow
import React from 'react';
import type {Element} from 'react';

import {Document} from 'react-pdf/build/entry.webpack';
import {Page} from 'react-pdf';
import {Button, Box} from 'obtuse';

export default class PdfStep extends React.Component<Object, Object> {
    state = {
        numPages: 0,
        loaded: false,
        scale: 1,
        pageNumber: 0
    }

    onDocumentLoad = ({numPages}: Object) => {
        this.setState({numPages, loaded: true});
    }
    onClick = () => {
        const {actions} = this.props;
        actions.onProgress(100);
        actions.onNext();
    }
    zoom = (value: number) => () => {
        this.setState(state => ({scale: Math.max(0.4, state.scale + value)}));
    }
    render(): Element<*> {
        const {numPages, loaded} = this.state;
        const {file} = this.props;

        const nextButton = <Box modifier="marginMega">
            <Button modifier="sizeMega primary" onClick={this.onClick}>I have read this document</Button>
        </Box>;

        return <Box>
            <Box modifier="fixed right" style={{zIndex: '1'}}>
                <Button spruceName="NavigationButton" onClick={this.zoom(0.2)}>+</Button>
                <Button spruceName="NavigationButton" onClick={this.zoom(-0.2)}>–</Button>
            </Box>
            <Box className="Document">
                <Document
                    file={file}
                    onLoadSuccess={this.onDocumentLoad}
                >
                    {Array.from(
                        new Array(numPages),
                        (el, index) => (
                            <Page
                                className="Document_page"
                                key={`page_${index + 1}`}
                                pageNumber={index + 1}
                                scale={this.state.scale}
                            />
                        ),
                    )}
                </Document>
                {loaded && nextButton}
            </Box>
        </Box>;
    }
}
