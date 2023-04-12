import {
  ASTNode,
  FunctionDefinition,
  Identifier,
} from "@solidity-parser/parser/src/ast-types";

export const getFunctionParams = (def: FunctionDefinition) => {
  const names: string[] = [];

  def.parameters.forEach((param) =>
    names.push(param.name + ":" + getParamType(param.typeName))
  );

  return names;
};

const getParamType = (param: ASTNode | null): string => {
  if (param == null) return "unknown";

  switch (param.type) {
    case "VariableDeclaration":
      return getParamType(param.typeName);
    case "ElementaryTypeName":
      return param.name;
    case "UserDefinedTypeName":
      return param.namePath;
    case "ArrayTypeName":
      return getParamType(param.baseTypeName) + "[]";
    case "Mapping":
      return (
        "mapping(" +
        getParamType(param.keyType) +
        " => " +
        getParamType(param.valueType) +
        ")"
      );
    default:
      return "unknown";
  }
};
