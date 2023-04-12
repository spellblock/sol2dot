import {
  Identifier,
  ASTNode,
  Block,
  ExpressionStatement,
  IfStatement,
  FunctionDefinition,
} from "@solidity-parser/parser/src/ast-types";

export const getFunctionVars = (def: FunctionDefinition) => {
  if (def.body == null) return [];

  const vars: Identifier[] = [];
  buildFunctionVars(vars, def.body);
  return vars;
};

const buildFunctionVars = (vars: Identifier[], node: ASTNode) => {
  switch (node.type) {
    case "Block":
      node.statements.forEach((statement) =>
        buildFunctionVars(vars, statement as ASTNode)
      );
      break;
    case "ExpressionStatement":
      if (node.expression) buildFunctionVars(vars, node.expression);
      break;
    case "IfStatement":
      buildFunctionVars(vars, node.trueBody);
      if (node.falseBody != null) buildFunctionVars(vars, node.falseBody);
      break;
    case "BinaryOperation":
      buildFunctionVars(vars, node.left);
      buildFunctionVars(vars, node.right);
      break;
    case "Identifier":
      vars.push(node);
      break;
    case "ReturnStatement":
      if (node.expression) buildFunctionVars(vars, node.expression);
      break;
    default:
      break;
  }
};
