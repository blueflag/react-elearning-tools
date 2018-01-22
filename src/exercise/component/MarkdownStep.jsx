import React from 'react';
import {Markdown} from 'react-showdown';
import {Text, Badge, Box, Wrapper} from 'obtuse';
import {Button} from 'goose-css';

class MarkdownStep extends React.Component {
    onClick = () => {
        const {actions} = this.props;
        actions.onProgress(100);
        actions.onNext();
    }
    render() {
        const {file} = this.props;

        return <Wrapper modifier="small">
            <Box style={{paddingTop: '1rem'}} modifier="paddingMega marginRow" className="Typography">
                <Markdown markup={file} />
            </Box>
            <Box className="Document">
                <Button modifier="sizeMega primary" onClick={this.onClick}>I have read this document</Button>
            </Box>
        </Wrapper>;
    }
}

export default MarkdownStep;
