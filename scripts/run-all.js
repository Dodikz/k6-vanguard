const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const testDir = path.join(__dirname, '../tests');

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(file));
    } else if (file.endsWith('.js')) {
      results.push(file);
    }
  });
  return results;
}

const files = getFiles(testDir);

console.log(`Starting execution of ${files.length} test scripts...\n`);

files.forEach((file, index) => {
  const relativePath = path.relative(path.join(__dirname, '..'), file);
  console.log(`[${index + 1}/${files.length}] Running: ${relativePath}`);
  
  try {
    // Run k6 and inherit stdio so user sees the progress
    execSync(`k6 run "${file}"`, { stdio: 'inherit' });
    console.log(`✔ Finished: ${relativePath}\n`);
  } catch (error) {
    console.error(`❌ Failed: ${relativePath}\n`);
    // Continue to next test
  }
});

console.log('✔ All tests completed.');
