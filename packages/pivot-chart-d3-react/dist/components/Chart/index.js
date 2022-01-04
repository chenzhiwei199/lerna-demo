"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const SizeOptions_1 = __importStar(require("../../help/SizeOptions"));
const chartUtils_1 = require("../../utils/chartUtils");
const IntervalGeom_1 = __importDefault(require("../Geom/IntervalGeom"));
const LineGeom_1 = __importDefault(require("../Geom/LineGeom"));
const PointGeom_1 = __importDefault(require("../Geom/PointGeom"));
const ChartRenderer_1 = __importDefault(require("../ChartRenderer"));
class Chart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    createTreeKeys(categorys, categoryValues) {
        const treeData = [];
        function createData(dimensionKeys = [], level = 0) {
            if (level === categorys.length) {
                treeData.push(dimensionKeys);
            }
            else {
                const currentCategoryValue = categoryValues[level];
                const currentCategory = categorys[level];
                currentCategoryValue.forEach(categoryValue => {
                    createData([...dimensionKeys, categoryValue[currentCategory.code]], level + 1);
                });
            }
        }
        createData();
        return treeData;
    }
    createTreeData(data, keys, categoryValues) {
        const dataMap = {};
        function createData(data, dimKeys = [], level = 0) {
            if (level === keys.length) {
                dimKeys.reduce((root, dimKey, dimLevel) => {
                    const currentDataMap = root[dimKey];
                    // 塞入数据
                    if (dimLevel === dimKeys.length - 1) {
                        root[dimKey] = data;
                        // 最后一行，无意义
                        return dataMap;
                    }
                    else {
                        // 如果当前数据对象已经存在，则把当前对象传递下去
                        if (currentDataMap) {
                            return currentDataMap;
                        }
                        else {
                            // 当前对象不存在，则创建对象并传递下去
                            root[dimKey] = {};
                            return root[dimKey];
                        }
                    }
                }, dataMap);
            }
            else {
                const currentCategoryValue = categoryValues[level];
                const currentKey = keys[level];
                currentCategoryValue.forEach(categoryValue => {
                    const currentCategoryValue = categoryValue[currentKey];
                    createData(data.filter(t => t[currentKey] === currentCategoryValue), [...dimKeys, currentCategoryValue], level + 1);
                });
            }
        }
        createData(data);
        return dataMap;
    }
    /**
     * createGroupData
     */
    createGroupData(treeData, cells) {
        const groupData = [];
        treeData.forEach(d => {
            if (cells.length === 0) {
                groupData.push({
                    dimensionKeys: d,
                });
            }
            else {
                cells.forEach(cell => {
                    groupData.push({
                        ...cell,
                        dimensionKeys: d,
                    });
                });
            }
        });
        // 兼容，仅有单个行度量，或者列度量的情况
        return groupData.length === 0 ? [undefined] : groupData;
    }
    creatSize(config) {
        const { dimensionValuesConfig } = config;
    }
    createConfig() {
        const { data, width, height, cols, rows } = this.props;
        const scales = chartUtils_1.produceScale(data, cols, rows);
        // 生成基础配置
        const { categorys: yCategorys, cells: yCells } = chartUtils_1.produceConfig(scales.y);
        let { categorys: xCategorys, cells: xCells } = chartUtils_1.produceConfig(scales.x);
        // 调整展示规则, 最小cell的x,y都为维度时，调整展示规则
        if (chartUtils_1.checkIsCategory(yCells.map(item => item.type)) &&
            chartUtils_1.checkIsCategory(xCells.map(item => item.type))) {
            xCategorys = xCategorys.concat(xCells);
            xCells = [];
        }
        const yCategoryValues = chartUtils_1.getCategoryValues(data, yCategorys.map(item => item.code));
        const xCategoryValues = chartUtils_1.getCategoryValues(data, xCategorys.map(item => item.code));
        const positionConfig = { x: xCells, y: yCells };
        const dimensionsConfig = { x: xCategorys, y: yCategorys };
        const sizeConfig = { width, height };
        const geomInstance = this.getGeomInstance();
        const xGraphData = this.createGroupData(this.createTreeKeys(xCategorys, xCategoryValues), xCells);
        const yGraphData = this.createGroupData(this.createTreeKeys(yCategorys, yCategoryValues), yCells);
        // const mapData = this.createTreeData(data, [...xCategorys, ...yCategorys].map((item: Cell) => item.code), [...xCategoryValues, ...yCategoryValues]);
        const config = {
            data,
            positionConfig,
            axisConfig: {},
            sizeConfig,
            dimensionsConfig,
            graphDataConfig: {
                x: xGraphData,
                y: yGraphData,
            },
        };
        // 初始化各个区块大小
        const sizeOptions = new SizeOptions_1.default(config);
        const geom = sizeOptions.get().get(SizeOptions_1.ELEMENT_TYPE.GEOM);
        const { size: xRealSize, isShowScroll: isXShowScroll, } = this.produceSizeConfig(data, geomInstance, xCells, xCategorys, geom.getWidth());
        const { size: yRealSize, isShowScroll: isYShowScroll, } = this.produceSizeConfig(data, geomInstance, yCells, yCategorys, geom.getHeight());
        const { size: cellWidth, data: xAxisData, facetData: xFacetData, } = chartUtils_1.createAxisData(xCategorys, xCategoryValues, xCells, xRealSize);
        const { size: cellHeight, data: yAxisData, facetData: yFacetData, } = chartUtils_1.createAxisData(yCategorys, yCategoryValues, yCells, yRealSize);
        return {
            data,
            geomInstance,
            sizeOptions,
            offsetConfig: {
                offsetX: 0,
                offsetY: 0,
            },
            axisConfig: {
                isXShowScroll,
                isYShowScroll,
            },
            dimensionValuesConfig: {
                x: xCategoryValues,
                y: yCategoryValues,
            },
            dimensionConfig: {
                x: xCategorys,
                y: yCategorys,
            },
            positionsConfig: {
                x: xCells,
                y: yCells,
            },
            axisDataConfig: {
                x: xAxisData,
                y: yAxisData,
            },
            graphDataConfig: {
                x: xGraphData,
                y: yGraphData,
            },
            facetDataConfig: {
                x: xFacetData,
                y: yFacetData,
            },
            realSizeConfig: {
                width: xRealSize,
                height: yRealSize,
            },
            cellSizeConfig: {
                width: cellWidth,
                height: cellHeight,
            },
            sizeConfig: {
                width: Number(width),
                height: Number(height),
            },
        };
    }
    getAxisData() { }
    getGeom(type) {
        switch (type) {
            case 'interval':
                return IntervalGeom_1.default;
            case 'line':
                return LineGeom_1.default;
            case 'point':
                return PointGeom_1.default;
            default:
                return IntervalGeom_1.default;
        }
    }
    getGeomInstance() {
        const { geom } = this.props;
        const GeomClass = this.getGeom(geom);
        const geomInstance = new GeomClass(this.props);
        return geomInstance;
    }
    produceSizeConfig(data, geomInstance, cells, categorys, size) {
        // 没有描述维度或者指标的时候
        const minWidth = geomInstance.getMinSize(cells);
        const xNums = chartUtils_1.countTreeData(data, categorys.map(item => item.code));
        let realSize = minWidth * xNums;
        // 当实际宽度大于图表绘制区域
        const isShowScroll = size < realSize;
        // 如果图表的实际绘制宽度还没有图标展示的宽度大，则自适应
        if (!isShowScroll) {
            realSize = size;
        }
        return {
            isShowScroll,
            size: realSize,
        };
    }
    render() {
        const { data, width, height } = this.props;
        const config = this.createConfig();
        const { dimensionConfig, positionsConfig } = config;
        const newConfig = {
            ...this.createConfig(),
        };
        const { x, y } = positionsConfig;
        if (x.length === 0 && y.length === 0) {
            return React.createElement("svg", null);
        }
        return (React.createElement(ChartRenderer_1.default, { width: width, height: height, config: {
                ...newConfig,
                padding: [0, 0, 0, 0],
                scrollOffsetConfig: {
                    offsetX: 0,
                    offsetY: 0,
                },
            } }));
    }
}
exports.default = Chart;
