import {ConfigureHock} from 'stampy';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Fullscreen from '../util/Fullscreen';
import PureComponent from '../util/PureComponent';


function toPercentage(a, b) {
    return 100 * a / b;
}

function toFraction(a, b) {
    return b * a / 100;
}

function round(num, place) {
    return Number(Math.round(num + `e${place}`) + `e-${place}`);
}

export default ConfigureHock(
    (config) => (Component) => class PlayerHock extends React.PureComponent {
        static propTypes = {
            bufferInterval: PropTypes.number
        }
        constructor(props) {
            super(props);
            this.bufferInterval;
            this.state = {
                player: null,
                component: null,
                progress: null,
                paused: !props.autoPlay
            };
        }
        componentWillUnmount() {
            clearInterval(this.bufferInterval);
        }
        getProgressRef = (progress) => {
            if(progress){
                this.setState({progress: ReactDOM.findDOMNode(progress)}, this.startBuffer)
            }
        }
        getVideoRef = (player) => {
            if(player) {
                this.setState({player}, this.startBuffer)
            }
        }
        getMainRef = (component) => {
            if(component) {
                this.setState({component: ReactDOM.findDOMNode(component)}, this.startBuffer)
            }
        }
        startBuffer = () => {
            const {player, progress, component} = this.state;
            if(player && progress && component) {
                player.addEventListener('loadedmetadata', this.onLoadMetaData);
            }
        }
        onLoadMetaData = (ee) => {
            // update buffer
            this.bufferInterval = setInterval(this.onBuffer, this.props.bufferInterval || 150);
        }
        onBuffer: Function = () => {
            var {player} = this.state;
            if (player.buffered.length > 0) {
                const currentBuffer = player.buffered.end(0);
                const perc = toPercentage(currentBuffer, player.duration);
                const timePercentage = toPercentage(player.currentTime, player.duration);

                if (!this.state.dragging) {
                    this.setState({
                        buffered: perc,
                        duration: player.duration,
                        currentPercentage: round(timePercentage, 2),
                        currentTime: round(player.currentTime, 2)
                    });
                }
            }
            if(!this.state.paused && this.props.onChange) {
                if(this.state.currentPercentage === 100) {
                    this.setState({paused: true});
                }
                this.props.onChange({
                    ...this.state,
                    paused: player.paused
                });
            }
        }
        onPlay: Function = () => {
            if(this.state.paused) {
                this.state.player.play();
            }
            this.setState({paused: false});
        }
        onPause: Function = () => {
            this.state.player.pause();
            this.setState({paused: true});
        }
        onPlayPause: Function = () => {
            this.state.paused ? this.onPlay() : this.onPause();
        }
        onMute: Function = () => {
            this.state.player.muted = !this.state.player.muted;
            this.setState({muted: this.state.player.muted});
        }
        onScrub: Function = (e) => {
            var rect = this.state.progress.getBoundingClientRect();
            this.setState({dragging: true});
            this.onUpdatePosition(e.clientX -  rect.left);

            document.addEventListener('mousemove', this.onScrubDrag, false);
            document.addEventListener('mouseup', this.onScrubEnd, false);
        }
        onScrubDrag: Function = (e) => {
            var rect = this.state.progress.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var width = this.state.progress.offsetWidth;

            // Stay within video bounds
            if (x >= 0 && x <= width) {
                this.onUpdatePosition(x);
            }
            // Over
            else if (x >= width) {
                this.onUpdatePosition(width);
            }
            // Under
            else {
                this.onUpdatePosition(0);
            }
        }
        onScrubEnd: Function = () => {
            this.setState({dragging: false});
            this.onPlay();
            document.removeEventListener('mousemove', this.onScrubDrag);
            document.removeEventListener('mouseup', this.onScrubEnd);
        }
        onUpdatePosition: Function = (xPos) => {
            var perc = toPercentage(xPos, this.state.progress.offsetWidth);
            this.setState({
                currentPercentage: perc,
                currentTime: toFraction(perc, this.state.duration)
            });

            this.state.player.currentTime = toFraction(perc, this.state.duration);
        }
        onFullscreen: Function = () => {
            if (Fullscreen.enabled) {
                if (Fullscreen.active()) {
                    Fullscreen.exit();
                    this.setState({fullscreen: false});
                } else {
                    Fullscreen.request(this.state.component);
                    this.setState({fullscreen: true});
                }
            }
        }

        render: Function = () => {
            return (
                <Component
                    {...this.props}
                    {...this.state}
                    ref={this.getMainRef}
                    videoRef={this.getVideoRef}
                    progressRef={this.getProgressRef}
                    onPlayPause={this.onPlayPause}
                    onScrub={this.onScrub}
                    onFullscreen={this.onFullscreen}
                    onMute={this.onMute}
                />
            );
        }
    }
);
