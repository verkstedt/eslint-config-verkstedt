#!/usr/bin/env sh
set -eu

print_help ()
{
    cat << EOF
Set up linting.

Usage: npx @verkstedt/lint TARGET_DIR
EOF
}

###
# Determine if colour output should be used
# $1: file descriptor to check (1 for stdout, 2 for stderr)
should_use_color ()
{
    fd="$1"

    if [ "${FORCE_COLOR-}" = "1" ]
    then
        return 0
    elif [ "${NO_COLOR-}" = "1" ]
    then
        return 1
    else
        [ -t "$fd" ] && [ -n "${TERM-}" ] && [ "$TERM" != "dumb" ] && [ "${CI-}" != "true" ]
    fi
}

###
# Print error message to stderr
ERROR ()
{
    printf "${ansi_error}ERROR: %s${ansi_reset}\n" "$1" >&2
}

###
# Cross–platform dirname + readlink -f
# $1: path to canonicalize
dirname_readlink ()
{
    path="$1"
    cd "$( dirname "$path" )"
    while [ -L "$path" ]
    do
        path=$( readlink "$path" )
        cd "$( dirname "$path" )"
    done
    pwd -P
}

###
# Read a code block from a markdown file
# $1: marker that’s placed before the code block
# $2: path to markdown file
read_file_from_markdown ()
{
    marker="$1"
    file_path="$2"

    contents=$(
        # Find a line matching the marker,
        # then print everything from first ``` until the next ```.
        awk \
            -v marker="$marker" \
            '
                p2 && /^\s*```$/ { exit }
                p1 && /^\s*```[a-z]*$/ { p2=1; next }
                $0 ~ marker { p1=1 }
                p2
            ' \
            "$file_path"
    )

    if [ -z "$contents" ]
    then
        ERROR "Failed to extract $marker from $file_path"
        exit 70 # EX_SOFTWARE
    fi

    printf '%s\n' "$contents" | sed 's/^   //'
}

###
# Install TypeScript
typescript_setup ()
{
    expected_extends='@verkstedt/lint/tsconfig'
    actual_extends="$( jq -r .extends tsconfig.json )"
    if [ "$actual_extends" != "$expected_extends" ]
    then
        new_tsconfig_content=$(
            jq \
                --arg extends "$expected_extends" \
                '{ extends: $extends } + .' \
                tsconfig.json
        )
        printf '%s\n' "$new_tsconfig_content" > tsconfig.json
    fi
}

###
# Setup Prettier
prettier_setup ()
{
    config_file_extension="$1"
    config_contents="$2"

    expected_config_file="prettier.config.${config_file_extension}"
    expected_config_match="from '@verkstedt/lint/prettier'"
    existing_config_files=$(
        find . -maxdepth 1 -type f \( -name '.prettierrc' -or -name '.prettierrc.*' -or -name 'prettier.config.*' \)
    )

    if [ -n "$( jq '.prettier // empty' package.json 2>/dev/null )" ]
    then
        ERROR "Prettier configuration found in package.json. Migrate to $expected_config_file"
        exit 78 # EX_CONFIG
    elif [ -z "$existing_config_files" ]
    then
        printf "%s\n" "$config_contents" > "$expected_config_file"
    elif [ "$(echo "$existing_config_files" | wc -l)" -gt 1 ]
    then
        ERROR "Multiple Prettier configuration files found:\n$existing_config_files"
        exit 78 # EX_CONFIG
    elif ! grep -qF "$expected_config_match" "$existing_config_files"
    then
        ERROR "Prettier configuration found in '${existing_config_files}', but does not use verkstedt linting setup."
        exit 78 # EX_CONFIG
    fi

    if ! [ -f ".prettierignore" ]
    then
        true > .prettierignore
    fi
}

###
# Setup ESLint
eslint_setup ()
{
    config_file_extension="$1"
    config_contents="$2"

    expected_config_file="eslint.config.${config_file_extension}"
    expected_config_match="from '@verkstedt/lint/eslint'"
    existing_config_files=$(
        find . -maxdepth 1 -type f \( -name '.eslintrc' -or -name '.eslintrc.*' -or -name 'eslint.config.*' \)
    )

    if [ -n "$( jq '.eslintConfig // empty' package.json 2>/dev/null )" ]
    then
        ERROR "ESLint configuration found in package.json. Migrate to $expected_config_file"
        exit 78 # EX_CONFIG
    elif [ -z "$existing_config_files" ]
    then
        echo "$config_contents" > "$expected_config_file"
    elif [ "$(echo "$existing_config_files" | wc -l)" -gt 1 ]
    then
        ERROR "Multiple ESLint configuration files found:\n$existing_config_files"
        exit 78 # EX_CONFIG
    elif ! grep -qF "$expected_config_match" "$existing_config_files"
    then
        ERROR "ESLint configuration found in '${existing_config_files}', but does not use verkstedt linting setup."
        exit 78 # EX_CONFIG
    fi

    if [ -f ".eslintignore" ]
    then
        ERROR ".eslintignore file found. This configuration uses .gitignore from the root of the repository and entries from .prettierignore. Use one of them instead."
        exit 78 # EX_CONFIG
    fi
}

main ()
{
    lint_dir=$( dirname_readlink "$0" )
    target_dir="$1"

    cd "$target_dir"

    uses_typescript=$(
        npm ls typescript > /dev/null 2>&1 && echo "1" || echo ""
    )

    printf "${ansi_bold}INSTALL NPM PACKAGES${ansi_reset}\n"
    set -- @verkstedt/lint eslint prettier
    if [ -n "$uses_typescript" ]
    then
        # jiti is needed to load TypeScript ESLint config files
        set -- "$@" jiti typescript-eslint
    fi
    npm install --save-dev "$@"

    if [ -n "$uses_typescript" ]
    then
        config_file_extension="ts"

        printf "${ansi_bold}SETUP TYPESCRIPT${ansi_reset}\n"
        typescript_setup
    else
        config_file_extension="mjs"
    fi

    printf "${ansi_bold}SETUP PRETTIER${ansi_reset}\n"
    prettier_config="$( read_file_from_markdown PRETTIER_CONFIG "$lint_dir/README.md" )"
    prettier_setup "$config_file_extension" "$prettier_config"

    printf "${ansi_bold}SETUP ESLINT${ansi_reset}\n"
    eslint_config="$( read_file_from_markdown ESLINT_CONFIG "$lint_dir/README.md" )"
    eslint_setup "$config_file_extension" "$eslint_config"
}

# Set up global variables

if should_use_color 1 && should_use_color 2
then
    ansi_error="\033[0;31m"
    ansi_bold="\033[1m"
    ansi_reset="\033[0m"
else
    ansi_error=""
    ansi_bold=""
    ansi_reset=""
fi

########

# Parse command line arguments

if [ "${1-}" = "--help" ] || [ "${1-}" = "-h" ]
then
    print_help
    exit 0
elif [ -z "${1-}" ]
then
    ERROR "Target directory not specified."
    print_help
    exit 64 # EX_USAGE
else
    target_dir="$1"
fi

# Do the thing

main "$target_dir"
