"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Node {
    constructor(key, childKey, level) {
        this.children = new Map();
        this.key = key;
        this.childKey = childKey;
        this.level = level;
        this.rawData = [];
        this._aggData = null;
    }
    push() {
        // eslint-disable-next-line prefer-rest-params
        this.rawData.push(...arguments);
    }
    aggData(aggFunc, measures = []) {
        this._aggData = aggFunc(this.rawData, measures);
        return this._aggData;
    }
}
class MomentCube {
    constructor(props) {
        this.tree = null;
        this.aggFunc = props.aggFunc;
        this.factTable = props.factTable;
        this.dimensions = props.dimensions;
        this.measures = props.measures;
        this.buildTree();
        this.aggTree(this.tree);
    }
    setData(props) {
        let { aggFunc = this.aggFunc, factTable = this.factTable, dimensions = this.dimensions, measures = this.measures, } = props;
        if (dimensions !== this.dimensions || factTable !== this.factTable) {
            this.dimensions = dimensions;
            this.factTable = factTable;
            this.measures = measures;
            this.aggFunc = aggFunc;
            this.buildTree();
            this.aggTree(this.tree);
        }
        else if (measures !== this.measures || aggFunc !== this.aggFunc) {
            this.measures = measures;
            this.aggFunc = aggFunc;
            this.aggTree(this.tree);
        }
    }
    buildTree() {
        let tree = new Node();
        let len = this.factTable.length;
        let i;
        for (i = 0; i < len; i++) {
            this.insertNode(this.factTable[i], tree, 0);
        }
        this.tree = tree;
        return tree;
    }
    insertNode(record, node, level) {
        if (level === this.dimensions.length) {
            node.push(record);
        }
        else {
            let childKey = level + 1 >= this.dimensions.length ? null : this.dimensions[level + 1];
            let member = record[this.dimensions[level]];
            if (!node.children.has(member)) {
                node.children.set(member, new Node(this.dimensions[level], childKey, level));
            }
            this.insertNode(record, node.children.get(member), level + 1);
        }
    }
    aggTree(node) {
        if (node === null) {
            return null;
        }
        if (node) {
            if (node.children.size > 0) {
                node.rawData = [];
                let children = node.children.values();
                for (let child of children) {
                    let i;
                    let data = this.aggTree(child).rawData;
                    let len = data.length;
                    for (i = 0; i < len; i++) {
                        node.rawData.push(data[i]);
                    }
                }
            }
            node.aggData(this.aggFunc, this.measures);
            return node;
        }
        else {
            return null;
        }
    }
}
exports.MomentCube = MomentCube;
function count(subset, MEASURES) {
    let cnts = {};
    MEASURES.forEach(mea => {
        cnts[mea] = 0;
    });
    for (let i = 0, len = subset.length; i < len; i++) {
        MEASURES.forEach(mea => {
            cnts[mea]++;
        });
    }
    return cnts;
}
function createCube({ aggFunc = count, factTable = [], dimensions = [], measures = [], }) {
    return new MomentCube({
        aggFunc,
        factTable,
        dimensions,
        measures,
    });
}
exports.default = createCube;
