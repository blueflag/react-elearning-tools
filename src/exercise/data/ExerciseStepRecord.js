//@flow
import {Record} from 'immutable';

export default class ExerciseStepRecord extends Record({
    render: null,
    name: null,
    pathname: null,
    assess: true,
    progress: 0,
    score: 0,
    file: null,
    group: null,
    fileOneOf: null,
    type: null,
    quizRecord: null,
    passRate: 0,
    state: {}
}) {
    constructor(props: Object): ExerciseStepRecord {
        super(props);
        return this;
    }
    pass(): boolean {
        return this.score >= this.passRate;
    }
}
