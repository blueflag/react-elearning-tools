//@flow
import React from 'react';
import type {Element} from 'react';
import Quiz from 'react-markdown-quiz/lib/Quiz';
import {Box} from 'obtuse';
import {Wrapper} from 'obtuse';
import {Button} from 'stampy';
import Stopwatch from 'timer-stopwatch';
import moment from 'moment';

export default class QuizStep extends React.Component<Object, Object> {
    constructor(props: Object) {
        super(props);
        this.state = {
            answeredCount: 0,
            score: 0,
            payload: null,
            timer: new Stopwatch()
        };
    }
    componentDidMount(){
        this.state.timer.start();
    }

    onChange = (payload: Object) => {
        const {quiz, actions, step} = this.props;
        if(step.submitable){
            const answeredCount = payload.reduce((count, item) => item.answer ? count + 1 : count, 0);
            const score = (100 / quiz.length) * payload.reduce((count, item) => item.correct ? count + 1 : count, 0);

            actions.onProgress(100 / quiz.length + 1 * answeredCount);

            this.setState({
                answeredCount,
                score,
                payload
            });
        }

    }
    onClick = () => {
        const {actions,step} = this.props;
        const {passRate} = step;
        this.state.timer.stop;
        var time = moment(this.state.timer.ms).format("mm:ss");
        var batch = {
            answers: this.state.payload,
            time: time
        };
        if(this.state.score >= passRate){
            actions.onSetSubmitable(false);
        }
        actions.onScore(this.state.score);
        actions.onAnswer(batch);
        actions.onProgress(100);
        actions.onNext();
    }
    render(): Element<*> {
        const {quiz} = this.props;
        const {answeredCount} = this.state;
        return <Wrapper>
            <Box className="Document">
                <Quiz onChange={this.onChange} quiz={quiz} />
                {this.renderNextButton(answeredCount !== quiz.length)}
            </Box>
        </Wrapper>;
    }

    renderNextButton = (disabled: boolean): ?Element<*> => {
        if(this.props.step.submitable){
            return <Box modifier="marginMega">
                <Button modifier="sizeMega primary" disabled={disabled} onClick={this.onClick}>Submit Answers</Button>
            </Box>;
        }
        return null;
    }
}
