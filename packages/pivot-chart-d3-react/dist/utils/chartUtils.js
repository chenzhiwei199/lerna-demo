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
const d3 = __importStar(require("d3"));
const matrix_1 = require("./matrix");
const global_d_1 = require("../global.d");
const SizeOptions_1 = require("../help/SizeOptions");
const Offset_1 = __importDefault(require("../help/Offset"));
function checkIsCategory(types) {
    return check(types, (type) => type === global_d_1.ScaleType.CATEGORY || type === global_d_1.ScaleType.TIME_CATEGORY);
}
exports.checkIsCategory = checkIsCategory;
function checkIsLinear(types) {
    return check(types, (type) => type === global_d_1.ScaleType.LINEAR);
}
exports.checkIsLinear = checkIsLinear;
function check(types, checkFunc) {
    if (Array.isArray(types)) {
        return types.some((currentCell) => check(currentCell, checkFunc));
    }
    else {
        types = (types || {});
        if (checkFunc(types)) {
            return true;
        }
    }
    return false;
}
exports.check = check;
function getScale(cell, max) {
    let scale;
    if (!cell || !cell.code) {
        return null;
    }
    if (checkIsLinear(cell.type)) {
        // 双轴线性
        scale = getScaleByType(cell.type, 0, max);
        scale = scale.domain(cell.range);
    }
    else if (checkIsCategory(cell.type)) {
        // x轴离散，y轴线性
        scale = getScaleByType(cell.type, 0, max);
        scale = scale.domain(cell.range).padding(0.2);
    }
    return scale;
}
exports.getScale = getScale;
function getScaleByType(type, min = 0, max) {
    switch (type) {
        case global_d_1.ScaleType.LINEAR:
            return d3
                .scaleLinear()
                .range([min, max])
                .nice(3);
        case global_d_1.ScaleType.CATEGORY:
            return d3.scaleBand().range([min, max]);
        default:
            return d3.scaleBand().range([min, max]);
    }
}
exports.getScaleByType = getScaleByType;
function getAxis(type, cell, size, isLabelRotate = false) {
    const scale = getScale(cell, size);
    let axis;
    // 坐标轴举证变换
    let transform;
    // 调度
    let angle;
    let firstTextAnchor;
    let firstVerticalAnchor;
    let textAnchor;
    let verticalAnchor;
    const { axis: b2lMatrix } = matrix_1.b2LAxisMatrix(size);
    if (checkIsLinear(cell.type)) {
        if (type === global_d_1.DIRECTION.VERTICAL) {
            // 线性 & 垂直 = 首个坐标轴标签样式优化，画到x轴线之上
            firstVerticalAnchor = 'end';
        }
        else {
            // 线性 & 水平 = 首个坐标轴标签样式优化，画到y轴线之右
            firstTextAnchor = 'start';
        }
    }
    else {
        // 离散，标签旋转
        if (type === global_d_1.DIRECTION.HORIZONTAL && isLabelRotate) {
            (textAnchor = 'start'), (verticalAnchor = 'middle'), (angle = 90);
        }
    }
    // 根据方向不同，画不同的坐标轴
    if (type === global_d_1.DIRECTION.HORIZONTAL) {
        axis = d3.axisBottom(scale);
    }
    else {
        axis = d3.axisLeft(scale);
        transform = `matrix(${matrix_1.getTransformMatrix(b2lMatrix)})`;
    }
    return {
        // scale
        scale,
        // 标签
        axis,
        // 坐标轴变换
        transform,
        // 旋转角度
        angle,
        // 文本变化
        textAnchor,
        verticalAnchor,
        firstTextAnchor,
        firstVerticalAnchor,
    };
}
exports.getAxis = getAxis;
function createAxis(name) {
    switch (name) {
        case global_d_1.PositionEnum.ROW:
            return 'Left';
        case global_d_1.PositionEnum.COL:
            return 'Bottom';
        default:
            break;
    }
}
function createSets(data, key) {
    const sets = new Set();
    const arr = [];
    data.forEach(d => {
        if (!sets.has(d[key])) {
            arr.push(d[key]);
            sets.add(d[key]);
        }
    });
    return arr;
}
const produceRange = (data) => (cell) => {
    let range;
    const isCategory = checkIsCategory(cell.type);
    if (isCategory) {
        range = createSets(data, cell.code);
    }
    else {
        const min = d3.min(data, d => d[cell.code]);
        range = [min < 0 ? min : 0, d3.max(data, d => d[cell.code])];
    }
    return {
        ...cell,
        range,
    };
};
function produceScale(data, x, y) {
    return {
        x: x.map(produceRange(data)),
        y: y.map(produceRange(data)),
    };
}
exports.produceScale = produceScale;
/**
 *
 * @param x
 */
