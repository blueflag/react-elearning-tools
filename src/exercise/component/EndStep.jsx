import React from 'react';
import {connect} from 'react-redux';
import {List, Map} from 'immutable';
import {Record} from 'immutable';
import ScormDevelopmentRuntime from '../../ScormDevelopmentRuntime';
import ScormLogger from '../../ScormLogger';
import * as scorm from '../../scorm';

import {Text, Badge, Box, Wrapper} from 'obtuse';

class End extends React.Component {
    constructor(props) {
        super(props);
        const {value, passRate, actions} = props;
        actions.onProgress(100);
        actions.onFinish(this.didPass(), value.score);
    }
    didPass = () => {
        const {value, passRate} = this.props;
        return value.steps.reduce((count, item) => item.pass || item.passRate === 0  ? count + 1 : count, 0) === value.steps.size;
    }
    render() {
        const {value} = this.props;

        return <Wrapper modifier="small">
            <Text modifier="block center sizeGiga marginGiga">{this.didPass() ? 'Congratulations! You have passed this learning Module' : 'Ouch.'}</Text>
            <table className="Table">
                <thead>
                    <tr>
                        <th className="Table_headCell">Step</th>
                        <th className="Table_headCell">Score</th>
                        <th className="Table_headCell">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {value.steps
                        .filter(item => item.name !== 'End')
                        .map(({progress, name, pass, passRate, score}, key) => {
                            const complete = (passRate > 0) ? pass : progress === 100;

                            const completeModifier = complete ? 'success' : 'failure';

                            return <tr className="Table_row" key={key}>
                                <td className="Table_cell">{name} </td>
                                <td className="Table_cell">{passRate > 0 && <span><Text numberFormat="0.0">{score}</Text> / {passRate}</span>}</td>
                                {passRate > 0
                                    ? <td className="Table_cell"><Badge modifier={`${completeModifier} solo`}>{complete ? 'Passed' : 'Failed'}</Badge></td>
                                    : <td className="Table_cell"><Badge modifier={`${completeModifier} solo`}>{complete ? 'Complete': 'Incomplete'}</Badge></td>
                                }
                            </tr>
                        })
                        .toJS()}
                </tbody>
            </table>
        </Wrapper>;
    }
}

export default End;
