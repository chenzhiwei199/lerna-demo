"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const victory_core_1 = require("victory-core");
const global_d_1 = require("../../global.d");
function default_1(props) {
    const { firstTextAnchor, firstVerticalAnchor, type, index } = props;
    const config = {};
    if (index === 0) {
        if (type === global_d_1.DIRECTION.HORIZONTAL) {
            config.textAnchor = firstTextAnchor;
        }
        else {
            config.verticalAnchor = firstVerticalAnchor;
        }
    }
    // 离散型 + rotate =  (textAnchor = start, vierticalAnchor = middle)
    return React.createElement(victory_core_1.VictoryLabel, Object.assign({}, props, config));
}
exports.default = default_1;
