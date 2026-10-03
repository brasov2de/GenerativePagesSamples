# Genpage Plan

## Latest Selection and Creation Behavior
- Selecting a Milestone selects its owning Project and returns both records with ID, name, and entity logical name. Selecting a Project row clears the Milestone and returns only the Project record. This supersedes earlier independent-selection wording.
- Preserve the output contract `{ cancelled, project, milestone }`. A project-only choice has `milestone: null`; Cancel has both records null.
- Each Project row has a New milestone button opening the Milestone main form in a model-driven dialog, with that Project lookup prefilled. Refresh milestone children after the form closes without changing the picker selection.

## User Requirements
Create a responsive Fluent UI 9 tree of independent Projects with their Milestones as child rows. Provide search across project and milestone names and descriptions. If a project ID is supplied, scope the view to that exact project and its milestones. When `pageInput.data.isDialog` is true, show OK and Cancel below the tree; both complete the dialog through `dataApi.setPageOutput(pageOutput)`, and OK returns the selected Project and Milestone. Use only the existing Dataverse tables; do not create tables or columns and do not use mock data.

Schema note: `cr7a1_project` has no parent-project lookup. Projects are independent roots. The milestone-to-project relationship `_cr7a1_project_value` supplies the tree's child rows.

## Working Directory
C:\diana\Sources\GitHub\brasov2de\GenerativePagesSamples\TimeEntry1\Dialog\Page

## Plugin Root
C:\Users\birdia\AppData\Roaming\Code\agentPlugins\file-c-3A-Users-birdia-copilot-installed-plugins-power-platform-skills-model-apps\1a0e8d819e5

## Environment
- URL: https://diana2.crm.dynamics.com
- App: TimeTrackerMDA (560707ed-3cfd-f011-8408-002248325389)
- Languages: English (United States), LCID 1033 (`en-US`)
- Solution: Default
- Publisher Prefix: new

## Pages
| Page | File | Purpose | Entities |
|------|------|---------|----------|
| Project and Milestone Tree | project-milestone-tree.tsx | Browse, search, and select existing projects and their inline milestones, optionally scoped to a project when opened as a dialog. | cr7a1_project, cr7a1_milestone |

## Entity Creation Required
No entity creation required — all entities already exist.

## Existing Entities
cr7a1_project, cr7a1_milestone

## Connector Bindings
No connector bindings.

## Custom API Bindings
No custom API bindings.

## Design Preferences
- Styling: Fluent UI 9 only. Use responsive flex layouts and Fluent UI design tokens. Distinguish project roots and milestone children with row styling; keep left-aligned labels, project expand/collapse chevrons, and a milestone icon. Keep the page usable in narrow dialog dimensions.
- Features: Query both existing tables through typed DataAPI requests; search project/milestone names and descriptions; render each project's milestones inline; scope an input project ID to that exact project and its milestones; support independent project and milestone selection, including selecting both; show OK and Cancel actions only when `pageInput.data.isDialog` is true.
- Accessibility: Semantic tree/treeitem or equivalent accessible hierarchy, keyboard-operable expand/select/search/actions, accessible names and selection state, sufficient contrast, responsive reflow, and WCAG AA defaults.

## Relevant Samples
| Page | Sample | Reason |
|------|--------|--------|
| Project and Milestone Tree | 12-dialog-form-overlay.tsx | Dialog presentation and containment guidance for a page rendered inside the genpage designer. |
| Project and Milestone Tree | 9-list-with-caching.tsx | Dataverse data-loading and caching pattern for a list populated from host data APIs. |

## Per-Page Specifications

### Project and Milestone Tree
- **File:** project-milestone-tree.tsx
- **Purpose:** Browse and search existing projects with their milestones displayed inline, and optionally choose records to return from dialog mode.
- **Entities:** cr7a1_project, cr7a1_milestone
- **Needs caching:** true
- **Key Features:** Use RuntimeTypes and typed host DataAPI requests for both Projects and Milestones. Projects are independent roots with their milestones as marked inline children. Search project/milestone names and descriptions. In dialog mode, maintain independent project and milestone selections. OK returns selected picker records; Cancel returns a cancellation output, both through `dataApi.setPageOutput(pageOutput)`.
- **Components:** Fluent UI V9 `Input`, `Button`, `Tree`, `TreeItem`, `Text`, `Badge`, `Spinner`, and appropriate Fluent UI icons. Follow the dialog sample's containment/portal guidance if using a Fluent dialog surface.
- **Layout:** Responsive single-column tree/list with a flexible search header and scrollable results; adapt action buttons and row content for narrow dialog widths. Use relative sizing and flex layout, never `100vh`/`100vw`.
- **Data Binding:** Query `cr7a1_project` and `cr7a1_milestone` through paged typed `dataApi.queryTable` requests. Associate milestones to projects by `_cr7a1_project_value`. Use project ID/name/description and milestone ID/name/description/due date/completion state.
- **Interactions:** Filter projects and milestones as search text changes. If a project ID is supplied, show only that project and its milestones, not descendants. Projects expand/collapse to show milestone children. Allow independent project and milestone selections. Only in dialog mode (`pageInput.data.isDialog === true`), show OK/Cancel; return output through `dataApi.setPageOutput(pageOutput)`.
