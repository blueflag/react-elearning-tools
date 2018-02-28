//@flow
import React from 'react';
import type {Element} from 'react';

import {Document} from 'react-pdf/build/entry.webpack';
import {List, WindowScroller} from 'react-virtualized';
import ElementQueryHock from 'stampy/lib/hock/ElementQueryHock';
import {Page} from 'react-pdf';
import {Button, Box, Text} from 'obtuse';
import 'react-virtualized/styles.css';

type Props = {
    actions: Object,
    components: Object,
    eqWidth: ?number,
    file: string
};

type State = {
    pdf: ?Object,
    pageRatios: Map<number, number>,
    pageRatiosTotal: number,
    currentPage: number,
    initialWidth: number,
    loaded: boolean,
    scale: number
};

const PAGE_MARGIN_RATIO = 1.1;
const PAGE_DEFAULT_COLUMN_MARGIN = 32;
const PAGE_DEFAULT_MAX_WIDTH = 1000;

class PdfStep extends React.PureComponent<Props, State> {

    listHeight: number = 0;
    scrollProgress: number = 0;
    virtualizedListRef: *;

    constructor(props: Props) {
        super(props);
        this.state = {
            pdf: null,
            pageRatios: new Map(),
            pageRatiosTotal: 0,
            currentPage: 0,
            loaded: false,
            initialWidth: 0,
            scale: 1
        };
    }

    componentWillReceiveProps(nextProps: Props) {
        // remember eqWidth once it exists
        // eqWidth is always undefined on first render and exists on second render
        if(!this.state.initialWidth && nextProps.eqWidth) {
            this.setState({
                initialWidth: Math.min(nextProps.eqWidth - PAGE_DEFAULT_COLUMN_MARGIN, PAGE_DEFAULT_MAX_WIDTH)
            });
        }
    }

    // gets the width of the pdf in pixels with the scale (zoom) applied
    scaledWidth = (): number => {
        return this.state.initialWidth * this.state.scale;
    };

    // gets the total height of the document in pixels including all margins
    totalHeight = (): number => {
        return this.state.pageRatiosTotal * this.scaledWidth() * PAGE_MARGIN_RATIO;
    };

    // converts scrollTop (pixels scrolled from top of page) to progress (number between 0 and 1 indicating how far through the scroll position is)
    scrollTopToProgress = (scrollTop: number): number => {
        return scrollTop / (this.totalHeight() - this.listHeight);
    };

    // converts progress (number between 0 and 1 indicating how far through the scroll position is) to scrollTop (pixels scrolled from top of page)
    progressToScrollTop = (progress: number): number => {
        return progress * (this.totalHeight() - this.listHeight);
    };

    onDocumentLoad = (pdf: Object) => {
        const promises = Array
            .from({length: pdf.numPages}, (vv, ii) => ii + 1)
            .map(pageNumber => pdf.getPage(pageNumber));

        let setPdfState = (inputValues: Object|Object[]) => {
            let isSingle = !Array.isArray(inputValues);
            let values: Object[] = [].concat(inputValues);

            let reduced = values.reduce(
                (obj: Object, page: Object): Object => {
                    /* eslint-disable no-unused-vars */
                    let [x,y,w,h] = page.pageInfo.view;
                    let ratio = h/w;
                    obj.pageRatios.set(page.pageIndex, ratio);
                    obj.pageRatiosTotal += ratio;
                    return obj;
                },
                {
                    pageRatios: new Map(),
                    pageRatiosTotal: 0
                }
            );

            let {pageRatios, pageRatiosTotal} = reduced;

            // if passed a single value, extrapolate pageRatiosTotal
            if(isSingle) {
                pageRatiosTotal *= promises.length;
            }

            this.setState({
                pdf,
                loaded: true,
                pageRatios,
                pageRatiosTotal
            });
        };

        if(promises.length === 0) {
            return;
        }

        // get first page and assume all pages have that height
        // so we get some estimated values as soon as possible
        promises[0]
            .then(setPdfState);

        // wait for all pages and calculate page heights properly
        Promise
            .all(promises)
            .then(setPdfState);
    }

