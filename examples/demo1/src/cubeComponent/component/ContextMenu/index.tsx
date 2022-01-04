import * as React from 'react';
import { Overlay, Cascader } from '@alife/hippo';

const Popup = Overlay.Popup;

export default class ContextMenu extends React.Component<ContextMenuProps> {
  ref?: HTMLElement | null;

  render() {
    const {
      visible,
      dataSource,
      onChange,
      offset,
      onRequestClose,
    } = this.props;
    return (
      <Popup
        visible={visible}
        align="tl tl"
        onVisibleChange={onRequestClose}
        hasMask={false}
        offset={offset}
        safeNode={document.body}
      >
        <div
          ref={ref => {
            this.ref = ref;
          }}
          className="overlay-demo"
        >
          <Cascader
            dataSource={dataSource}
            canOnlySelectLeaf={true}
            onChange={onChange}
          />
        </div>
      </Popup>
    );
  }
}
export interface DataSourceConfig {
  label: string;
  value: string;
  children?: Array<DataSourceConfig>;
}
export interface ContextMenuProps {
  dataSource?: Array<DataSourceConfig>;
  visible: boolean;
  offset?: Array<number>;
  onRequestClose?: (visible: boolean, reason: string) => void;
  onChange?: (value: string) => void;
}
