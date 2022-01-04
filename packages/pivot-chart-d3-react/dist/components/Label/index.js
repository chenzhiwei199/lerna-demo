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
const Offset_1 = __importDefault(require("../../help/Offset"));
class Label extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { fill, offset = new Offset_1.default(0, 0), label, isTranspose } = this.props;
        let translate = offset.toTransform();
        let dominantBaseline = '';
        if (isTranspose) {
            translate = `${translate}rotate(90)`;
        }
        else {
            dominantBaseline = 'hanging';
        }
        return (React.createElement("text", { textAnchor: 'middle', dominantBaseline: dominantBaseline, transform: translate, fill: fill }, label.slice(0, 10)));
    }
}
Label.defaultProps = {
    fill: 'black',
    isTranspose: false,
};
exports.default = Label;
