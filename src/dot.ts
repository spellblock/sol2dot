import { Graph } from "graphlib";

import {
  ContractDefinition,
  FunctionDefinition,
  StateVariableDeclaration,
  VariableDeclaration,
} from "@solidity-parser/parser/src/ast-types";
import { getFunctionParams } from "./getFunctionParams";

const visibility2color = {
  default: "Black",
  public: "Blue",
  external: "Blue",
  private: "Red",
  internal: "Red",
};

export const contractDefinitionDot = (
  graph: Graph,
  def: ContractDefinition
) => {
  const name = def.name || "Contract";
  graph.setNode(name, {
    label: `{ ${def.name} | Contract }`,
    shape: "record",
    color: "Black",
  });
  return name;
};

export const functionDefinitionDot = (
  graph: Graph,
  def: FunctionDefinition
) => {
  const name = def.name || "Fallback";
  const params = def.parameters || [];

  const paramLabels = getFunctionParams(def).join(", ");
  const label = `{ ${def.name}(${paramLabels}) | ${def.visibility} Function | ${
    def.stateMutability || ""
  } }`;

  graph.setNode(name, {
    label: label,
    shape: "record",
    color: visibility2color[def.visibility || "default"],
  });
  return name;
};

export const variableDeclarationDot = (
  graph: Graph,
  def: VariableDeclaration
) => {
  const name = def.name || "Fallback";
  graph.setNode(name, {
    label: `{ ${def.name} | ${def.visibility} Variable }`,
    shape: "record",
    color: visibility2color[def.visibility || "default"],
  });
  return name;
};

export const stateVariableDeclarationDot = (
  graph: Graph,
  parent: string,
  def: StateVariableDeclaration
) => {
  const name = `${parent}:State Variables`;
  graph.setNode(name, {
    label: `State Variables`,
    shape: "record",
    style: "dashed",
  });
  return name;
};