function produceCategoryInfo(x) {
    let categorys = x.filter(t => checkIsCategory(t.type));
    const linears = x.filter(t => checkIsLinear(t.type));
    // 为了展示， 没有线性值的情况， 如果线性值不存在，则双坐标轴都是离散值
    if (linears.length !== 0) {
        x = linears;
    }
    else if (categorys.length > 0) {
        x = categorys.slice(categorys.length - 1);
        categorys = categorys.slice(0, categorys.length - 1);
    }
    return { cell: x, categorys };
}
exports.produceCategoryInfo = produceCategoryInfo;
/**
 * 1.获取分面的维度 2.获取分面的深度 3. 获取一个方向分面的数量 4.获取当前最小cell的字段类型
 *
 * @export
 * @param {Array<any>} data
 * @param {Array<Cell>} x
 * @returns
 */
function produceConfig(x) {
    const categoryInfo = produceCategoryInfo(x);
    const categorys = categoryInfo.categorys;
    return {
        categorys,
        cells: categoryInfo.cell,
    };
}
exports.produceConfig = produceConfig;
function produceSizeConfig(size, nums, minSize) {
    let treeContainerWidth = size / nums;
    if (nums * minSize > size) {
        // 间距
        treeContainerWidth = minSize * nums;
    }
    const isXWidthControl = treeContainerWidth !== size;
    return {
        isControl: isXWidthControl,
        size: treeContainerWidth,
    };
}
exports.produceSizeConfig = produceSizeConfig;
function flattenCategoryValues(root = [], data, categorys, level = 0) {
    let newRoot = [];
    const currentCategory = categorys[level];
    if (level >= data.length) {
        return root;
    }
    if (level === 0) {
        newRoot = data[level].map(item => item[currentCategory.code]);
    }
    if (level < data.length) {
        root.forEach(t1 => {
            data[level].forEach(t2 => {
                newRoot.push(`${t1}-${t2[currentCategory.code]}`);
            });
        });
    }
    return flattenCategoryValues(newRoot, data, categorys, level + 1);
}
exports.flattenCategoryValues = flattenCategoryValues;
function getScollInfo(containerSize, realSize, minSize = 15) {
    // 滚动条宽度 (容器宽度 / 实际宽度)  = 滚动条宽度 / 容器宽度
    let scrollBarSize = (containerSize / realSize) * containerSize;
    if (minSize > scrollBarSize) {
        scrollBarSize = minSize;
    }
    // 最大的滚动距离,
    const maxScroll = Math.max(containerSize - scrollBarSize, 0);
    // 视图最大的滚动距离
    const viewMaxScroll = realSize - containerSize;
    return {
        scrollBarSize,
        maxScroll,
        viewMaxScroll,
    };
}
exports.getScollInfo = getScollInfo;
exports.getViewScrollDistance = (containerSize, realSize) => scrollDistance => {
    const { scrollBarSize, maxScroll, viewMaxScroll } = getScollInfo(containerSize, realSize);
    // 视图滚动距离 (当前滚动距离 / 最大可滚距离) = 滚动比例    滚动比例 * 实际宽度 = 实际视图滚动距离
    const viewPosition = (scrollDistance / maxScroll) * viewMaxScroll || 0;
    // 视图滚动距离 (当前滚动距离 / 最大可滚距离) = 滚动比例    滚动比例 * 滚动条滚动区间范围 = 实际滚动条滚动距离
    const scrollBarPosition = (scrollDistance / maxScroll) * maxScroll || 0;
    return {
        viewPosition,
        scrollBarPosition,
    };
};
exports.getAxisInfo = (type, cell, size) => {
    let scale;
    let axis;
    // 坐标轴举证变换
    let transform;
    // 坐标轴标签举证变换
    let labelTransform;
    if (type === global_d_1.AxisType.x) {
        scale = getScale(cell, size);
        axis = d3.axisBottom(scale);
    }
    else {
        const { axis: b2lMatrix, label: b2lLabelMaxtrix } = matrix_1.b2LAxisMatrix(size);
        scale = getScale(cell, size);
        axis = d3.axisLeft(scale);
        transform = `matrix(${matrix_1.getTransformMatrix(b2lMatrix)})`;
        labelTransform = `matrix(${matrix_1.getTransformMatrix(b2lLabelMaxtrix)})`;
    }
    return {
        scale,
        axis,
        transform,
        labelTransform,
    };
};
function getCategoryValues(data, categorys) {
    const categoryValues = [];
    categorys.forEach((category, index) => {
        const currentCategoryValues = [];
        const currentCategoryValuesSet = new Set();
        data.forEach(currentData => {
            if (!currentCategoryValuesSet.has(currentData[category])) {
                currentCategoryValues.push(currentData);
                currentCategoryValuesSet.add(currentData[category]);
            }
        });
        categoryValues.push(currentCategoryValues);
    });
    return categoryValues;
}
exports.getCategoryValues = getCategoryValues;
function countTreeData(data, keyArray) {
    // 如果没有维度分隔，则高度为1
    if (keyArray.length === 0) {
        return 1;
    }
    const categoryValues = getCategoryValues(data, keyArray);
    let count = 1;
    categoryValues.forEach(values => {
        count = count * (values.length > 0 ? values.length : 1);
    });
    return count;
}
exports.countTreeData = countTreeData;
function getGraphOffset(sizeOptions) {
    const size = sizeOptions.get();
    const facetSize = size.get(SizeOptions_1.ELEMENT_TYPE.FACET_LABEL);
    const measureSize = size.get(SizeOptions_1.ELEMENT_TYPE.MEASURE_LABEL);
    const axisSize = size.get(SizeOptions_1.ELEMENT_TYPE.AXIS);
    return new Offset_1.default(facetSize.getWidth() + measureSize.getWidth() + axisSize.getWidth(), facetSize.getHeight());
}
exports.getGraphOffset = getGraphOffset;
function getXAxisOffset(sizeOptions) {
    const size = sizeOptions.get();
    const facetSize = size.get(SizeOptions_1.ELEMENT_TYPE.FACET_LABEL);
    const measureSize = size.get(SizeOptions_1.ELEMENT_TYPE.MEASURE_LABEL);
    const axisSize = size.get(SizeOptions_1.ELEMENT_TYPE.AXIS);
    const graphSize = size.get(SizeOptions_1.ELEMENT_TYPE.GEOM);
    return new Offset_1.default(facetSize.getWidth() + measureSize.getWidth() + axisSize.getWidth(), facetSize.getHeight() + graphSize.getHeight());
}
exports.getXAxisOffset = getXAxisOffset;
function getXFacetOffset(sizeOptions) {
    const size = sizeOptions.get();
    const facetSize = size.get(SizeOptions_1.ELEMENT_TYPE.FACET_LABEL);
    const measureSize = size.get(SizeOptions_1.ELEMENT_TYPE.MEASURE_LABEL);
    const axisSize = size.get(SizeOptions_1.ELEMENT_TYPE.AXIS);
    return new Offset_1.default(facetSize.getWidth() + measureSize.getWidth() + axisSize.getWidth(), 0);
}
exports.getXFacetOffset = getXFacetOffset;
function getYFacetOffset(sizeOptions) {
    const size = sizeOptions.get();
    const facetSize = size.get(SizeOptions_1.ELEMENT_TYPE.FACET_LABEL);
    return new Offset_1.default(0, facetSize.getHeight());
}
exports.getYFacetOffset = getYFacetOffset;
function getXMeasureNameOffset(sizeOptions) {
    const size = sizeOptions.get();
    const facetSize = size.get(SizeOptions_1.ELEMENT_TYPE.FACET_LABEL);
    const measureSize = size.get(SizeOptions_1.ELEMENT_TYPE.MEASURE_LABEL);
    const axisSize = size.get(SizeOptions_1.ELEMENT_TYPE.AXIS);
    const graphSize = size.get(SizeOptions_1.ELEMENT_TYPE.GEOM);
    return new Offset_1.default(facetSize.getWidth() + measureSize.getWidth() + axisSize.getWidth(), facetSize.getHeight() + graphSize.getHeight() + axisSize.getHeight());
}
exports.getXMeasureNameOffset = getXMeasureNameOffset;
function getYMeasureNameOffset(sizeOptions) {
    const size = sizeOptions.get();
    const facetSize = size.get(SizeOptions_1.ELEMENT_TYPE.FACET_LABEL);
    return new Offset_1.default(facetSize.getWidth(), facetSize.getHeight());
}
exports.getYMeasureNameOffset = getYMeasureNameOffset;
function getYAxisOffset(sizeOptions) {
    const size = sizeOptions.get();
    const facetSize = size.get(SizeOptions_1.ELEMENT_TYPE.FACET_LABEL);
    const measureSize = size.get(SizeOptions_1.ELEMENT_TYPE.MEASURE_LABEL);
    return new Offset_1.default(facetSize.getWidth() + measureSize.getWidth(), facetSize.getHeight());
}
exports.getYAxisOffset = getYAxisOffset;
/**
 * 获取坐标轴的数据
 * @param categorys
 * @param values
 * @param cells
 * @param size
 */
