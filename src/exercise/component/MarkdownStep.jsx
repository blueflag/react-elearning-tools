//@flow
import React from 'react';
import type {Element} from 'react';
import {Markdown} from 'react-showdown';
import {Box, Wrapper} from 'obtuse';
import {Button} from 'goose-css';

class MarkdownStep extends React.Component<Object> {
    onClick = () => {
        const {actions} = this.props;
        actions.onProgress(100);
        actions.onNext();
    }
    render(): Element<*> {
        const {file} = this.props;
        const {CheckIcon} = this.props.components;
        return <Wrapper modifier="small">
            <Box style={{paddingTop: '1rem'}} modifier="paddingMega marginRow" className="Typography">
                <Markdown markup={file} />
            </Box>
            <Box>
                <Button modifier="sizeMega primary" onClick={this.onClick}>
                    <CheckIcon /> I have read this document.
                </Button>
            </Box>
        </Wrapper>;
    }
}

export default MarkdownStep;
