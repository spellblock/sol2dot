import {
  ASTNode,
  BaseASTNode,
  Block,
  ExpressionStatement,
  FunctionDefinition,
  Identifier,
  IfStatement,
} from "@solidity-parser/parser/src/ast-types";

export const getInternalFunctionCalls = (def: FunctionDefinition) => {
  if (def.body == null) return [];
  const calls: Identifier[] = [];
  buildFunctionCalls(calls, def.body);
  return calls;
};

const buildFunctionCalls = (calls: Identifier[], node: ASTNode) => {
  if (node.type == "FunctionCall") {
    const identifier = node.expression as Identifier;
    if (identifier != null && identifier.type == "Identifier") {
      calls.push(identifier);
    }
    return;
  }

  if (node.type == "Block") {
    (node as Block).statements.forEach((statement) =>
      buildFunctionCalls(calls, statement as ASTNode)
    );
    return;
  }

  if (node.type == "ExpressionStatement") {
    const expression = (node as ExpressionStatement).expression;
    if (expression != null) buildFunctionCalls(calls, expression);
    return;
  }

  if (node.type == "IfStatement") {
    const ifStatement = node as IfStatement;
    buildFunctionCalls(calls, ifStatement.trueBody);
    if (ifStatement.falseBody != null)
      buildFunctionCalls(calls, ifStatement.falseBody);
    return;
  }

  return;
};
