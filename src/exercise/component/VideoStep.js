import React from 'react';
import VideoPlayer from '../../component/VideoPlayer';
import {Button, Box} from 'obtuse';

export default class VideoStep extends React.Component {
    state = {
        complete: false,
        progress: 0
    }

    constructor(props) {
        super(props);
        this.state = {
            complete: props.step.progress === 100,
            progress: props.step.progress
        }
    }

    onClick = () => {
        const {actions} = this.props;
        actions.onNext();
    }

    onChange = ({currentPercentage}) => {
        const {step, actions} = this.props;
        const progress = Math.floor(currentPercentage);
        if(progress !== this.state.progress) {
            this.setState({progress});
            if(step.progress < progress) {
                actions.onProgress(progress);
            }
        }
        if(progress === 100) {
            this.setState({complete: true});
        }
    }

    render() {
        const {file, actions} = this.props;

        const nextButton = <Box modifier="marginMega">
            <Button modifier="sizeMega primary" onClick={this.onClick}>Continue</Button>
        </Box>;

        return <Box className="Document">
            {this.state.complete && nextButton}
            <VideoPlayer autoPlay className="VideoModule" src={file} onChange={this.onChange}/>
        </Box>
    }
}
