// tracked files count
export const TRACKED_FIlES_COUNT = 'git ls-files master --name-only | wc -l'
// list repo contributors and number of their commits
export const CONTRIBUTOR_ANT_COMMIT_COUNT = 'git shortlog -sn --all'
