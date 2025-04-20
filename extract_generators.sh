#!/usr/bin/env bash
#
# Combine all JS generator modules into a single Markdown file for review
set -euo pipefail
output="GENERATORS.md"
echo "# Math Quest Generators" > "$output"
echo "" >> "$output"
for f in js/generators/*.js; do
  echo "## $f" >> "$output"
  echo '```js' >> "$output"
  cat "$f" >> "$output"
  # Ensure closing code fence is on its own line, even if file lacks trailing newline
  printf '\n```\n\n' >> "$output"
done
echo "Generators combined into $output"