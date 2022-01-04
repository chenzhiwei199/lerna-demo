"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
var Label_1 = require("./components/Label");
exports.Label = Label_1.default;
var Block_1 = require("./components/Block");
exports.Block = Block_1.default;
var LabelGroup_1 = require("./components/Groups/LabelGroup");
exports.AxisGroup = LabelGroup_1.default;
var ClipTest_1 = require("./components/ClipTest");
exports.ClipTest = ClipTest_1.default;
var Offset_1 = require("./help/Offset");
exports.Offset = Offset_1.default;
var DataCreator_1 = require("./components/DataCreator");
exports.DataCreator = DataCreator_1.default;
exports.default = props => React.createElement("svg", null, props.children);
__export(require("./global.d"));
