//@flow
import React from 'react';
import type {Element} from 'react';
import ElementQueryHock from 'stampy/lib/hock/ElementQueryHock';
import {Box, Text} from 'obtuse';
import Button from 'stampy/lib/component/Button';
import 'react-pdf/dist/Page/AnnotationLayer.css';

type Props = {
    actions: Object,
    value: Object,
    components: Object,
    eqWidth: ?number,
    file: string,
    step: Object
};

type State = {
    pdf: ?Object,
    pdfError: ?string,
    initialWidth: number,
    isFirstPageLandscape: boolean,
    loading: boolean,
    scale: number,
    pageRatios: Map<number,number>
};

class PdfStep extends React.PureComponent<Props, State> {

    constructor(props: Props) {
        super(props);

        let {page} = this.props.step.state;
        props.actions.onStepSetState({
            page: page || 1
        });

        this.state = {
            pdf: null,
            pdfError: null,
            numPages: 0,
            loading: true,
            initialWidth: 0,
            isFirstPageLandscape: false,
            scale: 1,
            pageRatios: new Map()
        };
    }

    componentWillReceiveProps(nextProps: Props) {
        // remember eqWidth once it exists
        // eqWidth is always undefined on first render and exists on second render
        if(nextProps.file !== this.props.file) {
            this.setState({
                loading: true
            });
        }
    }

    onRenderSuccess(){
        var links = document.querySelectorAll(".react-pdf__Page a");
        for(var i = 0; i < links.length; i++) {
            var elem = links[i];
            if (elem.addEventListener){
                elem.addEventListener('click', function (event: *) {
                    event.preventDefault();
                    window.open(event.target.href);
                });
            }
        }
    }


    onClickNextStep = () => {
        const {actions} = this.props;
        actions.onProgress(100);
        actions.onNext();
    };

    render(): Element<*> {
        const {pdf, pdfError} = this.state;
        const {eqWidth, file} = this.props;
        const {page} = this.props.step.state;

        const {CheckIcon} = this.props.components;

        let {Loader} = this.props.components;

        return <Box spruceName="PdfStep">
            <Box className="PdfStep_document" modifier="marginBottomMega">
                <iframe src={`viewer.html?file=${file}`} />

            </Box>
            <Text element="div" modifier="marginMega center">
                <Button modifier="sizeMega primary" onClick={this.onClickNextStep}>
                    <CheckIcon /> I have read this document.
                </Button>
            </Text>
        </Box>;
    }
}

export default ElementQueryHock()(PdfStep);
