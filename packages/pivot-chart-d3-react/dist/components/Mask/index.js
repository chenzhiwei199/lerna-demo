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
class Mask extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { className, sizeConfig, id, transform, clipTransform } = this.props;
        const { width, height } = sizeConfig;
        return (React.createElement("g", { className: className, transform: transform },
            React.createElement("g", { clipPath: `url(#${id})` }, this.props.children),
            React.createElement("g", { transform: clipTransform },
                React.createElement("clipPath", { id: id },
                    React.createElement("rect", { height: height, width: width })))));
    }
}
exports.default = Mask;
