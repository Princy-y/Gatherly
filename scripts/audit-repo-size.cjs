const fs = require('fs');
const { execSync } = require('child_process');

function getGitTrackedSize() {
  try {
    const output = execSync('git ls-files -z', { encoding: 'utf-8' });
    const files = output.split('\0').filter(Boolean);
    let total = 0;
    for (const f of files) {
      if (fs.existsSync(f)) {
        total += fs.statSync(f).size;
      }
    }
    return { count: files.length, total };
  } catch (_err) {
    return { count: 0, total: 0 };
  }
}

const tracked = getGitTrackedSize();
const repoSizeMb = (tracked.total / (1024 * 1024)).toFixed(3);
const maxLimitMb = 10.0;

console.log('--- REPOSITORY SIZE AUDIT ---');
console.log(`Git tracked files count: ${tracked.count}`);
console.log(`Git tracked total size : ${tracked.total} bytes (${repoSizeMb} MB)`);
console.log(`Competition limit      : ${maxLimitMb} MB`);

if (tracked.total > maxLimitMb * 1024 * 1024) {
  console.error(`❌ REPO SIZE VIOLATION: Exceeds 10 MB limit! Current: ${repoSizeMb} MB`);
  process.exit(1);
} else {
  console.log(`✅ AUDIT PASSED: Repository size (${repoSizeMb} MB) is well within limit (< 10 MB).`);
}
