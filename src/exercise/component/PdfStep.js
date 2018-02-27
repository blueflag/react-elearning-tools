//@flow
import React from 'react';
import type {Element} from 'react';

import {Document} from 'react-pdf/build/entry.webpack';
import {List, WindowScroller} from 'react-virtualized';
import ElementQueryHock from 'stampy/lib/hock/ElementQueryHock';
import {Page} from 'react-pdf';
import {Button, Box, Text} from 'obtuse';
import 'react-virtualized/styles.css'; // move this to sass file

type Props = {
    components: Object,
    file: string
};

type State = {
    pdf: ?Object,
    pageRatios?: Map,
    currentPage: number,
    loaded: boolean,
    scale: number
};

class PdfStep extends React.PureComponent<Props, State> {
    state = {
        pdf: null,
        pageRatios: null,
        currentPage: 0,
        loaded: false,
        scale: 1
    }

    componentWillReceiveProps(nextProps: Props) {
        if(this.props.eqWidth !== nextProps.eqWidth) {
            this.virtualizedListRef && this.virtualizedListRef.recomputeRowHeights();
        }
    }

    onDocumentLoad = (pdf: Object) => {
        const promises = Array
            .from({length: pdf.numPages}, (vv, ii) => ii + 1)
            .map(pageNumber => pdf.getPage(pageNumber));

        let setPdfState = (values: number[]) => {
            this.setState({
                pdf,
                loaded: true,
                pageRatios: values
                    .reduce((map: Map, page: number): Map => {
                        /* eslint-disable no-unused-vars */
                        let [x,y,w,h] = page.pageInfo.view;
                        map.set(page.pageIndex, h/w);
                        return map;
                    }, new Map())
            });
        };

        if(promises.length === 0) {
            return;
        }

        promises[0]
            .then(value => [value])
            .then(setPdfState);

        Promise
            .all(promises)
            .then(setPdfState);
    }

    onClick = () => {
        const {actions} = this.props;
        actions.onProgress(100);
        actions.onNext();
    };

    zoom = (value: number) => () => {
        let scale = this.state.scale + value;
        if(scale < 0.4) {
            return;
        }
        this.setState(
            {scale},
            () => this.virtualizedListRef.recomputeRowHeights()
        );
    };

    rowHeight = ({index}: Object): number => {
        let {eqWidth} = this.props;
        let {pageRatios, scale} = this.state;
        return (pageRatios.get(index) || pageRatios.get(0)) * eqWidth * scale;
    };

    rowRenderer = ({key, index, style}: Object): Element<*> => {
        let {eqWidth} = this.props;
        return <div style={style} key={key}>
            <Page
                pdf={this.state.pdf}
                pageNumber={index + 1}
                width={eqWidth * this.state.scale}
            />
        </div>;
    };

    render(): Element<*> {
        const {pdf, loaded} = this.state;
        const {eqWidth, file} = this.props;
        let {Loader} = this.props.components;

        const nextButton = <Text element="div" modifier="marginMega center">
            <Button modifier="sizeMega primary" onClick={this.onClick}>I have read this document</Button>
        </Text>;

        const loading = <Box spruceName="Document_loader"><Loader>Loading PDF...</Loader></Box>;

        return <Box>
            <Box modifier="fixed right" style={{zIndex: '1'}}>
                <Button spruceName="NavigationButton" onClick={this.zoom(0.2)}>+</Button>
                <Button spruceName="NavigationButton" onClick={this.zoom(-0.2)}>–</Button>
            </Box>
            <Box>
                <Document
                    file={file}
                    loading={loading}
                    onLoadSuccess={this.onDocumentLoad}
                >
                    {loaded &&
                        <WindowScroller>
                            {({height, isScrolling, onChildScroll, scrollTop}: Object): Element<*> => {
                                return <List
                                    autoHeight
                                    height={height}
                                    isScrolling={isScrolling}
                                    onScroll={onChildScroll}
                                    rowCount={pdf.numPages}
                                    rowHeight={this.rowHeight}
                                    overscanRowCount={3}
                                    rowRenderer={this.rowRenderer}
                                    scrollTop={scrollTop}
                                    style={{outline: "none"}}
                                    width={eqWidth * 2}
                                    ref={ref => this.virtualizedListRef = ref}
                                />;
                            }}
                        </WindowScroller>
                    }
                </Document>
                {loaded && nextButton}
            </Box>
        </Box>;
    }
}

export default ElementQueryHock()(PdfStep);
