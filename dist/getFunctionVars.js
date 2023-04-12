"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFunctionVars = void 0;
const getFunctionVars = (def) => {
    if (def.body == null)
        return [];
    const vars = [];
    buildFunctionVars(vars, def.body);
    return vars;
};
exports.getFunctionVars = getFunctionVars;
const buildFunctionVars = (vars, node) => {
    switch (node.type) {
        case "Block":
            node.statements.forEach((statement) => buildFunctionVars(vars, statement));
            break;
        case "ExpressionStatement":
            if (node.expression)
                buildFunctionVars(vars, node.expression);
            break;
        case "IfStatement":
            buildFunctionVars(vars, node.trueBody);
            if (node.falseBody != null)
                buildFunctionVars(vars, node.falseBody);
            break;
        case "BinaryOperation":
            buildFunctionVars(vars, node.left);
            buildFunctionVars(vars, node.right);
            break;
        case "Identifier":
            vars.push(node);
            break;
        case "ReturnStatement":
            if (node.expression)
                buildFunctionVars(vars, node.expression);
            break;
        default:
            break;
    }
};
