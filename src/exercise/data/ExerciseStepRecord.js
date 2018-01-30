import {Record, List} from 'immutable';


export default class ExerciseStepRecord extends Record({
    render: null,
    name: null,
    pathname: null,
    assess: true,
    progress: 0,
    score: null,
    submitable: true,
    passRate: 0
}) {
    constructor(props) {
        super(props);
        return this;
        // return this.set('pass', this.score >= this.passRate);
    }

    pass() {
        return this.score >= this.passRate;
    }
}
