import {Record, List} from 'immutable';
import ExerciseStepRecord from './ExerciseStepRecord';

function toStepRecord(item) {
    return new ExerciseStepRecord(item);
}

export default class ExerciseRecord extends Record({
    pathname: null,
    step: 0,
    steps: List()
}) {
    constructor(props) {
        super(props);
        return this
            .update('steps', steps => List(steps).map(toStepRecord))
        ;
    }
    addSteps(payload) {
        return this
            .update('steps', steps => List(payload).map(toStepRecord))
        ;
    }
}
