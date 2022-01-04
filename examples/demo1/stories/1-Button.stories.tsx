import * as React from 'react';
import { action } from '@storybook/addon-actions';
import Chart from '../src/index';
export default {
  title: 'Button',
};

export const text = () => <div onClick={action('clicked')}>111</div>;
export const counter = () => <Chart />;
