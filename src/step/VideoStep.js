import React from 'react';
import VideoPlayer from '../component/VideoPlayer';

export default class VideoStep extends React.Component {
    state = {
        complete: false,
        progress: 0
    }

    onChange = ({currentPercentage}) => {
        const progress = Math.floor(currentPercentage);
        if(progress !== this.state.progress) {
            this.setState({progress});
            this.props.actions.onProgress(progress);
        }
        if(progress === 100) {
            this.setState({complete: true});
        }
    }

    render() {
        const {file, actions} = this.props;
        return <div>
            <VideoPlayer autoPlay className="VideoModule" src={file} onChange={this.onChange}/>
            {this.state.complete && <button onClick={actions.onNext}>Continue</button>}
            {/*<div>{this.state.progress}</div>*/}
        </div>
    }
}
