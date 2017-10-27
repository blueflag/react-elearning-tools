import React from 'react';
import {Box} from 'obtuse';
import {Button, SpruceClassName} from 'stampy';


class ExerciseNavigation extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const {value, actions} = this.props;
        return <Box spruceName="ExerciseNavigation">
            {value.steps
                .map((step, index) => {
                    const complete = step.progress === 100;
                    const previousComplete = value.steps.getIn([index - 1, 'progress']) === 100 || index < value.step;

                    const modifier = String()
                        .concat(complete ? 'complete' : '')
                        .concat(value.step === index ? ' active' : '')
                        .concat(previousComplete ? ' current' : '')

                    return <Box
                        key={index}
                        onClick={complete || previousComplete ? () => actions.onGoto(index) : null}
                        className={SpruceClassName({name: "ExerciseNavigation_step", modifier})}>{step.name}</Box>
                })
                .toJS()}
        </Box>
    }
}

export default ExerciseNavigation;
