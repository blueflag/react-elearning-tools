// @flow
import React from 'react';
import type {Element} from 'react';
import moment from 'moment';
import PlayerHock from '../hock/PlayerHock';
import {SpruceClassName, Button} from 'stampy';
import ProgressBar from './ProgressBar';

type Props = {
    autoPlay?: boolean,
    buffered: number,
    className?: string,
    component?: Object,
    currentPercentage: number,
    currentTime: number,
    duration?: number,
    fullscreen?: boolean,
    iconFullscreen: *,
    iconMute: *,
    iconPause: *,
    iconPlay: *,
    iconUnfullscreen: *,
    iconUnmute: *,
    muted?: boolean,
    mainRef: Function,
    videoRef: Function,
    progressRef: Function,
    onFullscreen?: Function,
    onMute?: Function,
    onPlayPause?: Function,
    onScrub: Function,
    paused?: boolean,
    player?: Object,
    poster?: string,
    src: string
};

class VideoPlayer extends React.PureComponent<Props> {

    static defaultProps = {
        iconFullscreen: () => <Button spruceName="VideoPlayer_button">⇱</Button>,
        iconMute: () => <Button spruceName="VideoPlayer_button">⊗</Button>,
        iconPause: () => <Button spruceName="VideoPlayer_button">‖</Button>,
        iconPlay: () => <Button spruceName="VideoPlayer_button">▶︎</Button>,
        iconUnfullscreen: () => <Button spruceName="VideoPlayer_button">↘︎</Button>,
        iconUnmute: () => <Button spruceName="VideoPlayer_button">⊙</Button>
    }

    render(): Element<*> {
        const {
            autoPlay,
            buffered,
            component,
            currentPercentage,
            currentTime,
            className,
            duration,
            fullscreen,
            iconFullscreen: IconFullscreen,
            iconMute: IconMute,
            iconPause: IconPause,
            iconPlay: IconPlay,
            iconUnfullscreen: IconUnfullscreen,
            iconUnmute: IconUnmute,
            muted,
            onFullscreen,
            onMute,
            onPlayPause,
            onScrub,
            paused,
            player,
            poster,
            src
        } = this.props;

        const classes = SpruceClassName({
            name: 'VideoPlayer',
            className,
            modifier: {
                paused,
                fullscreen
            }
        });

        var dd = moment.duration(duration, 'seconds');
        var tt = moment.duration(currentTime, 'seconds');
        var durationString = `${this.renderTime(tt)} / ${this.renderTime(dd)}`;

        var videoStyle = {};

        if (player && component) {  // setup video height.
            const videoHeight = player.videoHeight;
            const videoWidth = player.videoWidth;
            const wrapperHeight = component.offsetHeight;

            if (videoHeight > videoWidth) {
                if (videoHeight > wrapperHeight) {
                    videoStyle = {
                        height: wrapperHeight
                    };
                }
            }
        }

        return <div ref={this.props.mainRef} className={classes} tabIndex="0">
            <video
                autoPlay={autoPlay}
                className="VideoPlayer_video"
                ref={this.props.videoRef}
                onClick={onPlayPause}
                src={src}
                poster={poster}
                controls={false}
                style={videoStyle}
            >
                Sorry, your browser does not support embedded videos. <a href={src}>Download Instead</a>
            </video>
            <div className="VideoPlayer_controls">
                {this.renderControl(onMute, muted, IconMute, IconUnmute, 'right')}
                {this.renderControl(onFullscreen, fullscreen, IconUnfullscreen, IconFullscreen, 'right')}
                {this.renderControl(onPlayPause, paused, IconPlay, IconPause)}
                <span className="VideoPlayer_control">{durationString}</span>
                <ProgressBar
                    progressRef={this.props.progressRef}
                    onScrub={onScrub}
                    bars={[
                        {color: '#9c9c9c', value: buffered / 100},
                        {color: '#eb2136', value: currentPercentage / 100}
                    ]}
                />
            </div>
        </div>;
    }
    renderControl(onClick?: Function, bool?: boolean, TrueIcon: Object, FalseIcon: Object, modifier?: string): Element<*> {
        return <div className={SpruceClassName({name: "VideoPlayer_control", modifier})} onClick={onClick}>{bool ? <TrueIcon/> : <FalseIcon/>}</div>;
    }
    renderTime(duration: Object): string {
        return this.renderPadded(duration.minutes()) + ':' + this.renderPadded(duration.seconds());
    }
    renderPadded(number: number): string {
        return (number < 10) ? '0' + number : number.toString();
    }
}

export default PlayerHock()(VideoPlayer);
