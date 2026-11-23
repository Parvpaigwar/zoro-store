# Git / GitHub account rules (MANDATORY)

This repo must ALWAYS use the **Parvpaigwar** GitHub account (`parvpaigwar@gmail.com`).

- Commit identity for this repo is set in the **repo-local** git config only:
  - `user.name = Parvpaigwar`
  - `user.email = parvpaigwar@gmail.com`
- Before any commit/push, verify with `git config user.email` → must print `parvpaigwar@gmail.com`. If not, fix it with `git config user.email "parvpaigwar@gmail.com"` (local, no `--global`).
- Push/pull only over SSH: `git@github.com:Parvpaigwar/zoro-store.git` (authenticates via `~/.ssh/id_ed25519_abc`, the Parvpaigwar key). `ssh -T git@github.com` should greet "Hi Parvpaigwar!".
- NEVER use the `epparvpaigwar` account (`parv@engineerphilosophy.com`) for this repo — not for commits, author/committer, pushes, or PRs.
- NEVER modify the global git config (`git config --global ...`), `~/.gitconfig`, `~/.ssh/config`, SSH keys, or GitHub Desktop settings. The epparvpaigwar setup used by GitHub Desktop must stay untouched.
- Do not pass `--author` or set `GIT_AUTHOR_*` / `GIT_COMMITTER_*` env vars to any other identity.

---
