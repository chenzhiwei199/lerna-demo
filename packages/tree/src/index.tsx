import React, { useMemo, useState } from 'react';
import { useEffect, useRef } from 'react';
import { useSpring, animated, useTransition, Spring } from 'react-spring';
import * as d3 from 'd3';
import styled from 'styled-components';
import produce from 'immer';
import { Stage } from './stage';
import { OperateWrapper } from './OperateWrapper';
import { ZoomContainer } from './ZoomContainer';
import { MiniViewRect } from './MiniViewRect';
import { CanvasContext, useCanvasContext } from './CanvseContext';
import { useZoomContext } from './ZoomContext';

const StyledDiv = styled.div`
  position: relative;
  svg {
    .node circle {
      fill: #fff;
      stroke: steelblue;
      stroke-width: 3px;
    }

    .node text {
      font: 12px sans-serif;
    }

    .node--internal text {
      text-shadow: 0 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff;
    }

    .link {
      fill: none;
      stroke: #ccc;
      stroke-width: 2px;
    }
  }
`;
export interface INode {
  id: string;
  children?: INode[];
  attributes?: { [key: string]: any };
}
export interface Relation {
  from: string;
  op: string;
  to: string;
}

export interface ICardProps {
  node: any;
  active: boolean;
  width: number;
  height: number;
}
export enum EOrientation {
  H = 'horzontal',
  V = 'vertical',
}
interface TreeProps {
  orientation?: EOrientation;
  openKeys?: string[];
  zoom?: number;
  defaultExpandLevel?: number;
  onActive?: (key: string, row: any) => void;
  horizontalGap?: number;
  verticalGap?: number;
  width?: number;
  cardWidth?: number;
  cardHeight?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  data?: INode;
  Card?: React.FC<ICardProps>;
  // relations: Relation[]
}

function getDirectPathD(
  cardHeight: number,
  cardWidth: number,
  gap: number,
  current: Point,
  parent: Point,
  orientation: EOrientation
) {
  const halfDepth = gap / 2;
  const path = `M ${parent.x} ${parent.y + cardHeight} 
    v ${halfDepth}
    h ${current.x - parent.x}
    v ${halfDepth}
    `;

  return path;
}
const defaultProps: TreeProps = {
  orientation: EOrientation.V,
  width: 800,
  height: 500,
  cardWidth: 150,
  cardHeight: 100,
  horizontalGap: 30,
  verticalGap: 50,
  zoom: 1,
  defaultExpandLevel: 0,
  margin: { top: 40, right: 20, bottom: 300, left: 20 },
};

function swap(a: any, b: any) {
  return [b, a];
}
function normalizeProps<T extends TreeProps>(props: T): Required<T> {
  const newProps = { ...defaultProps, ...props };
  let { orientation, cardWidth, cardHeight } = newProps;
  // if (orientation === EOrientation.H) {
  //   const swapInfo = swap(cardWidth, cardHeight);
  //   cardWidth = swapInfo[0];
  //   cardHeight = swapInfo[1];
  // }
  return { ...newProps, cardWidth, cardHeight } as any;
}

function diffKeys(preKeys: string[] = [], currentKeys: string[] = []) {
  const addKey = currentKeys.find((key) => !preKeys.includes(key));
  if (addKey !== null && addKey !== undefined) {
    return addKey;
  }
  const deleteKey = preKeys.find((key) => !currentKeys.includes(key));
  if (deleteKey !== null && deleteKey !== undefined) {
    return deleteKey;
  }
}

