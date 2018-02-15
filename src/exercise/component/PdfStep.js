//@flow
import React from 'react';
import type {Element} from 'react';

import {Document} from 'react-pdf/build/entry.webpack';
import {Page} from 'react-pdf';
import {Button, Box, Text} from 'obtuse';

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
        const {numPages, loaded, scale} = this.state;
        const {file} = this.props;

        const nextButton = <Text element="div" modifier="marginMega center">
            <Button modifier="sizeMega primary" onClick={this.onClick}>I have read this document</Button>
        </Text>;
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
                            <Page key={`page_${index + 1}`}
                                className="Document_page"
                                pageNumber={index + 1}
                                scale={scale}
                            >
                                {this.props.loader}
                            </Page>
                        ),
                    )}
                </Document>
                {loaded && nextButton}
            </Box>
        </Box>;
    }
}
