//@flow
import React from 'react';
import type {Element} from 'react';
import {Text} from 'goose-css';
import {Box} from 'goose-css';
import {Wrapper} from 'goose-css';
import {Button} from 'goose-css';
import {Markdown} from 'react-showdown';

type Props = {
    actions: Object,
    description?: string,
    file?: string,
    title?: string
};

class CoverStep extends React.Component<Props> {
    onClick = () => {
        const {actions} = this.props;
        actions.onProgress(100);
        actions.onNext();
    }
    render(): Element<*> {
        const {description} = this.props;
        const {file} = this.props;
        const {title} = this.props;

        return <Wrapper modifier="small">
            <Box modifier="marginTopGiga">
                {file && <Box modifier="paddingRowMega marginTopGiga"><img src={file} alt={title} style={{width: '100%'}} /></Box>}
                <Text element="h1" modifier="block sizeGiga marginGiga center">{title}</Text>
                <Text element="p" modifier="block center"><Markdown markup={description} /></Text>
                <Box modifier="marginMega" style={{textAlign: 'center'}}>
                    <Button modifier="sizeMega primary" onClick={this.onClick}>Begin Module</Button>
                </Box>
            </Box>
        </Wrapper>;
    }
}

export default CoverStep;
