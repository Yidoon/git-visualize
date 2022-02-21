interface parseGitUrl {
  (gitUrl: string): { project_name: string; owner: string; protocol: string; url: string }
}
