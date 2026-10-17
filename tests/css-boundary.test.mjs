import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
test('CSS build guard rejects selectorless rules before scoping can turn them into theme-wide styles',()=>{
 const dir=mkdtempSync(join(tmpdir(),'arlab-css-'));
 try {const file=join(dir,'broken.css');writeFileSync(file,'@media (min-width: 10px) { { transform: rotate(180deg); } }');
 const result=spawnSync(process.execPath,['scripts/check-css.mjs',file],{encoding:'utf8'});
 assert.equal(result.status,1);assert.match(result.stdout,/block has no selector or at-rule/);
 } finally {rmSync(dir,{recursive:true,force:true});}
});
