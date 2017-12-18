import React from 'react';
import VideoPlayer from '../../component/VideoPlayer';
import Quiz from 'react-markdown-quiz/lib/Quiz';
import {Box} from 'obtuse';
import {Wrapper} from 'obtuse';
import {Button} from 'stampy';

export default class QuizStep extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            answeredCount: 0,
            score: 0
        }
    }
    onChange = (payload) => {
        const {quiz, actions} = this.props;
        const answeredCount = payload.reduce((count, item) => item.answer ? count + 1 : count, 0);
        const score = (100 / quiz.length) * payload.reduce((count, item) => item.correct ? count + 1 : count, 0);

        actions.onScore(score);
        actions.onProgress(100 / quiz.length + 1 * answeredCount);

        this.setState({
            answeredCount
        });
    }
    onClick = () => {
        const {actions} = this.props;
        actions.onProgress(100);
        actions.onNext()
    }
    render() {
        const {file, actions, quiz, step} = this.props;
        const {answeredCount, score} = this.state;

        const nextButton = (disabled) => <Box modifier="marginMega">
            <Button modifier="sizeMega primary" disabled={disabled} onClick={this.onClick}>Submit Answers</Button>
        </Box>;

        return <Wrapper>
            <Box className="Document">
                <Quiz onChange={this.onChange} quiz={quiz} />
                {nextButton(answeredCount !== quiz.length)}
            </Box>
        </Wrapper>;
    }
}
