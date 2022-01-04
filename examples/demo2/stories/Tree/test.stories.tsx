import * as React from 'react';
import Tree, { EOrientation } from '@alife/tree';
export default {
  title: 'Button2',
};

export const axis = () => {
  return (
    <div style={{ border: '1px dashed grey', display: 'inline-block' }}>
      <Tree
        defaultExpandLevel={10}
        data={{
          id: '111',
          children: [
            { id: '2222', children: [{ id: '4444', children: [ { id: '14'}, { id: '15'}, { id: '16'}, { id: '17'}] }, { id: '5555', children: [ { id: '6'}, { id: '7'}, { id: '8'}, { id: '9'}] }] },
            { id: '3333', children: [{ id: '10'}, { id: '11'}, { id: '12'}, { id: '13'}] },
          ],
        }}
        Card={React.useCallback(({ node }) => {
          return (
            <div
              style={{
                width: '100%',
                height: '100%',
                boxSizing: 'border-box',
                border: '1px solid black',
              }}
            >
              {node.id}
            </div>
          );
        }, [])}
      />
    </div>
  );
};

export const axisH = () => {
  return (
    <div style={{ border: '1px dashed grey', display: 'inline-block' }}>
      <Tree
        orientation={EOrientation.H}
        defaultExpandLevel={10}
        data={{
          id: '111',
          children: [
            { id: '2222', children: [{ id: '4444' }, { id: '5555' }] },
            { id: '3333' },
          ],
        }}
        Card={React.useCallback(({ node }) => {
          return (
            <div
              style={{
                width: '100%',
                height: '100%',
                boxSizing: 'border-box',
                border: '1px solid black',
              }}
            >
              {node.id}
            </div>
          );
        }, [])}
      />
    </div>
  );
};

const mockData = {
  id: 'Modeling Methods',
  children: [
    {
      id: 'Classification',
      children: [
        {
          id: 'Logistic regression',
        },
        {
          id: 'Linear discriminant analysis',
        },
        {
          id: 'Rules',
        },
        {
          id: 'Decision trees',
        },
        {
          id: 'Naive Bayes',
        },
        {
          id: 'K nearest neighbor',
        },
        {
          id: 'Probabilistic neural network',
        },
        {
          id: 'Support vector machine',
        },
      ],
    },
    {
      id: 'Consensus',
      children: [
        {
          id: 'Models diversity',
          children: [
            {
              id: 'Different initializations',
            },
            {
              id: 'Different parameter choices',
            },
            {
              id: 'Different architectures',
            },
            {
              id: 'Different modeling methods',
            },
            {
              id: 'Different training sets',
            },
            {
              id: 'Different feature sets',
            },
          ],
        },
        {
          id: 'Methods',
          children: [
            {
              id: 'Classifier selection',
            },
            {
              id: 'Classifier fusion',
            },
          ],
        },
        {
          id: 'Common',
          children: [
            {
              id: 'Bagging',
            },
            {
              id: 'Boosting',
            },
            {
              id: 'AdaBoost',
            },
          ],
        },
      ],
    },
    {
      id: 'Regression',
      children: [
        {
          id: 'Multiple linear regression',
        },
        {
          id: 'Partial least squares',
        },
        {
          id: 'Multi-layer feedforward neural network',
        },
        {
          id: 'General regression neural network',
        },
        {
          id: 'Support vector regression',
        },
      ],
    },
  ],
};
export const perfermance = () => {
  return (
    <div style={{ border: '1px dashed grey', display: 'inline-block' }}>
      <Tree
        defaultExpandLevel={10}
        data={mockData}
        Card={React.useCallback(({ node }) => {
          return (
            <div
              style={{
                width: '100%',
                height: '100%',
                boxSizing: 'border-box',
                border: '1px solid black',
              }}
            >
              {node.id}
            </div>
          );
        }, [])}
      />
    </div>
  );
};

export const perfermanceH = () => {
  return (
    <div style={{ border: '1px dashed grey', display: 'inline-block' }}>
      <Tree
        defaultExpandLevel={10}
        data={mockData}
        orientation={EOrientation.H}
        Card={React.useCallback(({ node }) => {
          return (
            <div
              style={{
                width: '100%',
                height: '100%',
                boxSizing: 'border-box',
                border: '1px solid black',
              }}
            >
              {node.id}
            </div>
          );
        }, [])}
      />
    </div>
  );
};
