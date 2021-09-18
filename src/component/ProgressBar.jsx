//@flow
import React from 'react';
import type {Element} from 'react';

const StyleProgressBar = {
    backgroundColor: '#ccc',
    height: '1rem',
    position: 'relative',
    width: '100%'
};

const StyleProgressBar_bar = {
    height: '100%',
    position: 'absolute',
    transition: '160ms'
};

type Props = {
    progressRef: Function,
    onScrub: Function,
    bars: Array<Object>
};

export default class ProgressBar extends React.Component<Props> {
    render(): Element<"div"> {
        const {onScrub, bars, progressRef, className} = this.props;
        return <div ref={progressRef} className="ProgressBar" onMouseDown={onScrub} style={StyleProgressBar}>
            {bars.map((bar, key) => <div
                key={key}
                className={`ProgressBar_bar ${bar.className}`}
                style={{
                    ...StyleProgressBar_bar,
                    backgroundColor: bar.color, width: `${bar.value * 100}%`
                }}
            />)}
        </div>;
    }
}