    zoom = (value: number) => () => {
        let scale = this.state.scale * value;
        this.setState(
            {
                scale
            },
            () => {
                let {virtualizedListRef} = this;
                if(!virtualizedListRef) {
                    return;
                }
                // recompute row heights and retain scroll progress
                virtualizedListRef.recomputeRowHeights();
                let scrollTop = this.progressToScrollTop(this.scrollProgress);
                virtualizedListRef.scrollToPosition(scrollTop);
            }
        );
    };

    rowHeight = ({index}: Object): number => {
        let {pageRatios, scale} = this.state;
        // pageRatios is filled async as pages are loaded
        // so use height of first page for any page that hasn't got a ratio yet
        let pageRatio: number = pageRatios.get(index) || pageRatios.get(0) || 0;
        return pageRatio * this.scaledWidth() * PAGE_MARGIN_RATIO;
    };

    rowRenderer = ({key, index, style}: Object): Element<*> => {
        let {components, eqWidth} = this.props;
        let width = this.scaledWidth();

        return <Box style={style} key={key}>
            <Box style={{width}} spruceName="PdfStep_page">
                <Page
                    pdf={this.state.pdf}
                    pageNumber={index + 1}
                    width={width}
                />
            </Box>
        </Box>;
    };

    onRowsRendered = ({startIndex, stopIndex}: Object) => {
        // callback that receives visible pages
        // possible analytics opportunity goes here
    };

    onScroll = ({scrollTop}: Object) => {
        this.scrollProgress = this.scrollTopToProgress(scrollTop);
    };

    onClickNext = () => {
        const {actions} = this.props;
        actions.onProgress(100);
        actions.onNext();
    };

    render(): Element<*> {
        const {pdf, loaded} = this.state;
        const {eqWidth, file} = this.props;
        let scaledWidth = this.scaledWidth();

        let {Loader} = this.props.components;
        const loading = <Box><Loader>Loading PDF...</Loader></Box>;

        const nextButton = <Text element="div" modifier="marginMega center">
            <Button modifier="sizeMega primary" onClick={this.onClickNext}>I have read this document</Button>
        </Text>;

        return <Box spruceName="PdfStep">
            {eqWidth && eqWidth >= 640 &&
                <Box spruceName="PdfStep_zoom">
                    <Button spruceName="PdfStep_zoomButton" onClick={this.zoom(1.2)}>+</Button>
                    <Button spruceName="PdfStep_zoomButton" onClick={this.zoom(0.8)}>–</Button>
                </Box>
            }
            {eqWidth &&
                <Box spruceName="PdfStep_document" style={{width: eqWidth}}>
                    <Document
                        file={file}
                        loading={loading}
                        onLoadSuccess={this.onDocumentLoad}
                    >
                        {loaded && pdf &&
                            <WindowScroller onScroll={this.onScroll}>
                                {({height, isScrolling, onChildScroll, scrollTop}: Object): Element<*> => {
                                    // setting this.listHeight in render because WindowScroller.onResize() doesn't fire on initial render
                                    this.listHeight = height;

                                    return <List
                                        autoHeight
                                        height={height}
                                        isScrolling={isScrolling}
                                        onScroll={onChildScroll}
                                        rowCount={pdf.numPages}
                                        rowHeight={this.rowHeight}
                                        overscanRowCount={3}
                                        rowRenderer={this.rowRenderer}
                                        onRowsRendered={this.onRowsRendered}
                                        scrollTop={scrollTop}
                                        width={Math.max(scaledWidth, eqWidth)}
                                        ref={ref => this.virtualizedListRef = ref}
                                        className="PdfStep_list"
                                    />;
                                }}
                            </WindowScroller>
                        }
                    </Document>
                </Box>
            }
            {loaded && nextButton}
        </Box>;
    }
}

export default ElementQueryHock()(PdfStep);
