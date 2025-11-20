#!/bin/sh
set -eu

cd "$( dirname "$0" )/.."

if echo " $* " | grep -qE ' (--help|-h) '
then
  echo "Run tests for @verkstedt/lint."
  echo "Usage: $0 [TEST_DIRECTORY]"
  exit 0
fi

# This script installs @verkstedt/lint from '..'. Avoid infinite loops.
if [ "${RUNNING_TEST-}" = "true" ]
then
  exit 0
fi

if [ "$#" -gt 0 ]
then
  tests="$1"
else
  tests="$(
    find "$( dirname "$0" )" -mindepth 1 -maxdepth 1 -type d |
      grep -E '\./test/[0-9]+-' |
      sort -V
  )"

fi

if [ "${NODE_ENV-}" = "development" ]
then
  (
    cd "$( dirname "$0" )/.."
    npm run build
  )
fi

echo "$tests" |
  while IFS= read -r dir
  do
    printf "🏃 TEST '%s'.." "$dir"
    (
      cd "$dir"
      export RUNNING_TEST=true

      rm -rf node_modules

      set -- --ignore-scripts --silent
      if [ "${NODE_ENV-}" = "development" ]
      then
        npm install "$@"
        export NODE_DEBUG='@verkstedt/lint'
      else
        if ! npm ci "$@"
        then
          echo "ERROR: Failed to run 'npm ci' try running tests again with NODE_ENV=development to use 'install' instead of 'ci'." 2>&1
          exit 1
        fi
      fi
      printf '.'

      if npm test "$@"
      then
          printf " ✅ PASS\n"
      else
          printf "\n❌ FAIL %s\n" "$dir"
      fi
    )
  done
