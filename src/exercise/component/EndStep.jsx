//@flow
import React from 'react';
import type {Element} from 'react';
import {Text, Badge, Box, Wrapper} from 'obtuse';
import {TableCell} from 'goose-css';

class End extends React.Component<Object> {
    constructor(props: Object) {
        super(props);
        const {actions} = props;
        actions.onProgress(100);
    }
    componentWillReceiveProps(nextProps: Object) {
        const {actions} = nextProps;
        actions.onFinish(this.didPass(nextProps));
    }
    didPass = (props: Object): Object => {
        const {value} = props;
        const {masteryScore = 100} = props;

        const assessableSteps = value.steps.filter(ii => ii.assess);
        const passableSteps = assessableSteps.filter(ii => ii.passRate > 0);
        const scoreSteps = assessableSteps.filter(ii => ii.score !== null);

        // COMPLETED if all steps progress is 100%
        const completed = assessableSteps.reduce((count, item) => item.progress === 100 ? count + 1 : count, 0) === assessableSteps.size;

        // PASSED if steps passed as a percentage is greater than the mastery score
        const passed = (passableSteps.reduce((count, item) => item.pass() ? count + 1 : count, 0) / passableSteps.size * 100) >= masteryScore;

        // SCORE
        var scoreFilter = [];
        scoreSteps.map((item: Object) => {
            scoreFilter.push(item.score);
        });

        const add = (a, b) => a + b;

        var result = completed;
        var score = null;

        if(passableSteps.size !== 0) {
            result = completed && passed;
            score = scoreFilter.reduce(add);   
        }

        var batch = {
            result: result,
            score: score
        };

        return batch;
    }
    render(): Element<*> {
        const {value} = this.props;
        const {description = 'You have passed the learning Module.'} = this.props;
        const {failDescription = 'Unfortunately, you have not passed all the requirements of this training. Please reattempt this module.'} = this.props;
        const assessableSteps = value.steps.filter(ii => ii.assess);

        return <Wrapper modifier="small">
            <Box modifier="marginTopGiga">
                <Text modifier="block center sizeGiga marginGiga">{this.didPass(this.props).result ? "Congratulations!" : "Module Failed"}</Text>
                <Text modifier="block center marginGiga">{this.didPass(this.props).result ? description : failDescription}</Text>
            </Box>
            <table className="Table">
                <tbody>
                    {assessableSteps
                        .map((item: Object, key: number): Element<"tr"> => {
                            const {progress, name, passRate, score} = item;
                            const complete = (passRate > 0) ? item.pass() : progress === 100;

                            const completeModifier = complete ? 'boundedPositive' : 'boundedNegative';

                            return <tr className="Table_row" key={key}>
                                <TableCell modifier="padding header">{name} </TableCell>
                                <TableCell modifier="padding">{passRate > 0 && <span><Text>{score}%</Text></span>}</TableCell>
                                {passRate > 0
                                    ? <TableCell modifier="padding"><Badge modifier={`${completeModifier} solo`}>{complete ? 'Passed' : 'Failed'}</Badge></TableCell>
                                    : <TableCell modifier="padding"><Badge modifier={`${completeModifier} solo`}>{complete ? 'Complete': 'Incomplete'}</Badge></TableCell>
                                }
                            </tr>;
                        })
                        .toJS()}
                </tbody>
            </table>
        </Wrapper>;
    }
}

export default End;

