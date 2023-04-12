import { parse } from "@solidity-parser/parser";
import { ASTNode } from "@solidity-parser/parser/src/ast-types";
import * as graphlibDot from "graphlib-dot";
import { Graph } from "graphlib";
import {
  contractDefinitionDot,
  functionDefinitionDot,
  stateVariableDeclarationDot,
  variableDeclarationDot,
} from "./dot";
import { getInternalFunctionCalls } from "./getFunctionCalls";
import { getFunctionVars } from "./getFunctionVars";

export const solidity2Ast = (solidity: string) => {
  return parse(solidity, { loc: true, range: true });
};

export const sol2dot = (solidity: string) => {
  const ast = solidity2Ast(solidity);
  const graph = new Graph({
    directed: true,
    multigraph: true,
    compound: false,
  });
  const stateVars: Record<string, boolean> = {};

  const connectParent = (parent: string | null, child: string) => {
    if (parent == null) return;
    graph.setEdge(parent, child);
  };

  const traverse = (node: ASTNode, parent: string | null = null) => {
    console.log("Traversing node:", node.type);

    let name = "";
    switch (node.type) {
      case "SourceUnit":
        node.children.forEach((child) => traverse(child));
        break;
      case "ContractDefinition":
        name = contractDefinitionDot(graph, node);
        node.subNodes.forEach((child) => traverse(child as ASTNode, name));
        connectParent(parent, name);
        break;
      case "FunctionDefinition":
        name = functionDefinitionDot(graph, node);
        connectParent(parent, name);
        break;
      case "VariableDeclaration":
        name = variableDeclarationDot(graph, node);
        connectParent(parent, name);
        stateVars[name] = true;
        break;
      case "StateVariableDeclaration":
        name = stateVariableDeclarationDot(graph, parent || "Contract", node);
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

  const linkFunctionCalls = (node: ASTNode) => {
    console.log("Linking node:", node.type);

    switch (node.type) {
      case "SourceUnit":
        node.children.forEach((child) => linkFunctionCalls(child));
        break;
      case "ContractDefinition":
        node.subNodes.forEach((child) => linkFunctionCalls(child as ASTNode));
        break;
      case "FunctionDefinition":
        // find each internal function call and add an edge to it.
        const calls = getInternalFunctionCalls(node);
        const name = node.name || "Fallback";
        calls.forEach((call) =>
          graph.setEdge(name, call.name, {
            style: "dashed",
            label: "call",
            color: "blue",
          })
        );
        // find each state variable used and add an edge to it.
        // TODO: this can have false positives if a local variables name
        // is the same as a state variable.
        const vars = getFunctionVars(node);
        vars
          .filter((v) => stateVars[v.name])
          .forEach((v) =>
            graph.setEdge(name, v.name, {
              style: "dashed",
              label: "use",
              color: "dodgerblue4",
            })
          );
        break;
    }
  };

  traverse(ast);
  linkFunctionCalls(ast);

  return graphlibDot.write(graph);
};
