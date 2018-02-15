//@flow
import React from 'react';
import type {Element} from 'react';
import Quiz from 'react-markdown-quiz/lib/Quiz';
import parseMarkdownQuiz from 'react-markdown-quiz/lib/parseMarkdownQuiz';
import {Box} from 'obtuse';
import {Text} from 'obtuse';
import {Wrapper} from 'obtuse';
import {Button} from 'stampy';
import Stopwatch from 'timer-stopwatch';
import moment from 'moment';

export default class QuizStep extends React.Component<Object, Object> {
    constructor(props: Object) {
        super(props);
        this.state = {
            quiz: null,
            answeredCount: 0,
            score: 0,
            payload: null,
            timer: new Stopwatch()
        };
    }
    componentWillMount(){
        this.state.timer.start();
        this.setState({
            quiz: this.getQuizSample(this.props)
        });
    }
    componentWillReceiveProps(nextProps: Object) {
        if(nextProps.quiz !== this.props.quiz) {
            this.state.timer.start();
            this.setState({
                quiz: this.getQuizSample(nextProps)
            });
        }
    }
    seedRandom = (seed: number): number => {
        var x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }
    getQuizSample = (data: Object): Object[] =>  {
        const TODAY = (new Date()).getDate();
        const {quiz, questions} = data;
        var batch = parseMarkdownQuiz(quiz);
        var number = questions ? questions : batch.length;
        return batch
            .map((value: Object, index: number): Object => {
                return {
                    value: value,
                    sorter: this.seedRandom(TODAY + this.seedRandom(TODAY + index))
                };
            })
            .sort((aa, bb) => aa.sorter - bb.sorter)
            .slice(0, number)
            .map(index => index.value);
    }
    onChange = (payload: Object) => {
        const {actions, step} = this.props;
        const {quiz} = this.state;
        if(step.submitable){
            const answeredCount = payload.reduce((count, item) => item.answer ? count + 1 : count, 0);
            const score = payload.reduce((count, item) => item.correct ? count + 1 : count, 0);

            actions.onProgress(100 / quiz.length + 1 * answeredCount);

            this.setState({
                answeredCount,
                score,
                payload
            });
        }
    }
    onClick = () => {
        const {actions} = this.props;
        const {score,quiz} = this.state;
        this.state.timer.stop;
        var time = moment(this.state.timer.ms).format("mm:ss");
        var batch = {
            answers: this.state.payload,
            time: time
        };
        var results = {
            score: score,
            length: quiz.length
        };

        actions.onSetSubmitable(false);
        actions.onScore(this.state.score);
        actions.onScoreString(results);
        actions.onAnswer(batch);
        actions.onProgress(100);
        actions.onNext();
    }  
    render(): Element<*> {
        const {step} = this.props;
        const {answeredCount, quiz} = this.state;
        return <Wrapper>
            <Box className="Document">
                <h3>Welcome To The Quiz.</h3>
                <ul>
                    <li>You must select an answer for each question before you can submit.</li>
                    <li>{`Please note, you will need ${step.passRate} correct answers in order to pass this quiz. Good luck.`}</li>
                </ul>
            </Box>
            <Box className="Document">
                <Quiz onChange={this.onChange} quiz={quiz} />
                {this.renderNextButton(answeredCount !== quiz.length || !step.submitable)}
            </Box>
        </Wrapper>;
    }

    renderNextButton = (disabled: boolean): ?Element<*> => {
        return <Text element="div" modifier="marginMega center">
            <Button modifier="sizeMega primary " disabled={disabled} onClick={this.onClick}>{this.props.step.submitable ? "Submit Answers" : "Submitted"}</Button>
        </Text>;
    }
}
