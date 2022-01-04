import * as React from 'react';
import { DragItem } from '@alife/hippo-shuhe-drag';
import { Cell, MetricsType } from '../../global';
import { CELL_TYPE } from '../ChartDesigner';
import { HoverTag } from '../Tag';
import { getColor, getIcon } from '../../utils/dragUtils';

export interface DragListProps {
  data: Cell[];
  label: string;
  iconType: MetricsType;
}

export interface DragListState {}

function renderBaseContent(type, { dataSource }) {
  let style = {
    padding: '4px',
  };
  return (
    <div style={style}>
      <HoverTag
        color={getColor(type)}
        label={dataSource.label}
        value={dataSource.value}
        icon={getIcon(type)}
      />
    </div>
  );
}

class DragList extends React.Component<DragListProps, DragListState> {
  constructor(props: DragListProps) {
    super(props);
  }
  render() {
    const { label, data, iconType } = this.props;
    return (
      <div style={{ width: 150, height: '100%' }}>
        <div>{label}</div>
        {data.map(item => {
          return (
            <DragItem
              // style={{ display: 'inline-block' }}
              type={CELL_TYPE.BASE}
              key={item.value}
              dataSource={item}
              renderContent={renderBaseContent.bind(this, iconType)}
            />
          );
        })}
      </div>
    );
  }
}

export default DragList;
