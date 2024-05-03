import { createSourceFile, ScriptTarget, Node } from "typescript";
import * as ts from "typescript";

export function findFunctionDeclarations(sourceCode: string) {
  const sourceFile = createSourceFile(
    "example.ts",
    sourceCode,
    ScriptTarget.ESNext,
    true,
  );

  let functions: string[] = [];

  sourceFile.forEachChild((node: Node) => {
    if (ts.isFunctionDeclaration(node)) {
      const functionText = sourceCode.substring(node.pos, node.end);

      functions.push(functionText);
    } else if (ts.isVariableStatement(node)) {
      node.declarationList.declarations.forEach((declaration) => {
        if (
          declaration.initializer &&
          ts.isArrowFunction(declaration.initializer)
        ) {
          const functionText = sourceCode.substring(
            declaration.pos,
            declaration.end,
          );

          functions.push(functionText);
        }
      });
    }
  });

  return functions;
}
