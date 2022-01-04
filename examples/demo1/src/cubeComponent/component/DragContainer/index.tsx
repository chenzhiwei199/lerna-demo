import * as React from 'react';
import { DragContainer, DragItem } from '@alife/hippo-shuhe-drag';
import { ActiveTag } from '../Tag';
import { getColor } from '../../utils/dragUtils';
import { CELL_TYPE } from '../ChartDesigner';
import produce from 'immer';
import { Cell } from '../../global';

export interface DragContainerProps {
  dataSource: Cell[];
  label: string;
  type: CELL_TYPE;
  onDrop: (value: string) => void;
  onDrag?: (value: string) => void;
  onDragged: (value: string) => void;
}

export interface DragContainerState {}

function renderContainerContent(type, { dataSource }) {
  return (
    <ActiveTag
      color={getColor(type)}
      label={dataSource.label}
      value={dataSource.value}
    />
  );
}

function renderContainer(type, config) {
  const { dataSource = [], sourceType, canDrop, isActive } = config;
  let background = isActive ? 'rgb(241,246,240)' : 'white';
  let border = canDrop
    ? '1px solid rgb(235,143,80)'
    : '1px solid rgb(212,212,212)';
  return (
    <div
      className="container"
      style={{
        padding: '12px',
        border: border,
        background: background,
        minHeight: 50,
        width: '100%',
      }}
    >
      <div>
        {dataSource.map((item, index) => {
          return (
            <DragItem
              onDrag={this.onDrag.bind(this, type)}
              onDragged={this.onDragged.bind(this, type)}
              style={{ display: 'inline-block' }}
              key={item.value + index}
              type={type}
              dataSource={item}
              renderContent={renderContainerContent.bind(this, item.type)}
            />
          );
        })}
      </div>
    </div>
  );
}

class CustomDragContainer extends React.PureComponent<
  DragContainerProps,
  DragContainerState
> {
  // 拖拽元素，之前所在的容器
  dragType: string;
  static defaultProps = {
    onDrop: () => {},
    onDrag: () => {},
    onDragged: () => {},
  };
  constructor(props: DragContainerProps) {
    super(props);
    this.dragType = '';
  }

  onDrop(key, item, result = {}, component) {
    const { onDrop } = this.props;
    const { dataSource } = item;
    onDrop(dataSource.value);
    // 清空拖拽状态
  }

  onDrag(type, dropResult) {
    const { onDrag } = this.props;
    // 记录当前拖拽的tag所属的容器类型
    if (dropResult && onDrag) {
      onDrag(dropResult.dataSource.value);
    }
  }

  shouldComponentUpdate(preProps) {
    if (preProps.dataSource === this.props.dataSource) {
      return false;
    }
    return true;
  }
  onDragged(type, dropResult, item) {
    const { onDragged } = this.props;
    if (dropResult) {
      onDragged(dropResult.dataSource.value);
    }
  }

  renderBlock() {
    const { label, type, dataSource } = this.props;
    return (
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
        <div style={{ width: '100px' }}>{label}</div>
        <DragContainer
          onDrop={this.onDrop.bind(this, type)}
          // 容器支持的拖拽类型
          type={Object.values(CELL_TYPE).filter(item => item !== type)}
          dataSource={dataSource}
          // key  为当前容器内选项的类型
          renderContent={renderContainer.bind(this, type)}
        />
      </div>
    );
  }

  render() {
    return this.renderBlock();
  }
}

export default CustomDragContainer;
