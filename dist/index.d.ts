export declare const solidity2Ast: (
  solidity: string
) => import("@solidity-parser/parser/dist/src/ast-types").SourceUnit & {
  errors?: any[] | undefined;
  tokens?: import("@solidity-parser/parser/dist/src/types").Token[] | undefined;
};
export declare const sol2dot: (solidity: string) => string;
