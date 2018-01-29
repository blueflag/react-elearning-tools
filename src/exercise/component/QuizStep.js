import React from 'react';
import VideoPlayer from '../../component/VideoPlayer';
import Quiz from 'react-markdown-quiz/lib/Quiz';
import {Box} from 'obtuse';
import {Wrapper} from 'obtuse';
import {Button} from 'stampy';
import Stopwatch from 'timer-stopwatch';
import moment from 'moment';
import * as scorm from '../../scorm';

export default class QuizStep extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            answeredCount: 0,
            score: 0,
            payload: null,
            lessonStatus: scorm.status().val === "completed" || scorm.status().val === "passed",
            timer: new Stopwatch()
        }
    }
    componentDidMount(){
        this.state.timer.start();
    }

    onChange = (payload) => {
        if(!this.state.lessonStatus){
            const {quiz, actions} = this.props;
            const answeredCount = payload.reduce((count, item) => item.answer ? count + 1 : count, 0);
            const score = (100 / quiz.length) * payload.reduce((count, item) => item.correct ? count + 1 : count, 0);

            actions.onScore(score);
            actions.onProgress(100 / quiz.length + 1 * answeredCount);

            this.setState({
                answeredCount,
                payload
            });
        }
    }
    onClick = () => {
        const {quiz,actions} = this.props;
        this.state.timer.stop;
        var time = moment(this.state.timer.ms).format("mm:ss")
        actions.onAnswer(this.state.payload,time);
        actions.onProgress(100);
        actions.onNext()
    }
    render() {
        const {file, actions, quiz, step} = this.props;
        const {answeredCount, score, timer} = this.state;
        return <Wrapper>
            <Box className="Document">
                <Quiz onChange={this.onChange} quiz={quiz} />
                {this.renderNextButton(answeredCount !== quiz.length)}
            </Box>
        </Wrapper>;
    }

    renderNextButton(disabled) {
        if(!this.state.lessonStatus){
            return <Box modifier="marginMega">
                <Button modifier="sizeMega primary" disabled={disabled} onClick={this.onClick}>Submit Answers</Button>
            </Box>
        }
    }
}
