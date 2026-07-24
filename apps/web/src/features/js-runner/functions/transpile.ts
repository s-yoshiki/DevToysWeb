/**
 * Transpiles TypeScript to runnable JavaScript using the `typescript` package
 * that already ships with the repo. Imported dynamically so the ~MB compiler
 * only loads for this route, mirroring how Monaco is kept out of other bundles.
 */
export const transpileTypeScript = async (code: string) => {
  const ts = (await import('typescript')).default
  const result = ts.transpileModule(code, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2021,
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
      isolatedModules: true,
    },
  })
  return result.outputText
}
