# Skill: Code Review

Revisa código del repositorio test-suite-comparator enfocándose en clean code, prevención de antipatrones, y calidad/confiabilidad.

TRIGGER when: the user asks for a code review, asks to review a file/PR/diff, or asks to check code quality.

## How to perform a review

1. Read the file(s) or diff to review.
2. Evaluate against EACH checklist section below.
3. Report findings grouped by severity: **Blocker** > **Warning** > **Nit**.
4. For each finding, include: file path, line number, what's wrong, and a concrete fix.
5. If the code is clean, say so — don't invent findings.

---

## 1. Type safety

This project enforces `strict: true` and `@typescript-eslint/no-explicit-any: "error"`. Review for:

- [ ] **No `any` or `as` casts without validation.** If `as` is used, there must be a runtime check (type guard, Zod parse, or `instanceof`) before or around it. Bare `as` is a smell.
- [ ] **No `@ts-ignore` or `@ts-expect-error`** unless accompanied by a comment explaining why it's necessary and a tracking issue.
- [ ] **Zod schemas stay in sync with types.** If a type in `types.ts` changes, the corresponding schema in `schemas.ts` must change too. Look for drift.
- [ ] **Discriminated unions are exhaustive.** Any `switch` on a `kind` or discriminator field must have a `default: never` branch. Missing cases are blockers.
- [ ] **Generic functions preserve type safety.** Avoid `<T>` parameters that just get cast to `unknown` internally.

## 2. Error handling

The project uses thrown exceptions (not Result types). Errors propagate up to the CLI catch block. Review for:

- [ ] **Async functions are always awaited.** ESLint catches floating promises, but verify in new code. Every `Promise` must be `await`ed or returned.
- [ ] **Errors include context.** A thrown `Error` must carry enough info to diagnose: what operation failed, what input caused it, what was expected. Avoid bare `throw new Error("failed")`.
- [ ] **No swallowed errors.** Empty `catch {}` blocks or `catch { return undefined }` are blockers. If an error is caught, it must be re-thrown, logged, or handled meaningfully.
- [ ] **Error types are checked before accessing properties.** Use `error instanceof Error` before accessing `.message`. Use `String(error)` as fallback.
- [ ] **Validation happens at boundaries, not deep inside.** Config validation belongs in `config-loader.ts` (Zod). Adapter input validation in `parse()`. Core logic (comparator, normalizer) should trust already-validated data.

## 3. Side effects and I/O isolation

Side effects (filesystem, process spawning, network) must be contained in dedicated modules. Review for:

- [ ] **No `fs` calls inside core logic.** `comparator-engine.ts`, `normalizer.ts`, and domain code must be pure. File I/O belongs in `evidence-store.ts`, `config-loader.ts`, or adapter code.
- [ ] **No `process.exit()` outside `cli.ts`.** Use `process.exitCode = 1` at the CLI boundary. Libraries and core code must throw, not exit.
- [ ] **`spawn` only in `process-runner.ts`.** Adapter `run()` methods should delegate to `runShellCommand()`, not spawn directly.
- [ ] **No global mutable state.** No module-level `let` variables that accumulate state across calls. Classes use `readonly` for fields that don't change after construction.

## 4. Adapter contract compliance

All adapters implement `TestSuiteAdapter` from `adapter-contract.ts`. Review for:

- [ ] **Interface fully implemented.** `discover()`, `run()`, `parse()` all present with correct signatures and return types.
- [ ] **`parse()` validates its input.** The `artifacts.payload` type is `unknown`. Adapters must check its shape before using it (type guard or `typeof` check).
- [ ] **New adapters registered in `adapter-factory.ts`.** Missing registration means the adapter is unreachable. Also verify the `kind` is added to the discriminated union in `types.ts` and `schemas.ts`.
- [ ] **`command` field restrictions respected.** No shell built-ins, no pipes, no chaining in default command values or documentation.

## 5. Naming and structure

The project uses consistent conventions. Review for:

