# Genpage Edit Plan

Latest additional requirement: Each project row includes a New milestone button. Open the existing Milestone main form in a model-driven dialog with that row's Project lookup prefilled (ID, name, and entity type); refresh milestones when the form closes, without changing picker selection. Surface form-open and refresh errors.

## File Being Edited
- **Absolute path:** C:\diana\Sources\GitHub\brasov2de\GenerativePagesSamples\TimeEntry1\Dialog\Page\04b846d6-183f-400e-a302-a5c168b46a92\page.tsx
- **App ID:** 560707ed-3cfd-f011-8408-002248325389
- **Page ID:** 04b846d6-183f-400e-a302-a5c168b46a92

## Working Directory
C:\diana\Sources\GitHub\brasov2de\GenerativePagesSamples\TimeEntry1\Dialog\Page

## Plugin Root
C:\Users\birdia\AppData\Roaming\Code\agentPlugins\file-c-3A-Users-birdia-copilot-installed-plugins-power-platform-skills-model-apps\1a0e8d819e5

## Original Page Context
- **Original prompt (from prompt.txt):** Create a responsive Fluent UI 9 project hierarchy page with depth-colored project rows and visually distinct inline milestones. Search projects and milestones. Accept a project ID; when scoped, use Xrm.WebApi FetchXML operator under to show the selected project and its descendants. In dialog mode, allow selecting a project, milestone, or both and send the selection or cancel result to the opener. Use only the existing cr7a1_project and cr7a1_milestone tables; do not create schema.
- **Original data sources (from config.json):** cr7a1_project, cr7a1_milestone
- **Model:** gpt-4o
- **Current purpose:** A responsive Fluent UI 9 project-and-milestone browser with search and independent project/milestone selection. It currently obtains projects through `Xrm.WebApi.retrieveMultipleRecords` and FetchXML, including an `under` filter for project scope, while milestones are loaded through `dataApi.queryTable`.
- **Current structure and styling:** One React component with data-mapping/tree/filter helpers, local selection and expansion state, `makeStyles`/Fluent tokens, responsive rows, and an optional dialog footer.
- **Current dialog return:** The footer currently emits a custom `postMessage` and optional `sessionStorage` result; its buttons say “Close with selection” and “Close without selection.” The code asks the opener to handle the message and close the dialog; it does not itself verify or invoke a host close API.
- **Existing visual details:** Project labels use a left-aligned row-label style; project rows have chevron expand/collapse controls; milestone labels display a `FlagRegular` icon.
- **DataAPI evidence:** `RuntimeTypes.ts` types `GeneratedComponentProps.dataApi` as `UxAgentDataApi`, extending `BaseUxAgentDataApi<TableRegistrations, EnumRegistrations>`. The current milestone loader uses `dataApi.queryTable` with `select`, `orderBy`, and `pageSize`, then consumes `rows`, `hasMoreRows`, and `loadMoreRows`. The generated project type exposes `cr7a1_projectid`, `cr7a1_projectname`, and `cr7a1_description`, but no parent-project lookup. No `setPageOutput` declaration or usage was found in the downloaded page, `RuntimeTypes.ts`, or the project source search.

## Entities Used
cr7a1_project, cr7a1_milestone

## Requested Changes
1. Replace the `Xrm.WebApi` project retrieval and FetchXML hierarchy logic with project retrieval through the existing `dataApi.queryTable("cr7a1_project", ...)` pattern. Select the project ID, name, and description, order by project name, and consume additional pages using the DataAPI paging result. Remove parent-project lookup inference and the FetchXML `under` behavior.
2. Render projects as top-level rows and each associated milestone as that project's child node, using `_cr7a1_project_value` to associate milestones. There is no project-to-project hierarchy or descendant traversal. If an input project ID is supplied, scope to that exact project and its milestones only, not descendants.
3. Preserve search across project and milestone names/descriptions, project/milestone selection, and per-project expand/collapse. Keep the tree semantics coherent for projects with milestone children and projects with no milestones.
4. When `pageInput.data.isDialog` is true, show two footer buttons labeled **OK** and **Cancel**. Both call `dataApi.setPageOutput(pageOutput)` and then `Xrm.Navigation.navigateBack()` to close the dialog. OK returns selected Project and/or Milestone records; Cancel returns a cancellation output with no selection.
5. Do not add or replace data sources, connectors, Custom APIs, tables, or columns.

## Preservation Constraints
- Keep the existing `cr7a1_project` and `cr7a1_milestone` data sources and typed DataAPI access; do not use mock data or add schema.
- Preserve the existing left-aligned project and milestone labels.
- Preserve the project expand/collapse chevrons and the milestone `FlagRegular` icon.
- Preserve depth-based row styling and the responsive Fluent UI 9 layout, adapting it to a flat list of project roots with milestone children.
- Preserve search, independent project/milestone selection, accessible selected state, and keyboard-operable controls.
- Preserve project-ID input support as exact-project scoping; do not interpret it as a subtree request.
- Do not retain the old `postMessage`/`sessionStorage` return path as a substitute for the requested DataAPI output.

## Design Notes
- Use only the existing tables. The milestone relationship available in the generated type is `_cr7a1_project_value`.
- Projects are roots; their associated milestones are the child items. Expand/collapse controls should remain available when a project has milestones.
- Keep OK and Cancel below the tree in dialog mode and maintain narrow-dialog responsive reflow.
- **Runtime contract evidence:** The public Microsoft Learn `dataApi` reference does not document `dataApi.setPageOutput`, but the running Diana2 page exposes that method. Browser testing confirmed that it records dialog output but does not close the modal. `Xrm.Navigation.navigateBack()` closed the active model-driven dialog and resolved the opener's `navigateTo` promise with the output. Therefore both actions must set the output and then call `navigateBack()`.

## Relevant Samples
None required for the specified targeted edit.

## Latest Selection Edit (Approved)

1. Selecting a milestone returns its owning project and the milestone, each as `{ id, name, entityName }`.
2. Selecting a project row returns only that project and clears any previously selected milestone. “Project is opened” means choosing the project row, not expanding it.
3. Keep chevrons dedicated to expand/collapse and preserve the existing OK/Cancel dialog flow.
4. Preserve the output shape `{ cancelled, project: { id, name, entityName } | null, milestone: { id, name, entityName } | null }`. Cancel returns `cancelled: true` with both records `null`.
5. Make no schema, data-source, or connector changes. This approved selection behavior supersedes any conflicting selection details above.
