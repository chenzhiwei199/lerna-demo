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
class Clip extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (React.createElement("svg", { width: '400', height: '500' },
            React.createElement("rect", { width: '400', height: '500', strokeWidth: '1', stroke: 'green' }),
            React.createElement("g", { transform: 'translate(50, 50)' },
                React.createElement("g", { transform: 'translate(-50, 0)' },
                    React.createElement("g", { clipPath: `url(#test)` },
                        React.createElement("rect", { width: '100', height: '300', fill: 'red' }),
                        React.createElement("rect", { x: '100', width: '200', height: '300', fill: 'green' }),
                        React.createElement("rect", { x: '200', width: '200', height: '300', fill: 'yellow' }))),
                React.createElement("clipPath", { id: 'test' },
                    React.createElement("rect", { width: '100', height: '100' })))));
    }
}
exports.default = Clip;
