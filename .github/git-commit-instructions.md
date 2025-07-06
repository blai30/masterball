## Commit message rules
- Use the conventional commit format: `<type>(<scope>): <description>`
- Types: feat, fix, docs, style, refactor, test, chore, perf
- Use imperative mood (e.g., "add" not "added" or "adds")
- Use lowercase for the first word unless it's a proper noun

## Branch naming conventions
- Use kebab-case (lowercase with hyphens)
- Follow the pattern: `<type>/<issue-number>-<short-description>`
- Types: feature, bugfix, hotfix, release, support
- Example: `feature/123-add-dark-mode`

## Pull request guidelines
- Link related issues using keywords (Fixes #123, Closes #456)
- Provide a clear description of changes
- Add screenshots for UI changes
- Ensure all CI checks pass before requesting review
- Keep PRs focused and small when possible
