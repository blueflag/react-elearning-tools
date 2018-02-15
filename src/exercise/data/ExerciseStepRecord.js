//@flow
import {Record} from 'immutable';

export default class ExerciseStepRecord extends Record({
    render: null,
    name: null,
    pathname: null,
    assess: true,
    progress: 0,
    score: null,
    submitable: true,
    file: null,
    scoreString: null, //Step specific represenation of the score    
    type: null,
    passRate: 0
}) {
    constructor(props: Object): ExerciseStepRecord {
        super(props);
        return this;
    }
    pass(): boolean {
        return this.score >= this.passRate;
    }
}