function createAxisData(categorys, values, cells, size) {
    const data = [];
    const facetData = [];
    let sum = 1;
    if (values.length === 0) {
        cells.forEach(cell => {
            data.push({
                ...cell,
                label: cell.code,
            });
        });
    }
    else {
        values.forEach((value, index) => {
            sum = sum * value.length;
            const facetCellData = [];
            value.forEach(cur => {
                cells.forEach(cell => {
                    data.push({
                        ...cell,
                        label: cell.code,
                    });
                });
                facetCellData.push({
                    label: cur[categorys[index].code],
                });
            });
            facetData.push({
                size: size / sum,
                data: facetCellData,
            });
        });
    }
    sum = sum * cells.length;
    return {
        size: size / sum,
        facetData,
        data,
    };
}
exports.createAxisData = createAxisData;
function isRotate(xData) {
    let labelRotate = false;
    const xLength = xData.reduce((l, item) => {
        return l + (item && item.range ? item.range.length : 0);
    }, 0);
    if (xLength > 15) {
        labelRotate = true;
    }
    return labelRotate && checkIsCategory(xData[0].type);
}
exports.isRotate = isRotate;
const mathSign = value => {
    if (value === 0) {
        return 0;
    }
    if (value > 0) {
        return 1;
    }
    return -1;
};
/**
 * Get the ticks of an axis
 * @param  {Object}  axis The configuration of an axis
 * @param {Boolean} isGrid Whether or not are the ticks in grid
 * @param {Boolean} isAll Return the ticks of all the points or not
 * @return {Array}  Ticks
 */
