"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chartUtils_1 = require("../../utils/chartUtils");
class BaseGeom {
    constructor(props) {
        this.scrollSize = 15;
        this.scrollGap = 3;
        this.labelSize = 30;
        this.minWidth = 150;
        this.minHeight = 100;
        this.groupCellPadding = [0, 50, 0, 0];
        this.treeCellPadding = [0, 50, 0, 0];
        const { rows, cols, data, width, height } = props;
        this.width = width;
        this.height = height;
        this.rows = rows;
        this.cols = cols;
        this.data = data;
    }
    getTreeCellPadding() {
        return this.treeCellPadding;
    }
    getCellValues(data, cells) {
        const currentValues = cells && cells[0] ? chartUtils_1.getCategoryValues(data, [cells[0].code]) : [];
        return currentValues;
    }
    getGroupCellPadding() {
        return this.groupCellPadding;
    }
    render() {
        console.warn('BaseGeom render');
    }
}
exports.default = BaseGeom;
// export type CellType = LinearType | CategoryType;
// export type LinearType = CellTypeEnum.LINEAR | CellTypeEnum.TIME_LINEAR;
// export type CategoryType = CellTypeEnum.CATEGORY | CellTypeEnum.TIME_CATEGORY;
// export enum PositionEnum  {
//   ROW = 'row',
//   COL = 'col',
// }
// export enum CellTypeEnum {
//   LINEAR = 'linear',
//   CATEGORY = 'category',
//   TIME_LINEAR = 'timeLinear',
//   TIME_CATEGORY = 'timeCategory',
// }
// export type Container = d3.Selection<SVGGElement, {}, SVGGElement, {}>;
