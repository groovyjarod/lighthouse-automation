// anyone using this should be given a secret user-agent for operating this script without imperva's
// restrictions on using many network requests to the wiki.
// IF NOT OPERATING FROM THE IP ADDRESS YOU WERE GIVEN, YOU MUST REMOVE ALL CHECKS OF
// THE SECRET USER AGENT.
// "replace this return value with the provided secret user agent"

export default function secretUserAgent () {
    return "fs-jarod-day-pythonscript-wiki"
}