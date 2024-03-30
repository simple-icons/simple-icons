/**
 * @fileoverview
 * Check if the tag being pushed follows the format 'X.Y.Z'.
 *
 * Avoids pushing tags with a 'v' prefix, which is a common mistake when
 * tagging releases manually.
 */

import fs from 'node:fs';

// Works on POSIX and Windows
const stdinBuffer = fs.readFileSync(0); // STDIN_FILENO = 0
const stdin = stdinBuffer.toString();
if (!stdin) {
  process.exit(0);
}
const ref = stdin.split(' ')[2];

if (ref.startsWith('refs/tags/')) {
  if (!ref.match(/^refs\/tags\/\d+\.\d+\.\d+$/)) {
    console.error("Git tags for simple-icons must follow the format 'X.Y.Z'.");
    if (ref.match(/^refs\/tags\/v\d+\.\d+\.\d+$/)) {
      console.error(
        "You are trying to push a tag with a 'v' prefix. Please remove the 'v' prefix and try again.",
      );
      process.exit(1);
    }
  }
}
