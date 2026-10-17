import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import ts from 'typescript';
import {fileURLToPath} from 'node:url';

// Generate fresh declarations in isolation, then type-check a real consumer.
// The check never trusts stale dist files and never mutates a release build.
const root = fileURLToPath(new URL('..', import.meta.url));
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'arlab-ui-public-types-'));
const format = diagnostics => ts.formatDiagnosticsWithColorAndContext(diagnostics, {
  getCanonicalFileName: file => file, getCurrentDirectory: () => root,
  getNewLine: () => '\n',
});
try {
  fs.symlinkSync(path.join(root, 'node_modules'), path.join(scratch, 'node_modules'), 'dir');
  const config = ts.readConfigFile(path.join(root, 'tsconfig.json'), ts.sys.readFile);
  if(config.error) throw new Error(format([config.error]));
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root, {
    outDir: path.join(scratch, 'dist'), emitDeclarationOnly: true,
  });
  const library = ts.createProgram(parsed.fileNames, parsed.options);
  const emitted = library.emit();
  const declarationErrors = [...ts.getPreEmitDiagnostics(library), ...emitted.diagnostics];
  if(declarationErrors.length) throw new Error(format(declarationErrors));
  const fixtureDirectory = path.join(root, 'scripts/type-tests');
  const fixtures = fs.readdirSync(fixtureDirectory).filter(file => file.endsWith('.tsx')).map(file => path.join(fixtureDirectory, file));
  const consumer = ts.createProgram(fixtures, {
    target: ts.ScriptTarget.ES2020, lib:['lib.es2020.d.ts','lib.dom.d.ts'],
    module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler,
    jsx: ts.JsxEmit.ReactJSX, strict:true, skipLibCheck:false,
    noEmit:true, esModuleInterop:true, baseUrl:root,
    paths:{'@arlab/ui':[path.join(scratch,'dist/contour/index.d.ts')]},
  });
  const errors = ts.getPreEmitDiagnostics(consumer);
  if(errors.length) throw new Error(format(errors));
  console.log('Public Contour declarations: minimal compositions, native attributes and required-contract checks passed.');
} finally {
  fs.rmSync(scratch, {recursive:true, force:true});
}
