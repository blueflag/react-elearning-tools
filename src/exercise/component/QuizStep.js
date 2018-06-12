//@flow
import React from 'react';
import type {Element} from 'react';
import Quiz from 'react-markdown-quiz/lib/Quiz';
import parseMarkdownQuiz from 'react-markdown-quiz/lib/parseMarkdownQuiz';
import {Box} from 'obtuse';
import Button from 'stampy/lib/component/Button';
import {Text} from 'obtuse';
import {Wrapper} from 'obtuse';
import Stopwatch from 'timer-stopwatch';
import moment from 'moment';
import {TableCell} from 'goose-css';

export default class QuizStep extends React.Component<Object, Object> {
    constructor(props: Object) {
        super(props);
        this.state = {
            quiz: null,
            answeredCount: 0,
            score: 0,
            gotoNumber: 0,
            resultPass: null,
            payload: null,
            viewResults: false,
            timer: new Stopwatch()
        };
    }
    componentWillMount(){
        this.setupQuiz(this.props);
    }
    componentWillReceiveProps(nextProps: Object) {
        if(nextProps.quiz !== this.props.quiz) {
            this.setupQuiz(nextProps);
        }
    }
    setupQuiz(thisProps: Object){
        const {actions} = this.props;
        if(thisProps.step.progress !== 100){
            this.state.timer.start();
            this.setState({
                quiz: this.getQuizSample(thisProps)
            });
            actions.onProgress(0);
        }
    }
    seedRandom = (seed: number): number => {
        var x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }
    getRandomInt = (min: number, max: number): number => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    getQuizSample = (props: Object): Object[] =>  {
        const randNum = this.getRandomInt(1,300);
        const {quiz, questions} = props;
        var batch = parseMarkdownQuiz(quiz);
        var number = questions ? questions : batch.length;
        return batch
            .map((value: Object, index: number): Object => {
                return {
                    value: value,
                    sorter: this.seedRandom(randNum + this.seedRandom(randNum + index))
                };
            })
            .sort((aa, bb) => aa.sorter - bb.sorter)
            .slice(0, number)
            .map(index => index.value);
    }
    onChange = (payload: Object) => {
        const {actions, step} = this.props;
        const {quiz} = this.state;
        if(step.progress < 100){
            const answeredCount = payload.reduce((count, item) => item.answer ? count + 1 : count, 0);
            const score = payload.reduce((count, item) => item.correct ? count + 1 : count, 0);
            
            // The progression is defined by the number of the questions and the sumbit button
            actions.onProgress(100 * (answeredCount/(quiz.length + 1)));

            this.setState({
                answeredCount,
                score,
                payload
            });
        }
    }
    onClick = () => {
        const {actions, scorm, step} = this.props;
        const {payload,score} = this.state;
        this.state.timer.stop;

        var quizFilter = [];
        var time = moment(this.state.timer.ms).format("mm:ss");
        var batch = {
            answers: payload,
            time: time
        };
        var result = score >= step.passRate;
        actions.onScore(score);
        actions.onAnswer(batch);
        payload.map((aa: Object): * => {
            if(!aa.correct){
                var bb = {
                    tt: aa.title,
                    rr: aa.refer
                };
                quizFilter.push(bb);
            }
        });
        if(scorm.assessEachQuiz){
            var filtered = this.props.value.steps.filter((aa: Object): * => {
                return aa.group === this.props.step.group;
            });
            var gotoNumber;
            this.props.value.steps.filter((aa: Object, bb: number): * => {
                var filteredJS  = filtered.get(0).toJS();
                if(filteredJS.name === aa.name){
                    gotoNumber = bb;
                }
            });
            this.setState({
                viewResults: true,
                resultPass: result,
                gotoNumber: gotoNumber
            });
            if(scorm.singleAttempt && !result){
                actions.onStepSetQuiz(quizFilter);
                actions.onEnd();
            }
        } else {
            if(result){
                actions.onProgress(100);
            }
            actions.onStepSetQuiz(quizFilter);
            actions.onNext();
        }
    }
    goBack = () => {
        const {actions,value} = this.props;
        actions.onSetResetPrevStep(true);
        actions.onProgress(0);
        if(this.state.gotoNumber === value.step){
            this.setState({viewResults: false});
            this.setupQuiz(this.props);
        } else {
            actions.onGoto(this.state.gotoNumber);
        }
    }
    printPage = () => {
        window.print();
    }
    onFinish = () => {
        this.setState({viewResults: false});
        this.props.actions.onProgress(100);
        this.props.actions.onNext();
    }
    render(): Element<*> {
        const {step} = this.props;
        const {answeredCount, quiz} = this.state;
        if(!this.state.viewResults){
            return <Wrapper>
                <Box>
                    <ul>
                        <li>You must select an answer for each question before you can submit.</li>
                        <li>{`Please note, you will need ${step.passRate} correct answers in order to pass this quiz. Good luck.`}</li>
                    </ul>
                </Box>
                <Box>
                    <Quiz onChange={this.onChange} quiz={quiz} />
                    {this.renderNextButton(answeredCount !== quiz.length)}
                </Box>
            </Wrapper>;
        } else {
            return <Wrapper>
                <Box>
                    <Text element="h1" modifier="block sizeGiga marginGiga center">
                    Quiz Review
                    </Text>
                    {this.renderReviewPage()}
                </Box>
            </Wrapper>;
        }
    }
    renderReviewPage = (): ?Element<*> => {
        if(this.state.resultPass){
            return <Box>
                <Text element="div" modifier="marginMega center">
                   Well done, you have passed this quiz.
                    <br/>
                   Please proceed to the next section.
                </Text>
                <Text element="div" modifier="marginMega center">
                    <Button modifier="sizeMega primary " onClick={this.onFinish}>
                        Proceed onward
                    </Button>
                </Text>
            </Box>;
        } else {
            return <Box>
                <Text element="div" modifier="marginMega center">
                   Unfortunately, you have not passed the quiz for this section.
                    <br/>
                   Please review before trying the quiz again.
                </Text>
                {this.renderReference()}
                <Text element="div" modifier="marginMega center">
                    <Button modifier="sizeMega primary " onClick={this.goBack}>
                        Try again
                    </Button>
                    <Button modifier="sizeMega primary " onClick={this.printPage}>
                        Print page
                    </Button>
                </Text>
            </Box>;
        }
    }
    renderReference = (): ?Element<*> =>{
        if(this.props.scorm.reference){        
            var list = this.state.payload.map((ii: Object, key: number): ?Element<*> => {
                if(!ii.correct){
                    return <tr className="Table_row Table_row-reference"  key={key}>
                        <TableCell modifier="padding header 50">
                            <div className="Markdown" dangerouslySetInnerHTML={{__html: ii.title}}/>
                        </TableCell>
                        <TableCell modifier="padding ">
                            {ii.refer}
                        </TableCell>
                    </tr>;
                }
            });
            return <Text element="div" modifier="marginMega center">
                <Text element="h2" modifier="block sizeMega marginGiga marginGigaTop center">
                    Incorrect Question/s & Recommendation
                </Text>
                <table className="Table">
                    <tbody>
                        {list}
                    </tbody>
                </table>
            </Text>;
        } else {
            return null;
        }
    }
    renderNextButton = (disabled: boolean): ?Element<*> => {
        return <Text element="div" modifier="marginMega center">
            <Button modifier="sizeMega primary " disabled={disabled} onClick={this.onClick}>Submit Answers
            </Button>
        </Text>;
    }
}
