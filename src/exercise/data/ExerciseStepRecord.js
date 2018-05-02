//@flow
import {Record} from 'immutable';

export default class ExerciseStepRecord extends Record({
    render: null,
    name: null,
    pathname: null,
    assess: true,
    progress: 0,
    score: null,
    file: null,
    type: null,
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
