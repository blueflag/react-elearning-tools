import {Record, List} from 'immutable';


export default class ExerciseStepRecord extends Record({
    render: null,
    name: null,
    pathname: null,
    progress: 0,
    score: 0,
    passRate: 0,
    pass: false
}) {
    constructor(props) {
        super(props);
        return this;
        // return this.set('pass', this.score >= this.passRate);
    }
}
