"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sol2dot = exports.solidity2Ast = void 0;
const parser_1 = require("@solidity-parser/parser");
const graphlibDot = __importStar(require("graphlib-dot"));
const graphlib_1 = require("graphlib");
const dot_1 = require("./dot");
const getFunctionCalls_1 = require("./getFunctionCalls");
const getFunctionVars_1 = require("./getFunctionVars");
const solidity2Ast = (solidity) => {
    return (0, parser_1.parse)(solidity, { loc: true, range: true });
};
exports.solidity2Ast = solidity2Ast;
const sol2dot = (solidity) => {
    const ast = (0, exports.solidity2Ast)(solidity);
    const graph = new graphlib_1.Graph({
        directed: true,
        multigraph: true,
        compound: false,
    });
    const stateVars = {};
    const connectParent = (parent, child) => {
        if (parent == null)
            return;
        graph.setEdge(parent, child);
    };
    const traverse = (node, parent = null) => {
        console.log("Traversing node:", node.type);
        let name = "";
        switch (node.type) {
            case "SourceUnit":
                node.children.forEach((child) => traverse(child));
                break;
            case "ContractDefinition":
                name = (0, dot_1.contractDefinitionDot)(graph, node);
                node.subNodes.forEach((child) => traverse(child, name));
                connectParent(parent, name);
                break;
            case "FunctionDefinition":
                name = (0, dot_1.functionDefinitionDot)(graph, node);
                connectParent(parent, name);
                break;
            case "VariableDeclaration":
                name = (0, dot_1.variableDeclarationDot)(graph, node);
                connectParent(parent, name);
                stateVars[name] = true;
                break;
            case "StateVariableDeclaration":
                name = (0, dot_1.stateVariableDeclarationDot)(graph, parent || "Contract", node);
                node.variables.forEach((child) => traverse(child, name));
                connectParent(parent, name);
                break;
            case "PragmaDirective":
                console.log("PRAGMA", node.value);
                break;
            default:
                console.log("unhandled node type", node.type);
                break;
        }
    };
    const linkFunctionCalls = (node) => {
        console.log("Linking node:", node.type);
        switch (node.type) {
            case "SourceUnit":
                node.children.forEach((child) => linkFunctionCalls(child));
                break;
            case "ContractDefinition":
                node.subNodes.forEach((child) => linkFunctionCalls(child));
                break;
            case "FunctionDefinition":
                // find each internal function call and add an edge to it.
                const calls = (0, getFunctionCalls_1.getInternalFunctionCalls)(node);
                const name = node.name || "Fallback";
                calls.forEach((call) => graph.setEdge(name, call.name, {
                    style: "dashed",
                    label: "call",
                    color: "blue",
                }));
                // find each state variable used and add an edge to it.
                // TODO: this can have false positives if a local variables name
                // is the same as a state variable.
                const vars = (0, getFunctionVars_1.getFunctionVars)(node);
                vars
                    .filter((v) => stateVars[v.name])
                    .forEach((v) => graph.setEdge(name, v.name, {
                    style: "dashed",
                    label: "use",
                    color: "dodgerblue4",
                }));
                break;
        }
    };
    traverse(ast);
    linkFunctionCalls(ast);
    return graphlibDot.write(graph);
};
exports.sol2dot = sol2dot;
