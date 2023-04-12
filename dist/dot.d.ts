import { Graph } from "graphlib";
import { ContractDefinition, FunctionDefinition, StateVariableDeclaration, VariableDeclaration } from "@solidity-parser/parser/src/ast-types";
export declare const contractDefinitionDot: (graph: Graph, def: ContractDefinition) => string;
export declare const functionDefinitionDot: (graph: Graph, def: FunctionDefinition) => string;
export declare const variableDeclarationDot: (graph: Graph, def: VariableDeclaration) => string;
export declare const stateVariableDeclarationDot: (graph: Graph, parent: string, def: StateVariableDeclaration) => string;
