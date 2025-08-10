# Commit Message Guidelines

## 📝 Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

## 🏷️ Types

| Type | Description |
|------|-------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only changes |
| `style` | Changes that do not affect the meaning of the code |
| `refactor` | A code change that neither fixes a bug nor adds a feature |
| `perf` | A code change that improves performance |
| `test` | Adding missing tests or correcting existing tests |
| `chore` | Changes to build process or auxiliary tools |

## 🎯 Scopes

| Scope | Description |
|-------|-------------|
| `ui` | User interface components |
| `api` | API related changes |
| `auth` | Authentication and authorization |
| `db` | Database related changes |
| `kanban` | Kanban board functionality |
| `task` | Task management system |
| `sp` | Story point estimation |
| `mobile` | Mobile specific features |
| `backend` | Backend services |
| `frontend` | Frontend application |
| `devops` | DevOps and deployment |
| `testing` | Testing framework and tests |

## ✨ Examples

### Feature Addition
```
feat(task): Add task creation modal with SP estimation

- Implement comprehensive task creation form
- Add SP estimation helper with technical complexity calculation
- Include user assignment and team management
- Add tagging system and dependency management
```

### Bug Fix
```
fix(ui): Resolve loading state issue in kanban board

- Add loading spinner during data fetch
- Fix infinite loading when workspace data is empty
- Improve error handling for failed requests
```

### Documentation Update
```
docs: Update README with new features

- Add task creation guide
- Include SP estimation best practices
- Update API documentation
- Add troubleshooting section
```

### Refactoring
```
refactor(kanban): Improve drag and drop performance

- Optimize re-render logic during drag operations
- Reduce unnecessary state updates
- Improve animation smoothness
- Clean up event handlers
```

### Testing
```
test(task): Add unit tests for task creation

- Test form validation logic
- Test SP calculation algorithm
- Test user assignment functionality
- Add integration tests for modal
```

### Performance Improvement
```
perf(ui): Optimize task card rendering

- Implement React.memo for task cards
- Reduce unnecessary re-renders
- Optimize image loading
- Improve scroll performance
```

## 📋 Rules

1. **Use present tense** ("add" not "added")
2. **Use imperative mood** ("move cursor to..." not "moves cursor to...")
3. **Limit subject line to 50 characters**
4. **Capitalize the subject line**
5. **Do not end subject line with a period**
6. **Separate subject from body with blank line**
7. **Use body to explain what and why vs. how**
8. **Can use multiple lines with "-" for bullet points**

## 🚀 Quick Commands

### Set commit template
```bash
git config commit.template .gitmessage
```

### Commit with template
```bash
git commit
```

### Commit with custom message
```bash
git commit -m "feat(task): Add new feature"
```

### Amend last commit
```bash
git commit --amend
```

## 🔧 Git Hooks (Optional)

You can also set up pre-commit hooks to enforce these guidelines:

```bash
# Install husky for git hooks
npm install --save-dev husky

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run lint"
```

## 📚 References

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Angular Commit Guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#-commit-message-format)
- [Git Commit Message Best Practices](https://chris.beams.io/posts/git-commit/)

---

**Note**: Following these guidelines makes the project history more readable and helps with automated changelog generation.
