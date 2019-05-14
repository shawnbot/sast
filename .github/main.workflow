workflow "Install, test, publish" {
  resolves = ["publish"]
  on = "push"
}

action "install" {
  uses = "actions/npm@v2.0.0"
  args = "ci"
}

action "test" {
  uses = "actions/npm@v2.0.0"
  args = "test"
  needs = ["install"]
}

action "publish" {
  uses = "primer/publish@v1.0.0"
  needs = ["test"]
  secrets = ["GITHUB_TOKEN", "NPM_AUTH_TOKEN"]
}