exports.getTicksOfAxis = (axis, isGrid, isAll) => {
    if (!axis) {
        return null;
    }
    const { scale } = axis;
    const { duplicateDomain, type, range } = axis;
    let offset = (isGrid || isAll) && type === 'category' && scale.bandwidth
        ? scale.bandwidth() / 2
        : 0;
    offset =
        axis.axisType === 'angleAxis'
            ? mathSign(range[0] - range[1]) * 2 * offset
            : offset;
    // The ticks setted by user should only affect the ticks adjacent to axis line
    if (isGrid && (axis.ticks || axis.niceTicks)) {
        return (axis.ticks || axis.niceTicks).map(entry => {
            const scaleContent = duplicateDomain
                ? duplicateDomain.indexOf(entry)
                : entry;
            return {
                coordinate: scale(scaleContent) + offset,
                value: entry,
                offset,
            };
        });
    }
    if (axis.isCategorial && axis.categoricalDomain) {
        return axis.categoricalDomain.map((entry, index) => ({
            coordinate: scale(entry),
            value: entry,
            index,
            offset,
        }));
    }
    if (scale.ticks && !isAll) {
        return scale.ticks(axis.tickCount).map(entry => ({
            coordinate: scale(entry) + offset,
            value: entry,
            offset,
        }));
    }
    // When axis has duplicated text, serial numbers are used to generate scale
    return scale.domain().map((entry, index) => ({
        coordinate: scale(entry) + offset,
        value: duplicateDomain ? duplicateDomain[entry] : entry,
        index,
        offset,
    }));
};
function getMatrix(direction, size) {
    const { axis: b2lMatrix } = matrix_1.b2LAxisMatrix(size);
    if (direction === global_d_1.DIRECTION.VERTICAL) {
        return b2lMatrix;
    }
    else {
        return matrix_1.getNoneMatrix();
    }
}
exports.getMatrix = getMatrix;
