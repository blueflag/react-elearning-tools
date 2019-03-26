//@flow
import Hock from 'stampy/lib/util/Hock';
import React from 'react';
import type {ElementRef} from 'react';
import type {Element} from 'react';
import Fullscreen from '../util/Fullscreen';


function toPercentage(a: number, b: number): number {
    return 100 * a / b;
}

function toFraction(a: number, b: number): number {
    return b * a / 100;
}

function round(num: number, place: number): number {
    //$FlowFixMe
    return Number(Math.round(num + `e${place}`) + `e-${place}`);
}

type Props = {
    autoPlay?: boolean,
    bufferInterval: number,
    videoRef?: Function,
    onChange?: Function
};

type State = {
    player: ?ElementRef<*>,
    progress: ?ElementRef<*>,
    component: *,
    fullscreen?: boolean,
    ended?: boolean,
    muted?: boolean,
    dragging?: boolean,
    paused: boolean,
    buffered?: number,
    duration: number,
    currentPercentage?: number,
    currentTime?: number
};

export default Hock({
    hock: () => (Component) => class PlayerHock extends React.PureComponent<Props, State> {
        bufferInterval: *;
        constructor(props: Props) {
            super(props);
            this.bufferInterval;
            this.state = {
                duration: 0,
                player: null,
                component: null,
                progress: null,
                ended: false,
                paused: !props.autoPlay
            };
        }
        componentWillUnmount() {
            clearInterval(this.bufferInterval);
        }
        getProgressRef = (progress: ElementRef<*>) => {
            if(progress){
                this.setState({progress}, this.startBuffer);
            }
        }
        getVideoRef = (player: ElementRef<*>) => {
            if(player) {
                this.props.videoRef && this.props.videoRef(player);
                this.setState({player}, this.startBuffer);
            }
        }
        getMainRef = (component: ElementRef<*>) => {
            if(component) {
                this.setState({component}, this.startBuffer);
            }
        }
        startBuffer = () => {
            const {player, progress, component} = this.state;
            if(player && progress && component) {
                player.addEventListener('loadedmetadata', this.onLoadMetaData);
                player.addEventListener("ended", this.onEnded);
            }
        }
        onLoadMetaData = () => {
            // update buffer
            this.bufferInterval = setInterval(this.onBuffer, this.props.bufferInterval || 150);
        }
        onBuffer = () => {
            var {player} = this.state;
            if (player && player.buffered.length > 0) {
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
            if(player && !this.state.paused && this.props.onChange) {
                if(this.state.currentPercentage === 100) {
                    this.setState({paused: true});
                }
                this.props.onChange({
                    ...this.state,
                    paused: player.paused
                });
            }
        }
        onPlay = () => {
            if(this.state.paused && this.state.player) {
                this.state.player.play();
            }
            this.setState({paused: false});
        }
        onPause = () => {
            this.state.player && this.state.player.pause();
            this.setState({paused: true});
        }
        onPlayPause = () => {
            this.state.paused ? this.onPlay() : this.onPause();
        }
        onMute = () => {
            const {player} = this.state;
            if(player) {
                player.muted = !player.muted;
                this.setState({muted: player.muted});
            }
        }
        onEnded = () => {
            this.props.onChange({
                ...this.state,
                ended: true
            });
        }
        onScrub = (ee: Object) => {
            if(this.state.progress) {
                var rect = this.state.progress.getBoundingClientRect();
                this.setState({dragging: true});
                this.onUpdatePosition(ee.clientX -  rect.left);

                document.addEventListener('mousemove', this.onScrubDrag, false);
                document.addEventListener('mouseup', this.onScrubEnd, false);
            }
        }
        onScrubDrag = (ee: Object) => {
            const {progress} = this.state;
            if(progress) {
                var rect = progress.getBoundingClientRect();
                var x = ee.clientX - rect.left;
                var width = progress.offsetWidth;

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
        }
        onScrubEnd = () => {
            this.setState({dragging: false});
            this.onPlay();
            document.removeEventListener('mousemove', this.onScrubDrag);
            document.removeEventListener('mouseup', this.onScrubEnd);
        }
        onUpdatePosition = (xPos: number) => {
            const {player, progress, duration} = this.state;
            if(player && progress) {
                const currentPercentage = toPercentage(xPos, progress.offsetWidth);
                const currentTime = toFraction(currentPercentage, duration);
                this.setState({currentPercentage, currentTime});
                player.currentTime = currentTime;
            }
        }
        onFullscreen = () => {
            if (Fullscreen.enabled) {
                if (Fullscreen.active()) {
                    Fullscreen.exit();
                    this.setState({fullscreen: false});
                } else {
                    if(this.state.component) {
                        Fullscreen.request(this.state.component);
                        this.setState({fullscreen: true});
                    }
                }
            }
        }

        render = (): Element<*> => {
            return (
                <Component
                    {...this.props}
                    {...this.state}
                    mainRef={this.getMainRef}
                    videoRef={this.getVideoRef}
                    progressRef={this.getProgressRef}
                    onPause={this.onPause}
                    onPlay={this.onPlay}
                    onPlayPause={this.onPlayPause}
                    onScrub={this.onScrub}
                    onFullscreen={this.onFullscreen}
                    onMute={this.onMute}
                />
            );
        }
    }
});
