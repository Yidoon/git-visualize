interface parseGitUrl {
  (gitUrl: string): { repo: string; owner: string; protocol: string; url: string }
}