function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
function calcRatio(width, height) {
  return height / width;
}
function calcSizes(
  hierarchyFlatNodes: d3.HierarchyPointNode<INode>[],
  props: Pick<
    TreeProps,
    'width' | 'height' | 'cardWidth' | 'cardHeight' | 'margin'
  >
) {
  const { width, height, cardHeight, cardWidth, margin } = props;
  const whRatio = calcRatio(width, height);
  const sizes = hierarchyFlatNodes.reduce(
    (root, item) => {
      return {
        minX: Math.min(root.minX, item.x),
        maxX: Math.max(root.maxX, item.x),
        minY: Math.min(root.minY, item.y),
        maxY: Math.max(root.maxY, item.y),
      };
    },
    {
      minX: -innerWidth / 2,
      maxX: innerWidth / 2,
      minY: -innerHeight / 2,
      maxY: innerHeight / 2,
    }
  );
  const virtualLayerWidth = Math.max(
    innerWidth,
    sizes.maxX - sizes.minX + cardWidth + margin.left + margin.right
  );
  const virtualLayerHeight = Math.max(
    innerHeight,
    sizes.maxY - sizes.minY + margin.top + margin.bottom + cardHeight
  );
  function getLayoutSize() {
    const maxX = Math.abs(sizes.maxX);
    const minX = Math.abs(sizes.minX);
    const maxY = Math.abs(sizes.maxY);
    const minY = Math.abs(sizes.minY);
    const { left, right, top, bottom } = margin;
    let normalVirtualLayerWidth;
    let normalVirtualLayerHeight;
    // 确保画布内容和窗口的比例是一致低，如果不一致，就将画布抹平成一致的。
    if (virtualLayerWidth < virtualLayerHeight / whRatio) {
      normalVirtualLayerHeight = virtualLayerHeight;
      normalVirtualLayerWidth = virtualLayerHeight / whRatio;
    } else {
      normalVirtualLayerHeight = virtualLayerWidth * whRatio;
      normalVirtualLayerWidth = virtualLayerWidth;
    }

    // 画布高度 => 画布宽度 => 画布左侧宽度, 画布右侧宽度
    const config = {
      // 画布的宽度
      layerWidth: normalVirtualLayerWidth,
      // 画布的高度
      layerHeight: normalVirtualLayerHeight,
      leftLayerWidth: normalVirtualLayerWidth * (minX / (maxX + minX)),
      // 根据比例计算左侧，
      rightLayerWidth: normalVirtualLayerWidth * (maxX / (maxX + minX)),
      topLayerHeight: normalVirtualLayerHeight * (minY / (maxY + minY)),
      bottomLayerHeight: normalVirtualLayerHeight * (minY / (maxY + minY)),
    };
    console.log('config: ', config);
    return config;
  }
  return getLayoutSize();
}
export function useTreeInfos(
  props: TreeProps,
  type: 'outer' | 'inner' = 'outer'
) {
  const {
    data,
    width,
    height,
    margin,
    openKeys = [],
    cardWidth,
    cardHeight,
    verticalGap,
    horizontalGap,
    orientation,
  } = props;

  // 有孩子节点的id
  let hasChldrenSet = new Set<string>();
  const newData = produce(data, (root) => {
    function each(root: INode) {
      if (root && root.children) {
        if (root.children && root.children.length !== 0) {
          hasChldrenSet.add(root.id);
        }
        root.children = openKeys.includes(root.id)
          ? root.children.map((child) => {
              return each(child);
            })
          : [];
      }
      return root;
    }
    each(root);
  });
  // 构造树的数据
  const hierarchyNodes = d3.hierarchy<INode>(newData, function (d) {
    return d.children;
  });
  const nodeSizes = [cardWidth + horizontalGap, cardHeight + verticalGap];

  const treeLayout = d3
    .tree<INode>()
    .nodeSize(
      orientation === EOrientation.H ? nodeSizes.reverse() : (nodeSizes as any)
    )(hierarchyNodes);

  let layout = calcSizes(treeLayout.descendants(), props);

  console.log('layout.leftLayerWidth: ' + type, layout.leftLayerWidth, layout);
  let hierarchyFlatNodes =
    orientation === EOrientation.H
      ? treeLayout.descendants().map((item) => {
          let temp = item.x;
          item.x = item.y;
          item.y = temp;
          // + layout.layerHeight / 2;
          // if(item.parent) {
          //   newItem.parent.x= newItem.parent.y - layout.leftLayerWidth;
          //   newItem.parent.y= newItem.parent.x + layout.layerHeight / 2;
          // }

          return item;
        })
      : treeLayout.descendants();
  const newLayout = calcSizes(hierarchyFlatNodes, props);
  hierarchyFlatNodes = hierarchyFlatNodes.map((item) => {
    item.x = item.x - (newLayout.layerWidth / 2  - width / 2) ;
    item.y = item.y + newLayout.topLayerHeight ;
    return item;
  });
  return {
    treeLayout,
    hierarchyFlatNodes,
    hasChldrenSet,
    defaultPosition:
      orientation === EOrientation.H
        ? {
            x: (newLayout.leftLayerWidth ) / 2 + width,
            y: -(newLayout.layerHeight - height) / 2,
          }
        : { x: 0, y: 0 },
    layout: newLayout,
  };
}
export default (props: TreeProps) => {
  const newProps = normalizeProps(props);
  const {
    data,
    margin,
    width,
    height,
    cardWidth,
    cardHeight,
    zoom,
    orientation,
    defaultExpandLevel,
  } = newProps;
  const innerWidth = width;
  const innerHeight = height;
  function walk() {
    let keys: string[] = [];
    function travser(data: INode, level = 0) {
      if (level <= defaultExpandLevel) {
        keys.push(data.id);
      }
      data.children &&
        data.children.forEach((item) => {
          travser(item, level + 1);
        });
    }
    travser(data);
    return keys;
  }
  const [openKeys, setOpenKeys] = useState<string[]>(walk());
  const [activeKey, setActiveKey] = useState<string>('');

  // useEffect(() => {
  //   // setOpenKeys(openKeys)
  //   // 默认展开层级控制

  //   setOpenKeys(walk());
  // }, [data]);

  const {
    hierarchyFlatNodes,
    hasChldrenSet,
    layout,
    defaultPosition,
  } = useTreeInfos({ ...newProps, openKeys });

  // 固定深度间隔

  const maxScale = layout.layerWidth / innerWidth;
  // TODO： 1. 默认进来以顶层节点居中 2. 点击展开后，焦点转移到点击节点
  const contentProps: IContent = {
    ...normalizeProps(props),
    hasChldrenSet,
    activeKey,
    setActiveKey: (key: string, row: any) => {
      setActiveKey(key);
    },
    openKeys,
    hierarchyFlatNodes,
    setOpenKeys,
  };
  return (
    <StyledDiv>
      <CanvasContext.Provider
        value={{
          margin,
          cardWidth,
          cardHeight,
          ...layout,
          content: (
            <g
              className="content"
              transform={`translate(${layout.leftLayerWidth}, ${0})`}
            >
              {<Content {...contentProps} animation={false} />}
            </g>
          ),
          ratio: 2,

          width: innerWidth,
          height: innerHeight,
          maxScale,
        }}
      >
        <ZoomContainer defaultPosition={defaultPosition}>
          <ActiveCmp
            zoom={zoom}
            activeKey={activeKey}
            hierarchyFlatNodes={hierarchyFlatNodes}
          />
          <Stage width={innerWidth} height={innerHeight}>
            <g transform={`translate(${innerWidth / 2},${0})`}>
              <OperateWrapper>
                {<Content {...contentProps} animation={false} />}
              </OperateWrapper>
            </g>
          </Stage>
          <div style={{ position: 'absolute', top: height }}>
            <MiniViewRect />
          </div>
        </ZoomContainer>
      </CanvasContext.Provider>
    </StyledDiv>
  );
};

