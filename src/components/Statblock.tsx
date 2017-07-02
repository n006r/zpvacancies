import * as React from 'react';

const StatBlock = ({ header, children }: {header: string, children: React.ReactNode}) => (
  <div style={style}>
    <h1>{header}</h1>
    {children}
  </div>
);

const style: {
  [index: string]: string | number;
} = {
  marginTop: '40px',
};

export default StatBlock;
