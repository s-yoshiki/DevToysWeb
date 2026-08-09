/**
 * Transpiles TypeScript to runnable JavaScript using the TypeScript 6
 * compatibility package. TypeScript 7 does not expose the legacy compiler API
 * used by this browser-side tool. Imported dynamically so the ~MB compiler
 * only loads for this route, mirroring how Monaco is kept out of other bundles.
 */
// TODO(typescript-7.1): After TypeScript 7.1 is released, migrate this back to
// `typescript` and remove the `typescript6` compatibility dependency if the
// replacement runtime transpilation API is available.
export const transpileTypeScript = async (code: string) => {
  const ts = (await import('typescript6')).default
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
