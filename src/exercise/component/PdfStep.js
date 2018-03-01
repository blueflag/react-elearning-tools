//@flow
import React from 'react';
import type {Element} from 'react';

import {Document} from 'react-pdf/build/entry.webpack';
import {Page} from 'react-pdf';
import ElementQueryHock from 'stampy/lib/hock/ElementQueryHock';
import {Button, Box, Text} from 'obtuse';
import 'react-virtualized/styles.css';

type Props = {
    actions: Object,
    components: Object,
    eqWidth: ?number,
    file: string,
    step: Object
};

type State = {
    pdf?: Object,
    pdfError?: string,
    initialWidth: number,
    loading: boolean,
    scale: number,
    pageRatios: Map<number,number>
};

const EnableButton = ({enabled, modifier = '', ...props}: Object): Element<*> => {
    return <Button
        modifier={enabled ? modifier : `${modifier} disabled`}
        disabled={!enabled}
        {...props}
    />;
};

const PAGE_DEFAULT_COLUMN_MARGIN = 32;
const PAGE_DEFAULT_MAX_WIDTH = 1024;

class PdfStep extends React.PureComponent<Props, State> {

    constructor(props: Props) {
        super(props);

        let {page} = this.props.step.state;
        props.actions.onStepSetState({
            page: page || 1
        });

        this.state = {
            pdf: null,
            numPages: 0,
            loading: true,
            initialWidth: 0,
            scale: 1,
            pageRatios: new Map()
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

    onLoadSuccess = (pdf: Object) => {

        const promises = Array
            .from({length: pdf.numPages}, (vv, ii) => ii + 1)
            .map(pageNumber => pdf.getPage(pageNumber));

        let setPdfState = (values: Object[]) => {
            this.setState({
                pdf,
                loading: false,
                pageRatios: values
                    .filter(ii => ii)
                    .reduce(
                        (pageRatios: Map<number,number>, page: Object): Map<number,number> => {
                            /* eslint-disable no-unused-vars */
                            let [x,y,w,h] = page.pageInfo.view;
                            pageRatios.set(page.pageIndex + 1, h/w);
                            return pageRatios;
                        },
                        new Map()
                    )
            });
        };

        if(promises.length === 0) {
            return;
        }

        Promise
            .all(promises)
            .then(setPdfState)
            .catch(() => {});
    };

    onLoadError = (error: Object) => {
        this.setState({
            pdfError: `Error while loading PDF: ${error.message}`,
            loading: false
        });
    };

    onSourceError = (error: Object) => {
        this.setState({
            pdfError: `Error while finding PDF: ${error.message}`,
            loading: false
        });
    };

    zoom = (value: number) => () => {
        let scale = this.state.scale * value;
        this.setState({
            scale
        });
    };

    scaledWidth = () => this.state.initialWidth * this.state.scale;

    scaledHeight = (): number => {
        let {
            initialWidth,
            pageRatios,
            scale
        } = this.state;

        let {page} = this.props.step.state;
        let ratio = pageRatios.get(page) || 1;
        return initialWidth * scale * ratio;
    };

    hasNextPage = () => this.state.pdf && this.props.step.state.page < this.state.pdf.numPages;

    hasPrevPage = () => this.state.pdf && this.props.step.state.page > 1;

    onClickNextPage = () => {
        if(!this.hasNextPage()) {
            return;
        }

        const {page} = this.props.step.state;
        this.props.actions.onStepSetState({
            page: page + 1
        });
    };

    onClickPrevPage = () => {
        if(!this.hasPrevPage()) {
            return;
        }

        const {page} = this.props.step.state;
        this.props.actions.onStepSetState({
            page: page - 1
        });
    };

    onClickNextStep = () => {
        const {actions} = this.props;
        actions.onProgress(100);
        actions.onNext();
    };

    render(): Element<*> {
        const {loading, pdf, pdfError} = this.state;
        const {eqWidth, file} = this.props;
        const {page} = this.props.step.state;

        let width = this.scaledWidth();
        let height = this.scaledHeight();

        let {Loader} = this.props.components;

        return <Box spruceName="PdfStep">
            {eqWidth >= 640 &&
                <Box spruceName="PdfStep_zoom">
                    <Button spruceName="PdfStep_zoomButton" onClick={this.zoom(1.2)}>+</Button>
                    <Button spruceName="PdfStep_zoomButton" onClick={this.zoom(0.8)}>–</Button>
                </Box>
            }
            <Box className="PdfStep_document">
                <Document
                    file={file}
                    loading={null}
                    onLoadSuccess={this.onLoadSuccess}
                    onLoadError={this.onLoadError}
                    onSourceError={this.onSourceError}
                >
                    {pdf &&
                        <Box spruceName="PdfStep_page" style={{width, height}}>
                            <Page
                                pdf={pdf}
                                pageNumber={page}
                                width={width}
                            />
                        </Box>
                    }
                </Document>
            </Box>
            {loading && <Box><Loader>Loading PDF...</Loader></Box>}
            {pdfError && <Text element="div" modifier="center">{pdfError}</Text>}
            {pdf &&
                <Box spruceName="PdfStep_navigation">
                    <EnableButton modifier="sizeKilo secondary" onClick={this.onClickPrevPage} enabled={this.hasPrevPage()}>Prev</EnableButton>
                    <Text spruceName="PdfStep_navigationText">Page {page} of {pdf.numPages}</Text>
                    <EnableButton modifier="sizeKilo primary" onClick={this.onClickNextPage} enabled={this.hasNextPage()}>Next</EnableButton>
                </Box>
            }
            {pdf && !this.hasNextPage() &&
                <Text element="div" modifier="marginMega center">
                    <Button modifier="sizeMega primary" onClick={this.onClickNextStep}>I have read this document</Button>
                </Text>
            }
        </Box>;
    }
}

export default ElementQueryHock()(PdfStep);
