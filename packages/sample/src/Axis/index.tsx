import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as d3 from 'd3';

function createAxis(content, min, max, isClear = false) {
  const scale = d3
    .scaleLinear()
    .domain([0, 100])
    .range([min, max]);
  content.call(d3.axisLeft(scale));
  if (isClear) {
    content.select('.axis').remove();
  }
  return content._groups[0][0].getBBox();
}
class Block extends React.Component {
  ref: HTMLDivElement | null;

  constructor(props) {
    super(props);
    this.ref = null;
  }
  componentDidMount() {
    const htmlElement = ReactDOM.findDOMNode(this.ref) as Element;
    let width = 500;
    let height = 300;
    const content = d3
      .select(htmlElement)
      .append('svg')
      .attr('width', 500)
      .attr('height', 300);
    const axisContainer = content.append('g').attr('class', 'axis');
    let axisSize = createAxis(axisContainer, 0, 300, true);
    const { width: axisWidth, height: axisHeight } = axisSize;
    const realAxisWidth = axisWidth;
    const realAxisHeight = axisHeight - height;
    createAxis(axisContainer, 0, height - realAxisHeight);
    axisContainer.attr(
      'transform',
      `translate(${realAxisWidth}, ${realAxisHeight / 2})`
    );
    // axisContainer.attr('transform', `translate(${Math.abs(x)}, ${Math.abs(y)})`);
  }

  render() {
    return (
      <div>
        <div
          style={{ margin: '50px' }}
          ref={ref => {
            this.ref = ref;
          }}
        />
      </div>
    );
  }
}

export default Block;
