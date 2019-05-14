workflow "New workflow" {
  on = "push"
  resolves = ["publish"]
}

action "npm install" {
  uses = "actions/npm@v2.0.0"
  args = "install"
}

action "test" {
  uses = "actions/npm@v2.0.0"
  needs = ["npm install"]
  args = "test"
}

action "publish" {
  uses = "primer/publish@v1.0.0"
  needs = ["test"]
  secrets = ["GITHUB_TOKEN", "NPM_AUTH_TOKEN"]
}
