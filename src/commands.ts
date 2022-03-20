// tracked files count
export const TRACKED_FIlES_COUNT = 'git ls-files | wc -l'
// list repo contributors and number of their commits
export const CONTRIBUTOR_ANT_COMMIT_COUNT = 'git shortlog -sn --all'
// get commits count
export const COMMIT_COUNT = 'git log | wc -l'