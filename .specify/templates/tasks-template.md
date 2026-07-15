---

description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are MANDATORY. Every acceptance criterion requires a failing-first test task before implementation.

**Traceability**: Every user-story task MUST list one or more `AC-USn-CATEGORIA-nnn` IDs. Maintain
`traceability.md` and run the automated traceability check as a release gate. Foundational tooling
without product behavior MUST use a stable `GATE-CATEGORIA-nnn` ID and the constitutional
`test(tooling)` / `feat(tooling)` commit subjects instead of inventing a user story or AC.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] [AC IDs] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- **[AC IDs]**: One or more acceptance criteria satisfied by the task
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

<!--
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.

  The /speckit-tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/

  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment

  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize [language] project with [framework] dependencies
- [ ] T003 [P] Configure linting and formatting tools
- [ ] T004 [GATE:GATE-TRACEABILITY-001] [RED] Add failing gate contract tests in tests/check-traceability.test.[ext]; commit `test(tooling): T004 define traceability gate [GATE-TRACEABILITY-001]`
- [ ] T005 [GATE:GATE-TRACEABILITY-001] [GREEN] Create automated traceability validation script at scripts/check-traceability.[ext]; commit `feat(tooling): T005 implement traceability gate [GATE-TRACEABILITY-001]`
- [ ] T006 Create specs/[###-feature-name]/traceability.md with criterion-to-task/test/commit mappings

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [ ] T007 Setup database schema and migrations framework
- [ ] T008 [P] Implement authentication/authorization framework
- [ ] T009 [P] Setup API routing and middleware structure
- [ ] T010 Create base models/entities that all stories depend on
- [ ] T011 Configure error handling and logging infrastructure
- [ ] T012 Setup environment configuration management

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 1 (MANDATORY) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T013 [P] [US1] [AC-US1-CATEGORIA-001] Add test named with AC-US1-CATEGORIA-001 in tests/[path] and execute it red; commit `test(US1): T013 [description] [AC-US1-CATEGORIA-001]`
- [ ] T014 [P] [US1] [AC-US1-CATEGORIA-002] Add test named with AC-US1-CATEGORIA-002 in tests/[path] and execute it red; commit `test(US1): T014 [description] [AC-US1-CATEGORIA-002]`

### Implementation for User Story 1

- [ ] T015 [P] [US1] [AC-US1-CATEGORIA-001] Implement [behavior] in src/[path]; commit `feat(US1): T015 [description] [AC-US1-CATEGORIA-001]`
- [ ] T016 [US1] [AC-US1-CATEGORIA-002] Implement [behavior] in src/[path]; commit `feat(US1): T016 [description] [AC-US1-CATEGORIA-002]`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 2 (MANDATORY) ⚠️

- [ ] T017 [P] [US2] [AC-US2-CATEGORIA-001] Add AC-US2-CATEGORIA-001 test in tests/[path], execute it red, and commit `test(US2): T017 [description] [AC-US2-CATEGORIA-001]`

### Implementation for User Story 2

- [ ] T018 [US2] [AC-US2-CATEGORIA-001] Implement [behavior] in src/[path] and commit `feat(US2): T018 [description] [AC-US2-CATEGORIA-001]`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 3 (MANDATORY) ⚠️

- [ ] T019 [P] [US3] [AC-US3-CATEGORIA-001] Add AC-US3-CATEGORIA-001 test in tests/[path], execute it red, and commit `test(US3): T019 [description] [AC-US3-CATEGORIA-001]`

### Implementation for User Story 3

- [ ] T020 [US3] [AC-US3-CATEGORIA-001] Implement [behavior] in src/[path] and commit `feat(US3): T020 [description] [AC-US3-CATEGORIA-001]`

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] TXXX [P] Documentation updates in docs/
- [ ] TXXX Code cleanup and refactoring
- [ ] TXXX Performance optimization across all stories
- [ ] TXXX [P] Add required cross-cutting tests in tests/unit/
- [ ] TXXX Security hardening
- [ ] TXXX Run quickstart.md validation
- [ ] TXXX Run all tests and the production build
- [ ] TXXX Run scripts/check-traceability.[ext] and require a passing result

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Tests for every acceptance criterion MUST be written, named with its AC ID, executed, and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all AC-named tests for User Story 1 together:
Task: "Test AC-US1-CATEGORIA-001 in tests/[path]"
Task: "Test AC-US1-CATEGORIA-002 in tests/[path]"

# Launch all models for User Story 1 together:
Task: "Create [Entity1] model in src/models/[entity1].py"
Task: "Create [Entity2] model in src/models/[entity2].py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit every product test/implementation task with its `USn`, Task ID and AC IDs. Commit
  foundational tooling with `test(tooling)` / `feat(tooling)` or `fix(tooling)`, its Task ID and
  stable GATE-IDs; never fabricate product traceability for tooling.
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
