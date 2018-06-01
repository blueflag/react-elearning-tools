//@flow
import {Record} from 'immutable';
import {List} from 'immutable';
import ExerciseStepRecord from './ExerciseStepRecord';

export default class ExerciseRecord extends Record({
    pathname: null,
    step: 0,
    resetPreviousStep: false,
    steps: List()
}) {
    constructor(props: Object): ExerciseRecord {
        super(props);
        return this
            .update('steps', steps => List(steps).map(item => new ExerciseStepRecord(item)))
        ;
    }
    addSteps(payload: Array<*>): ExerciseRecord {
        return this
            .update('steps', () => List(payload).map(item => new ExerciseStepRecord(item)))
        ;
    }
}
