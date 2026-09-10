import fs from 'node:fs';
import path from 'node:path';

// Dedupe onchain-runtime-v3
const target = path.join('node_modules', '@midnight-ntwrk', 'midnight-js-protocol', 'node_modules', '@midnight-ntwrk', 'onchain-runtime-v3');
const source = path.join('node_modules', '@midnight-ntwrk', 'onchain-runtime-v3');
if (fs.existsSync(target) && !fs.lstatSync(target).isSymbolicLink()) {
  fs.rmSync(target, { recursive: true, force: true });
  fs.symlinkSync(path.resolve(source), target);
  console.log('Deduped onchain-runtime-v3');
}

// Fix package.json exports for @midnight-ntwrk packages
const mnDir = path.join('node_modules', '@midnight-ntwrk');
if (fs.existsSync(mnDir)) {
  fs.readdirSync(mnDir).forEach((sub) => {
    const pkgP = path.join(mnDir, sub, 'package.json');
    if (fs.existsSync(pkgP)) {
      const f = JSON.parse(fs.readFileSync(pkgP, 'utf8'));
      let dirty = false;
      if (f.exports) {
        Object.keys(f.exports).forEach((k) => {
          const e = f.exports[k];
          if (typeof e === 'object' && e) {
            if (Object.keys(e)[0] === 'default' && e.types) {
              f.exports[k] = { types: e.types, default: e.default };
              dirty = true;
            }
            if (typeof e.types === 'object' && e.types && !e.types.default) {
              const src = typeof e.types.import === 'string' ? e.types.import : (typeof e.types.require === 'string' ? e.types.require : '');
              if (src) {
                e.types.default = src.replace(/\.d\.[cm]ts$/, '.d.ts');
                dirty = true;
              }
            }
          }
        });
      }
      if (dirty) {
        fs.writeFileSync(pkgP, JSON.stringify(f, null, 2));
        console.log('Patched', sub);
      }
    }
  });
}
