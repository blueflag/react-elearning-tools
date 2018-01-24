 import React from 'react';
 import VideoPlayer from '../../component/VideoPlayer';
 import {Button} from 'goose-css';
 import {Box} from 'goose-css';
 import {Overlay} from 'goose-css';
 import {OverlayContent} from 'goose-css';
 
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
 
     onNext = () => {
         const {actions} = this.props;
         actions.onNext();
     }
 
     onReset = () => {
         const {actions} = this.props;
         this.videoLoad();
         this.setState({complete: false});
     }

     videoLoad = ()  => {
        this.videoRef.load();
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
 
         const nextButton = <Overlay modifier="marginMega">
             <OverlayContent className="VideoStep_overlayContent">
                 <Button modifier="sizeMega primary" className="VideoStep_button" onClick={this.onReset}>Watch Again</Button>
                 <Button modifier="sizeMega primary" className="VideoStep_button" onClick={this.onNext}>Continue</Button>
             </OverlayContent>
         </Overlay>;
 
         return <Box className="Document">
            {this.state.complete && nextButton}
            <VideoPlayer autoPlay className="VideoStep_videoPlayer" videoRef={(VideoPlayer) => { this.videoRef = VideoPlayer; }} src={file} onChange={this.onChange}/>
         </Box>
     }
 }
