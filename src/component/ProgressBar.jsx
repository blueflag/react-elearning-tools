import React from 'react';

const StyleProgressBar = {
    backgroundColor: '#ccc',
    height: '1rem',
    position: 'relative',
    width: '100%'
}

const StyleProgressBar_bar = {
    height: '100%',
    position: 'absolute',
    transition: '160ms'
}

export default class ProgressBar extends React.Component {
    render(props: Object): React.Element<any> {
        const {onScrub, bars} = this.props;
        return <div className="ProgressBar" onMouseDown={onScrub} style={StyleProgressBar}>
            {bars.map((bar, key) => <div
                key={key}
                className="ProgressBar_bar"
                style={{
                    ...StyleProgressBar_bar,
                    backgroundColor: bar.color, width: `${bar.value * 100}%`
                }}
            />)}
        </div>;
    }
}

ProgressBar.defaultProps = {
    spruceName: 'ProgressBar'
};