function ActiveCmp(props: {
  zoom: number;
  activeKey: string;
  hierarchyFlatNodes: d3.HierarchyPointNode<INode>[];
}) {
  const { activeKey, hierarchyFlatNodes, zoom } = props;
  const { setTransform } = useZoomContext();
  useEffect(() => {
    setTransform((transform) => ({ ...transform, k: zoom }));
  }, [zoom]);
  useEffect(() => {
    setTransform((transform) => {
      const findItem = hierarchyFlatNodes.find(
        (item) => item.data.id === activeKey
      );
      return {
        ...transform,
        x: findItem ? findItem.x * transform.k : transform.x,
      };
    });
  }, [activeKey]);
  return <></>;
}

interface IContent extends Required<TreeProps> {
  activeKey: string;
  animation?: boolean;
  hasChldrenSet: Set<string>;
  setActiveKey: (value: string, row: any) => void;
  hierarchyFlatNodes: d3.HierarchyPointNode<INode>[];
  setOpenKeys: (values: string[]) => void;
}
function Content(props: IContent) {
  const newProps = normalizeProps(props);
  const {
    setOpenKeys,
    activeKey,
    setActiveKey,
    cardHeight,
    cardWidth,
    Card,
    margin,
    openKeys,
    verticalGap,
    orientation,
    data,
  } = newProps;
  const { hasChldrenSet, hierarchyFlatNodes } = useTreeInfos(newProps, 'inner');
  const preOpenKeys = usePrevious(openKeys);
  const nodeMap = new Map(
    hierarchyFlatNodes.map((node) => [node.data.id, node])
  );
  const targetKey = diffKeys(preOpenKeys, openKeys);
  // 找到点击的对象,通过对openKeys进行比较l
  function calcTranslate(item) {
    return item && `translate(${item?.x}, ${item?.y})`;
  }
  const transition = useTransition<
    d3.HierarchyPointNode<INode>,
    { transform: string }
  >(
    React.useMemo(() => hierarchyFlatNodes, [data, openKeys]),
    {
      keys: (item) => item.data.id,
      enter: (item) => {
        return {
          transform: `translate(${item.x}, ${item.y})`,
        };
      },
      from: (item) => {
        return {
          transform: calcTranslate(
            targetKey ? nodeMap.get(targetKey) : item.parent
          ),
        };
      },
      // delay: 200,
      leave: (item) => {
        return {
          transform: calcTranslate(
            targetKey ? nodeMap.get(targetKey) : item.parent
          ),
        };
      },
    }
  );
  return (
    <g transform={`translate(0,  ${margin.top})`}>
      {hierarchyFlatNodes.slice(1).map((item) => {
        return (
          <Path
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            orientation={orientation}
            gap={verticalGap}
            // depthSize={depthSize}
            id={`link-${item?.parent?.data?.id || 'root'}-${item.data.id}`}
            key={`link-${item?.parent?.data?.id || 'root'}-${item.data.id}`}
            className={`link`}
            data={item}
          ></Path>
        );
      })}
      {transition((styles, item, index) => {
        const checked =
          openKeys.findIndex((key) => key === item.data.id) !== -1;
        return (
          <animated.g
            transform={styles.transform}
            className={
              'node' + (item.children ? ' node--internal' : ' node--leaf')
            }
          >
            <foreignObject
              x={-(cardWidth / 2)}
              width={cardWidth}
              height={cardHeight}
            >
              <div
                style={{
                  position: 'relative',
                  width: cardWidth,
                  height: cardHeight,
                }}
              >
                <Card
                  active={activeKey === item.data.id}
                  node={item.data as any}
                  width={cardWidth}
                  height={cardHeight}
                />
                {hasChldrenSet.has(item.data.id) && (
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: '2px',
                      background: 'black',
                      color: 'white',
                      cursor: 'pointer',
                      border: '1px solid black',
                      marginLeft: 'calc(50% - 6px)',
                      position: 'absolute',
                      textAlign: 'center',
                      lineHeight: '12px',
                      bottom: 0,
                    }}
                    onClick={() => {
                      // 区分收起展开状态
                      const findIndex = openKeys.findIndex(
                        (key) => key === item.data.id
                      );
                      if (item.descendants().length === 0) {
                        return;
                      }
                      setActiveKey(item.data.id, item.data);
                      setOpenKeys(
                        produce(openKeys, (openKeys) => {
                          if (checked) {
                            openKeys = openKeys.splice(findIndex, 1);
                          } else {
                            openKeys.push(item.data.id);
                          }
                        })
                      );
                    }}
                  >
                    {checked ? '-' : '+'}
                  </div>
                )}
              </div>
            </foreignObject>
          </animated.g>
        );
      })}
    </g>
  );
}
export interface Point {
  x: number;
  y: number;
  parentX?: number;
  parentY?: number;
}
export function G(
  props: React.SVGProps<SVGGElement> & Point & { animation?: boolean }
) {
  const { x, y, ref, parentX, parentY, children, animation = true } = props;
  return (
    <>
      {animation ? (
        <Spring
          from={{ transform: `translate(${parentX}, ${parentY})` }}
          to={{ transform: `translate(${x}, ${y})` }}
        >
          {(props) => {
            return (
              <animated.g transform={props.transform}>{children}</animated.g>
            );
          }}
        </Spring>
      ) : (
        <g transform={`translate(${x}, ${y})`}>{children}</g>
      )}
    </>
  );
}
export function Path(
  props: React.SVGProps<SVGPathElement> & {
    data: d3.HierarchyPointNode<INode>;
    cardWidth: number;
    orientation: EOrientation
    cardHeight: number;
    gap: number;
  }
) {
  const { data, gap, cardWidth, cardHeight, ref, ...rest } = props;
  const springOptions = {
    opacity: 1,
    d: getDirectPathD(
      cardHeight,
      cardWidth,
      gap,
      { x: data.x, y: data.y },
      { x: data.parent?.x, y: data.parent?.y },
      orientation
    ),
    from: {
      opacity: 0,
      d: getDirectPathD(
        cardHeight,
        cardWidth,
        gap,
        { x: data.parent?.x, y: data.parent?.y },
        { x: data.parent?.x, y: data.parent?.y },
        orientation
      ),
    },
  };
  const spring = useSpring<{ d: string; opacity: number }>(springOptions);
  return (
    <animated.path
      style={{ opacity: spring.opacity }}
      {...rest}
      d={spring.d}
    ></animated.path>
  );
}
