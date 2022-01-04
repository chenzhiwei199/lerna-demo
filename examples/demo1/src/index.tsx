import * as React from 'react';
import ChartDesigner from './cubeComponent/component/ChartDesigner';
export { default as SchemaDesigner } from './cubeComponent/component/SchemaDesigner';
export { default as Home } from './cubeComponent/component/Home';
// export { default as HomeVega } from './cubeComponent/component/HomeVega';
class IndexPage extends React.Component {
  state = {};
  render() {
    return (
      <div>
        <ChartDesigner />
        {/* <Cube /> */}
      </div>
    );
  }
}

export default IndexPage;
