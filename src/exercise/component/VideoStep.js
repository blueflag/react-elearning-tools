//@flow
import React from 'react';
import type {Element} from 'react';
import VideoPlayer from '../../component/VideoPlayer';
import {Button} from 'goose-css';
import {Box} from 'goose-css';
import {Overlay} from 'goose-css';
import {OverlayContent} from 'goose-css';

export default class VideoStep extends React.Component<Object, Object> {
    state = {
        complete: false,
        progress: 0
    }
    videoRef: Object;
    constructor(props: Object) {
        super(props);
        this.state = {
            complete: false,
            progress: props.step.progress
        };
    }
    onNext = () => {
        const {actions} = this.props;
        actions.onNext();
    }
    componentWillReceiveProps(nextProps: Object) {
        if(nextProps.file !== this.props.file) {
            this.onReset();
        }
    }
    onReset = () => {
        this.videoLoad();
        this.setState({
            complete: false,
            progress: 0
        });
    }

    videoLoad = () => {
        this.videoRef.load();
    }

    onChange = ({currentPercentage, ended}: Object) => {
        const {step, actions} = this.props;
        var progress = Math.floor(currentPercentage);
        if(ended) {
            progress = 100;
            this.setState({complete: true});
        }

        if(progress !== this.state.progress) {
            this.setState({progress});
            if(step.progress < progress) {
                actions.onProgress(progress);
            }
        }

    }

    render(): Element<*> {
        const {file} = this.props;
        const nextButton = <Overlay modifier="marginMega">
            <OverlayContent className="VideoStep_overlayContent">
                <Button modifier="sizeMega primary" className="VideoStep_button" onClick={this.onReset}>Watch Again</Button>
                <Button modifier="sizeMega primary" className="VideoStep_button" onClick={this.onNext}>Continue</Button>
            </OverlayContent>
        </Overlay>;

        return <Box className="VideoStep">
            <VideoPlayer className="VideoStep_videoPlayer" videoRef={(VideoPlayer: *) => { this.videoRef = VideoPlayer; }} src={file} onChange={this.onChange} complete={this.state.complete} >
                {this.state.complete && nextButton}
            </VideoPlayer>
        </Box>;
    }
}
