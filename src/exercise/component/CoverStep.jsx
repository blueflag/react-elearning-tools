import React from 'react';
import {connect} from 'react-redux';
import {List, Map} from 'immutable';
import {Record} from 'immutable';
import {Text, Badge, Box, Wrapper} from 'obtuse';
import {Button} from 'goose-css';

class CoverStep extends React.Component {
    onClick = () => {
        const {actions} = this.props;
        actions.onProgress(100);
        actions.onNext();
    }
    render() {
        const {value} = this.props;
        const {title} = this.props;
        const {description} = this.props;
        const {file} = this.props;
        const {actions} = this.props;

        return <Wrapper modifier="small">
            <Box modifier="paddingRowMega">
                {file && <img src={file} alt={title} style={{width: '100%'}} />}
                <Text element="h1" modifier="block sizeGiga marginGiga center">{title}</Text>
                <Text element="p" modifier="block">{description}</Text>
                <Box modifier="marginMega" style={{textAlign: 'center'}}>
                    <Button modifier="sizeMega primary" onClick={this.onClick}>Begin the module</Button>
                </Box>
            </Box>
        </Wrapper>;
    }
}

export default CoverStep;
