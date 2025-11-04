# Commit Message Convention

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification.

## Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

## Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Code style changes (formatting, missing semi-colons, etc)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to build process or auxiliary tools
- **ci**: Changes to CI configuration files and scripts
- **build**: Changes that affect the build system or external dependencies
- **revert**: Reverts a previous commit

## Examples

### Simple commit

```
feat: add user authentication
```

### Commit with scope

```
feat(auth): implement login with NextAuth
```

### Commit with body

```
fix(habits): correct streak calculation

The streak was being reset incorrectly when a habit
was completed after midnight. This fixes the timezone
handling to use the user's local timezone.
```

### Breaking change

```
feat(api)!: change habit API response format

BREAKING CHANGE: The API now returns habits in a nested
structure. Update all API clients accordingly.
```

## Rules

1. Use lowercase for type and subject
2. No period at the end of subject
3. Keep subject line under 100 characters
4. Separate subject from body with blank line
5. Use imperative mood ("add" not "added" or "adds")
