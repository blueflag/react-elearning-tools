//@flow
import React from 'react';
import type {Element} from 'react';
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
    pdfOpened: boolean
};

class PdfStepMobile extends React.PureComponent<Props, State> {

    constructor(props: Props) {
        super(props);

        let {page} = this.props.step.state;
        props.actions.onStepSetState({
            page: page || 1
        });

        this.state = {
            pdfOpened: false
        };
    }

    componentWillReceiveProps(nextProps: Object) {
        if(nextProps !== this.props) {
            if(this.props.step.progress === 100){
                this.setState({
                    pdfOpened: true
                });
            }
        }
    }

    openPDF = () => {
        this.setState({
            pdfOpened: true
        });
        window.open(this.props.file, "_blank");
    };

    onClickNextStep = () => {
        const {actions} = this.props;
        actions.onProgress(100);
        actions.onNext();
    };

    render(): Element<*> {
        return <Box spruceName="PdfStep">
            <Box className="PdfStep_document">
                <Text element="p" modifier="block center">
                    We have detected that you are using a mobile device. <br/>You can view the PDF document by clicking on the button below. <br/> Once you have read the document, please navigate back to this page to continue the module.
                </Text>
            </Box>
            <Text element="div" modifier="marginMega center">
                <Box>
                    <Button modifier="sizeMega primary" onClick={this.openPDF}>Open PDF</Button>
                </Box>
                {this.renderNextButton()}
            </Text>
        </Box>;
    }

    renderNextButton(): ?Element<*> {
        const {CheckIcon} = this.props.components;
        if(this.state.pdfOpened){
            return <Button modifier="sizeMega primary" onClick={this.onClickNextStep}>
                <CheckIcon />  I have read this document.
            </Button>;
        } else {
            return null;
        }
    }
}

export default PdfStepMobile;
