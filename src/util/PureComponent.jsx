// @flow
import React from 'react';
import {fromJS, List, is, Set} from 'immutable';

const css = 'color: #9a55da;';

function logger(first: any, ...rest: Array<any>) {
    console.log.apply(console, [`%c${first}`, css, ...rest]);
}


function PureComponentDecorator(propsToCheck: ?string[] = null , options: Object = {}): * {

    const log = options.debug
        ? logger
        // eslint-disable-next-line
        : (...args: Array<any>) => {};

    return class PureComponent extends React.Component {
        state: Object;
        constructor(props: Object) {
            super(props);
            this.state = {};
        }
        shouldComponentUpdate(nextProps: Object, nextState: Object): boolean {
            const checkStrictEquality = (name) => this.props[name] === nextProps[name];
            const checkDeepEquality = (name) => is(fromJS(this.props[name]), fromJS(nextProps[name]));


            const propsSet = Set(Object.keys(nextProps));
            const isSet = Set(propsToCheck || []);
            const remainingSet = propsSet.subtract(isSet);

            // check remaining props by strict equality then
            // check chosen props by deep equality
            let render = !remainingSet.every(checkStrictEquality) || !isSet.every(checkDeepEquality);


            let stateRender = false;

            if(this.state && this.state !== nextState) {
                stateRender = true;
            }

            let result = render || stateRender;

            if(options.debug) {
                let groupStart = result ? console.group : console.groupCollapsed;

                groupStart(`%c[PureComponent ${this.constructor.name}]`, css, result);

                if(stateRender) {
                    log(`this.state !== nextState`);
                }

                Object
                    .keys(nextProps)
                    .map((key: string) => {
                        if(this.props[key] !== nextProps[key]) {
                            log(`${key}`, this.props[key], '!==', nextProps[key]);
                        }
                    });
                List(propsToCheck || [])
                    .map((key: string) => {
                        const deepEqual = is(fromJS(this.props[key]), fromJS(nextProps[key]));
                        log(`${key}`, this.props[key], deepEqual ? 'is ' : '!is', nextProps[key]);
                    });
                console.groupEnd();
            }

            return result;
        }
    };
}

export default PureComponentDecorator;
