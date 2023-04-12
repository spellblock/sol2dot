"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stateVariableDeclarationDot = exports.variableDeclarationDot = exports.functionDefinitionDot = exports.contractDefinitionDot = void 0;
const getFunctionParams_1 = require("./getFunctionParams");
const visibility2color = {
    default: "Black",
    public: "Blue",
    external: "Blue",
    private: "Red",
    internal: "Red",
};
const contractDefinitionDot = (graph, def) => {
    const name = def.name || "Contract";
    graph.setNode(name, {
        label: `{ ${def.name} | Contract }`,
        shape: "record",
        color: "Black",
    });
    return name;
};
exports.contractDefinitionDot = contractDefinitionDot;
const functionDefinitionDot = (graph, def) => {
    const name = def.name || "Fallback";
    const params = def.parameters || [];
    const paramLabels = (0, getFunctionParams_1.getFunctionParams)(def).join(", ");
    const label = `{ ${def.name}(${paramLabels}) | ${def.visibility} Function | ${def.stateMutability || ""} }`;
    graph.setNode(name, {
        label: label,
        shape: "record",
        color: visibility2color[def.visibility || "default"],
    });
    return name;
};
exports.functionDefinitionDot = functionDefinitionDot;
const variableDeclarationDot = (graph, def) => {
    const name = def.name || "Fallback";
    graph.setNode(name, {
        label: `{ ${def.name} | ${def.visibility} Variable }`,
        shape: "record",
        color: visibility2color[def.visibility || "default"],
    });
    return name;
};
exports.variableDeclarationDot = variableDeclarationDot;
const stateVariableDeclarationDot = (graph, parent, def) => {
    const name = `${parent}:State Variables`;
    graph.setNode(name, {
        label: `State Variables`,
        shape: "record",
        style: "dashed",
    });
    return name;
};
exports.stateVariableDeclarationDot = stateVariableDeclarationDot;
