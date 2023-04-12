"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInternalFunctionCalls = void 0;
const getInternalFunctionCalls = (def) => {
    if (def.body == null)
        return [];
    const calls = [];
    buildFunctionCalls(calls, def.body);
    return calls;
};
exports.getInternalFunctionCalls = getInternalFunctionCalls;
const buildFunctionCalls = (calls, node) => {
    if (node.type == "FunctionCall") {
        const identifier = node.expression;
        if (identifier != null && identifier.type == "Identifier") {
            calls.push(identifier);
        }
        return;
    }
    if (node.type == "Block") {
        node.statements.forEach((statement) => buildFunctionCalls(calls, statement));
        return;
    }
    if (node.type == "ExpressionStatement") {
        const expression = node.expression;
        if (expression != null)
            buildFunctionCalls(calls, expression);
        return;
    }
    if (node.type == "IfStatement") {
        const ifStatement = node;
        buildFunctionCalls(calls, ifStatement.trueBody);
        if (ifStatement.falseBody != null)
            buildFunctionCalls(calls, ifStatement.falseBody);
        return;
    }
    return;
};
