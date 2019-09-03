//@flow
import React from 'react';
import type {Element} from 'react';
import {Text, Badge, Box, Wrapper} from 'obtuse';
import {TableCell} from 'goose-css';
import Button from 'stampy/lib/component/Button';

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
    printPage = () => {
        window.print();
    }
    checkReview = (): ?Element<*> => {
        const {scorm} = this.props;
        const {result} = this.didPass(this.props);
        if(scorm.assessEachQuiz){
            if(scorm.singleAttempt){
                if(scorm.reference && !result){
                    return this.renderReview();
                } else {
                    return null;
                }
            } else {
                return null;
            }
        } else {
            if(scorm.reference){
                return this.renderReview();
            } else {
                return null;
            }
        }
    }
    renderReview = (): ?Element<*> => {
        const {value} = this.props;
        var table = value.steps
            .filter(aa => aa.quizRecord)
            .map((ii: Object, key: number): ?Element<*> => {
                var list = ii.quizRecord.map((dd: Object, ee: number): ?Element<*> => {
                    return <tr className="Table_row Table_row-reference Table_row-borders"  key={ee}>
                        <TableCell modifier="padding header 50">
                            <div className="Markdown" dangerouslySetInnerHTML={{__html: dd.tt}}/>
                        </TableCell>
                        <TableCell modifier="padding ">
                            <div className="Markdown" dangerouslySetInnerHTML={{__html: dd.rr}}/>
                        </TableCell>
                    </tr>;
                });
                return <table className="Table marginBottom4" key={key}>
                    <tbody>
                        <tr className="Table_row Table_row-reference">
                            <TableCell modifier="padding header">
                                {ii.name}
                            </TableCell>
                        </tr>
                        {list}
                    </tbody>
                </table>;
            });
        return <Text element="div" modifier="marginMega center">
            <Text element="div" modifier="marginGiga">
                <Button modifier="sizeMega primary " onClick={this.printPage}>
                    Print page
                </Button>
            </Text>
            <Text element="h2" modifier="block sizeMega marginGiga center">
                Incorrect Question/s & Recommendation
            </Text>
            {table}
        </Text>;
    }
    render(): Element<*> {
        const {value, scorm, isMobile} = this.props;
        const {description = 'You have passed the learning Module.'} = this.props;
        const {failDescription = 'Unfortunately, you have not passed all of the requirements for this training.'} = this.props;
        const {failDescriptionExtended = 'To gain successful completion, please re-attempt this Module by clicking on the "Back to previous page" button located on the bottom left of this screen. This will take you to the Course Page where you can click on the "Go to Content" button, enabling you to re-launch the Module.'} = this.props;
        const assessableSteps = value.steps.filter(ii => ii.assess);
        const {result} = this.didPass(this.props);
        return <Wrapper modifier="small">
            <Box modifier="marginTopGiga">
                <Text modifier="block center sizeGiga marginGiga">{this.didPass(this.props).result ? "Congratulations!" : "Module Failed"}</Text>
                <Text modifier="block center marginGiga">{result ? description : failDescription}</Text>
                {!result && <Text modifier="block center marginGiga">{failDescriptionExtended}</Text>}
            </Box>
            <Box modifier="borderBottom paddingRowMega">
                <table className="Table ">
                    <tbody>
                        {assessableSteps
                            .map((item: Object, key: number): Element<"tr"> => {
                                const {progress, name, passRate, score, type, file} = item;
                                const complete = (passRate > 0) ? item.pass() : progress === 100;
                                const completeModifier = complete ? 'positive' : 'negative';
                                const downloadPDFButton = (type === "document" && scorm.downloadPDF && !isMobile) ? this.renderDocumentHeader(name,file) : null;
                                return <tr className="Table_row"  key={key}>
                                    <TableCell modifier="padding header">{name} </TableCell>
                                    <TableCell modifier="padding">{downloadPDFButton}</TableCell>
                                    <TableCell modifier="padding">{passRate > 0 && <span>Your Score: {score}</span>}</TableCell>
                                    <TableCell modifier="padding">{passRate > 0 && <span>Required: {passRate}</span>}</TableCell>
                                    {passRate > 0 && score > 0
                                        ? <TableCell modifier="padding"><Badge modifier={`${completeModifier} bounded`}>{complete ? 'Passed' : 'Failed'}</Badge></TableCell>
                                        : <TableCell modifier="padding"><Badge modifier={`${completeModifier} bounded`}>{complete ? 'Complete': 'Incomplete'}</Badge></TableCell>
                                    }
                                </tr>;
                            })
                            .toJS()}
                    </tbody>
                </table>
            </Box>
            {this.checkReview()}
        </Wrapper>;
    }

    renderDocumentHeader(name: string, file: string): Element<*>{
        let download = `./${file}`;
        return <a href={download} target="_blank" rel="noopener noreferrer" className="Button Button-secondary ">Download PDF</a>;
    }

}

export default End;

