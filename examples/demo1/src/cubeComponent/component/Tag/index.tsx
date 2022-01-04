import * as React from 'react';
import styled from 'styled-components';

export interface TagProps {
  isActive?: boolean;
  prefix?: string;
  label: string;
  value: string;
  onClick?: (code: string) => void;
  icon?: JSX.Element;
  color?: string;
  type?: string;
  className?: string;
}

export interface TagState {}

class Tag extends React.Component<TagProps, TagState> {
  static defaultProps = {
    prefix: 'cube-tag',
    onClick: () => {},
  };

  constructor(props: TagProps) {
    super(props);
  }
  render() {
    const {
      prefix,
      className,
      type,
      isActive,
      icon,
      onClick,
      label,
      value,
    } = this.props;
    return (
      <span
        className={`${className} ${prefix} ${type} ${isActive ? 'active' : ''}`}
        onClick={() => {
          onClick && onClick(value);
        }}
      >
        <span>{icon}</span>
        <span style={{ background: 'color' }} className="label">
          {label}
        </span>
      </span>
    );
  }
}

export default Tag;

export const HoverTag = styled(Tag)`
  .label {
    padding: 4px 6px;
  }
  &:hover {
    .label {
      border-radius: 20px;
      background: ${props => props.color};
    }
  }
`;

export const ActiveTag = styled(Tag)`
  .label {
    padding: 4px 6px;
    border-radius: 20px;
    background: ${props => props.color};
  }
`;