- [ ] **Files: kebab-case.** `my-new-adapter.ts`, not `myNewAdapter.ts` or `MyNewAdapter.ts`.
- [ ] **Types/Interfaces: PascalCase.** `ParsedTestCase`, not `parsedTestCase`.
- [ ] **Functions/variables: camelCase.** `loadConfig`, not `load_config`.
- [ ] **Functions start with verbs.** `create*`, `load*`, `parse*`, `compare*`, `normalize*`, `persist*`, `run*`, `build*`. A function named `data()` or `result()` is a smell.
- [ ] **Multi-param functions use a params object.** If a function takes 3+ parameters, they should be wrapped in a typed object, not positional.
- [ ] **New files go in the right directory.** Domain types in `domain/`, adapters in `adapters/<name>/`, core orchestration in `core/`.
- [ ] **Imports use `import type` for type-only imports.** ESLint enforces `consistent-type-imports`.

## 6. Antipatterns to flag

Flag these immediately as **Blocker** or **Warning**:

| Antipattern | Severity | Why |
|---|---|---|
| God class/function (> 100 lines doing multiple things) | Blocker | Violates SRP, hard to test |
| Nested callbacks (> 2 levels deep) | Warning | Use async/await instead |
| Boolean parameters that change behavior | Warning | Use separate functions or an options object |
| Magic numbers/strings without named constant | Warning | Extract to named constant |
| Copy-pasted logic (> 5 lines duplicated) | Warning | Extract to shared function |
| Mutable shared state (module-level `let`) | Blocker | Causes subtle bugs across calls |
| `console.log` for output | Warning | Use `process.stdout.write` or a logger |
| Hardcoded paths or environment assumptions | Warning | Use config or params |
| Catch-and-ignore (`catch {}` or `catch { return }`) | Blocker | Hides real errors |
| Barrel files (`index.ts` re-exporting everything) | Warning | Avoid unless there's a public API boundary |
| Premature abstraction (abstract class with one impl) | Warning | YAGNI — use concrete until needed |
| Over-engineering (adding config/flags for unused flexibility) | Warning | Build for today's requirements |

## 7. Testing quality

When reviewing test files, check:

- [ ] **Tests are in the right pyramid level.** Unit tests don't touch filesystem (except `mkdtemp` for isolation). Contract tests verify adapter interface compliance. Integration tests wire real components. E2E tests run the built CLI.
- [ ] **No mocking of core logic in integration/e2e.** The testing strategy doc explicitly forbids mocking the comparator in e2e tests.
- [ ] **Each test has a single assertion focus.** A test named "creates user" shouldn't also verify deletion.
- [ ] **Fixtures are realistic.** Test data should resemble real Cucumber JSON or JUnit XML, not minimal stubs that skip edge cases.
- [ ] **Edge cases covered.** Empty arrays, missing fields, zero-duration tests, tests with no tags, multiple tests sharing a tag.
- [ ] **Regression tests exist for bugs.** Every fixed bug should have a test that would fail if the bug returned.
- [ ] **No `test.skip` without a tracking comment.** Skipped tests must explain why and when they'll be re-enabled.

## 8. Reliability and defensive coding

- [ ] **No assumption about external process success.** `runShellCommand` can fail — callers must handle or let errors propagate. Don't assume `reportPath` exists after `run()`.
- [ ] **Paths are resolved properly.** Relative paths in config are resolved against the config file location (see `config-loader.ts`). New code must follow the same pattern.
- [ ] **Collections are checked before access.** Don't `array[0]` without checking length. Don't `.get()` from a Map without handling `undefined`.
- [ ] **String operations handle edge cases.** Empty strings, strings with BOM, strings with unexpected encoding. Config loader already strips BOM — new file readers should too if needed.
- [ ] **Parallel execution is safe.** If `executionMode: "parallel"` is used, both adapter executions must be independent. No shared mutable state between them.

## Output format

Structure your review as:

```
## Review: <file or scope>

### Blockers
- **[file:line]** <description>. Fix: <concrete suggestion>.

### Warnings
- **[file:line]** <description>. Fix: <concrete suggestion>.

### Nits
- **[file:line]** <description>.

### Good practices observed
- <what the code does well>.
```

If reviewing a diff/PR, also summarize: "This change does X. It introduces N new files and modifies M existing ones. Overall risk: low/medium/high."