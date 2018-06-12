//@flow
import React from 'react';
import type {Element} from 'react';
import {Document} from 'react-pdf';
import {Page} from 'react-pdf';
import MobileDetect from 'mobile-detect';
import ElementQueryHock from 'stampy/lib/hock/ElementQueryHock';
import {Box, Text} from 'obtuse';
import Button from 'stampy/lib/component/Button';

type Props = {
    actions: Object,
    value: Object,
    components: Object,
    file: string,
    step: Object
};

type State = {
    pdf: ?Object,
    loading: boolean,
};

const PAGE_DEFAULT_COLUMN_MARGIN = 32;
const PAGE_DEFAULT_MAX_WIDTH = 1024;

class PdfStepMobile extends React.PureComponent<Props, State> {

    constructor(props: Props) {
        super(props);

        let {page} = this.props.step.state;
        props.actions.onStepSetState({
            page: page || 1
        });

        this.state = {
            pdf: null,
            loading: true,
            pdfOpened: false
        };
    }

    componentWillReceiveProps(nextProps: Object) {
        if(nextProps !== this.props) {
            if(this.props.step.progress === 100){
                this.state = {
                    pdfOpened: true
                };
            }
        }
    }

    openPDF = () => {
        this.setState({
            pdfOpened: true
        });
        window.open(this.props.file, "_blank")
    };

    onClickNextStep = () => {
        const {actions} = this.props;
        actions.onProgress(100);
        actions.onNext();
    };

    render(): Element<*> {
        const {loading, pdf, mobileDetect} = this.state;
        const {file} = this.props;

        return <Box spruceName="PdfStep">
            <Box className="PdfStep_document">
                <Text element="p" modifier="block center">
                    The module has detected that you are using a mobile device. <br/>You can view the PDF document by clicking on the button below. <br/> Once you have read the document, please navigate back to this page to continue the module.
                </Text>
            </Box>
           <Text element="div" modifier="marginMega center">
                <Box>
                    <Button modifier="sizeMega primary" onClick={this.openPDF}>Open PDF</Button>
                </Box>
                {this.renderNextButton()}
            </Text>
        </Box>
    }

    renderNextButton(): Element<*> {
        if(this.state.pdfOpened){
            return <Button modifier="sizeMega primary" onClick={this.onClickNextStep}>I have read this document</Button>
        } else {
            return null
        }
    }
}

export default ElementQueryHock()(PdfStepMobile);
