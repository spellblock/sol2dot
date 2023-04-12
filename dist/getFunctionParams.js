"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFunctionParams = void 0;
const getFunctionParams = (def) => {
    const names = [];
    def.parameters.forEach((param) => names.push(param.name + ":" + getParamType(param.typeName)));
    return names;
};
exports.getFunctionParams = getFunctionParams;
const getParamType = (param) => {
    if (param == null)
        return "unknown";
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
            return ("mapping(" +
                getParamType(param.keyType) +
                " => " +
                getParamType(param.valueType) +
                ")");
        default:
            return "unknown";
    }
};
