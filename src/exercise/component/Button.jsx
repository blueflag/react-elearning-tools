// @flow
import React from 'react';
import type {Element} from 'react';
import {Button} from 'obtuse';

export default ({disabled, modifier = '', ...props}: Object): Element<*> => {
    return <Button
        modifier={disabled ? `${modifier} disabled` : modifier}
        disabled={disabled}
        {...props}
    />;
};
