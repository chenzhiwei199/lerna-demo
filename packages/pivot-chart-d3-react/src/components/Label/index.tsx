import * as React from 'react';
import Offset from '../../help/Offset';
export interface LabelProps {
  fill?: string;
  offset?: Offset;
  label: string;
  isTranspose?: boolean;
}

export interface LabelState {

}

class Label extends React.Component<LabelProps, LabelState> {
  public static defaultProps = {
    fill: 'black',
    isTranspose: false,
  };
  constructor(props: LabelProps) {
    super(props);
  }
  public render() {
    const { fill, offset = new Offset(0, 0), label, isTranspose } = this.props;
    let translate = offset.toTransform();
    let  dominantBaseline = '';
    if (isTranspose) {
      translate = `${translate}rotate(90)`;
    } else {
      dominantBaseline = 'hanging';
    }

    return (
      <text
        textAnchor='middle'
        dominantBaseline={dominantBaseline}
        transform={translate}
        fill={fill}
      >
        {label.slice(0, 10)}
      </text>
    );
  }
}

export default Label;
