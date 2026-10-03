import React, { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Input,
  Spinner,
  Text,
  makeStyles,
  shorthands,
  tokens,
} from "@fluentui/react-components";
import { ChevronDownRegular, ChevronRightRegular, FlagRegular } from "@fluentui/react-icons";
import type {
  GeneratedComponentProps,
  cr7a1_milestone,
  cr7a1_project,
} from "./RuntimeTypes";

type MilestoneRow = cr7a1_milestone;
type ProjectRow = cr7a1_project;

interface PageOutput {
  cancelled: boolean;
  project: PickerRecord | null;
  milestone: PickerRecord | null;
}

type PageDataApi = GeneratedComponentProps["dataApi"] & {
  setPageOutput: (pageOutput: PageOutput) => void;
};

interface PageInput {
  entityName?: string;
  recordId?: string;
  data?: Record<string, unknown>;
}

type Props = Omit<GeneratedComponentProps, "dataApi"> & {
  dataApi: PageDataApi;
  pageInput?: PageInput;
};

interface ProjectRecord {
  id: string;
  name: string;
  description: string;
}

interface TreeData {
  projects: ProjectRecord[];
  milestones: MilestoneRow[];
}

interface TreeState extends TreeData {
  loading: boolean;
  error: string | null;
}

interface PickerRecord {
  id: string;
  name: string;
  entityName: "cr7a1_project" | "cr7a1_milestone";
}

const useStyles = makeStyles({
  page: {
    position: "relative",
    contain: "layout",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    minHeight: "0",
    color: tokens.colorNeutralForeground1,
    backgroundColor: tokens.colorNeutralBackground1,
    boxSizing: "border-box",
    ...shorthands.overflow("hidden"),
  },
  header: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    ...shorthands.gap(tokens.spacingHorizontalM),
    ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalL),
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  heading: { flex: "1 1 14rem", minWidth: "0" },
  search: { flex: "2 1 14rem", minWidth: "10rem" },
  content: {
    display: "flex",
    flex: "1 1 auto",
    flexDirection: "column",
    minHeight: "0",
    ...shorthands.overflow("auto"),
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalL),
  },
  tree: {
    display: "flex",
    flexDirection: "column",
    listStyleType: "none",
    ...shorthands.gap(tokens.spacingVerticalS),
    ...shorthands.padding(0),
    ...shorthands.margin(0),
  },
  group: {
    display: "flex",
    flexDirection: "column",
    listStyleType: "none",
    ...shorthands.gap(tokens.spacingVerticalXS),
    ...shorthands.padding(0),
    ...shorthands.margin(0),
  },
  projectRow: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    minHeight: "3rem",
    ...shorthands.gap(tokens.spacingHorizontalS),
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalM),
    borderRadius: tokens.borderRadiusMedium,
  },
  childList: {
    display: "flex",
    flexDirection: "column",
    listStyleType: "none",
    ...shorthands.gap(tokens.spacingVerticalXS),
    ...shorthands.padding(0, 0, 0, tokens.spacingHorizontalL),
    ...shorthands.margin(0, 0, 0, tokens.spacingHorizontalM),
    borderLeft: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  milestoneRow: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    minHeight: "2.75rem",
    ...shorthands.gap(tokens.spacingHorizontalS),
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalM),
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  rowLabel: {
    display: "flex",
    flex: "0 1 auto",
    justifyContent: "flex-start",
    minWidth: "0",
    textAlign: "left",
  },
  milestoneIcon: {
    display: "inline-flex",
    alignItems: "center",
    flex: "0 0 auto",
    color: tokens.colorBrandForeground1,
  },
  expandButton: {
    width: "2rem",
    minWidth: "2rem",
  },
  expandSpacer: {
    display: "inline-block",
    width: "2rem",
    flex: "0 0 2rem",
  },
  details: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    marginInlineStart: "auto",
    ...shorthands.gap(tokens.spacingHorizontalS),
    color: tokens.colorNeutralForeground2,
  },
  error: {
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
    borderRadius: tokens.borderRadiusMedium,
    color: tokens.colorStatusDangerForeground1,
    backgroundColor: tokens.colorStatusDangerBackground1,
  },
  empty: {
    display: "flex",
    justifyContent: "center",
    ...shorthands.padding(tokens.spacingVerticalXXL, tokens.spacingHorizontalM),
    color: tokens.colorNeutralForeground2,
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    ...shorthands.gap(tokens.spacingHorizontalM),
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalL),
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  selectionSummary: {
    flex: "1 1 14rem",
    display: "flex",
    flexWrap: "wrap",
    ...shorthands.gap(tokens.spacingHorizontalS),
    color: tokens.colorNeutralForeground2,
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    ...shorthands.gap(tokens.spacingHorizontalS),
  },
  spinner: {
    display: "flex",
    justifyContent: "center",
    ...shorthands.padding(tokens.spacingVerticalXXL),
  },
  milestoneMarker: {
    width: "0.55rem",
    height: "0.55rem",
    flex: "0 0 auto",
    borderRadius: tokens.borderRadiusCircular,
    backgroundColor: tokens.colorBrandForeground1,
  },
  projectMarker: {
    width: "0.75rem",
    height: "0.75rem",
    flex: "0 0 auto",
    borderRadius: tokens.borderRadiusSmall,
    backgroundColor: tokens.colorBrandBackground,
  },
});

function normalizeId(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const match = value.match(/\(([^)]+)\)/);
  const id = (match?.[1] ?? value).replace(/[{}]/g, "").toLowerCase();
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(id)
    ? id
    : undefined;
}

function lookupId(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  return normalizeId(value);
}

function readDialogInput(pageInput: PageInput | undefined) {
  const data = pageInput?.data ?? {};
  const inputProjectId =
    typeof data.projectId === "string"
      ? data.projectId
      : pageInput?.entityName === "cr7a1_project"
        ? pageInput.recordId
        : undefined;
  const projectId = normalizeId(inputProjectId);

  return {
    projectId,
    invalidProjectId: !!inputProjectId && !projectId,
    dialogMode: data.isDialog === true,
  };
}

async function queryAllProjects(
  dataApi: GeneratedComponentProps["dataApi"],
): Promise<ProjectRow[]> {
  const firstPage = await dataApi.queryTable("cr7a1_project", {
    select: ["cr7a1_projectid", "cr7a1_projectname", "cr7a1_description"],
    orderBy: "cr7a1_projectname asc",
    pageSize: 500,
  });
  const projects = [...firstPage.rows];
  let page = firstPage;
  while (page.hasMoreRows && page.loadMoreRows) {
    page = await page.loadMoreRows();
    projects.push(...page.rows);
  }
  return projects;
}

async function queryAllMilestones(
  dataApi: GeneratedComponentProps["dataApi"],
): Promise<MilestoneRow[]> {
  const firstPage = await dataApi.queryTable("cr7a1_milestone", {
    select: [
      "cr7a1_milestoneid",
      "cr7a1_milestonename",
      "cr7a1_description",
      "cr7a1_duedate",
      "cr7a1_iscompleted",
      "_cr7a1_project_value",
    ],
    orderBy: "cr7a1_milestonename asc",
    pageSize: 500,
  });
  const milestones = [...firstPage.rows];
  let page = firstPage;
  while (page.hasMoreRows && page.loadMoreRows) {
    page = await page.loadMoreRows();
    milestones.push(...page.rows);
  }
  return milestones;
}

function mapProjects(rows: ProjectRow[]): ProjectRecord[] {
  return rows.map((project) => ({
    id: project.cr7a1_projectid,
    name: project.cr7a1_projectname || "Unnamed project",
    description: project.cr7a1_description || "",
  }));
}

function filterProjects(
  projects: ProjectRecord[],
  query: string,
  milestoneGroups: Map<string, MilestoneRow[]>,
): ProjectRecord[] {
  if (!query) return projects;
  return projects.filter((project) => {
    const matches = `${project.name} ${project.description}`.toLocaleLowerCase().includes(query);
    const milestoneMatches = (milestoneGroups.get(project.id.toLowerCase()) ?? []).some(
      (milestone) =>
        `${milestone.cr7a1_milestonename ?? ""} ${milestone.cr7a1_description ?? ""}`
          .toLocaleLowerCase()
          .includes(query),
    );
    return matches || milestoneMatches;
  });
}

function makeProjectPickerRecord(project: ProjectRecord): PickerRecord {
  return {
    id: project.id,
    name: project.name,
    entityName: "cr7a1_project",
  };
}

function makeMilestonePickerRecord(milestone: MilestoneRow): PickerRecord {
  return {
    id: milestone.cr7a1_milestoneid,
    name: milestone.cr7a1_milestonename || "Unnamed milestone",
    entityName: "cr7a1_milestone",
  };
}

const GeneratedComponent = (props: Props) => {
  const styles = useStyles();
  const { dataApi, pageInput } = props;
  const { projectId, invalidProjectId, dialogMode } =
    readDialogInput(pageInput);
  const dataReady = !!dataApi;
  const cacheKey = `__genpage_ProjectMilestoneTree_${projectId ?? "all"}_Cache` as const;
  const inflightKey = `__genpage_ProjectMilestoneTree_${projectId ?? "all"}_Inflight` as const;
  const cached = window[cacheKey] as TreeData | undefined;
  const [data, setData] = useState<TreeState>(() => ({
    projects: cached?.projects ?? [],
    milestones: cached?.milestones ?? [],
    loading: cached === undefined,
    error: null,
  }));
  const [search, setSearch] = useState("");
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    dialogMode && projectId ? projectId : null,
  );
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);
  const [outputError, setOutputError] = useState<string | null>(null);
  const [milestoneFormError, setMilestoneFormError] = useState<string | null>(null);
  const [creatingMilestone, setCreatingMilestone] = useState(false);

  useEffect(() => {
    if (invalidProjectId) {
      setData({
        projects: [],
        milestones: [],
        loading: false,
        error: "The project input must be a valid Dataverse record ID.",
      });
      return;
    }
    if (!dataReady) return;
    const hit = window[cacheKey] as TreeData | undefined;
    if (hit) {
      if (data.projects !== hit.projects || data.milestones !== hit.milestones) {
        setData({ ...hit, loading: false, error: null });
      }
      return;
    }

    let cancelled = false;
    let pending = window[inflightKey] as Promise<TreeData> | undefined;
    if (!pending) {
      pending = Promise.all([
        queryAllProjects(dataApi),
        queryAllMilestones(dataApi),
      ])
        .then(([projects, milestones]) => {
          const mappedProjects = mapProjects(projects);
          const scopedProjects = projectId
            ? mappedProjects.filter(
                (project) => project.id.toLowerCase() === projectId,
              )
            : mappedProjects;
          const projectIds = new Set(
            scopedProjects.map((project) => project.id.toLowerCase()),
          );
          const scopedMilestones = milestones.filter((milestone) => {
            const parentId = lookupId(milestone._cr7a1_project_value);
            return parentId ? projectIds.has(parentId) : false;
          });
          const next = { projects: scopedProjects, milestones: scopedMilestones };
          window[cacheKey] = next;
          return next;
        })
        .finally(() => {
          if (window[inflightKey] === pending) delete window[inflightKey];
        });
      window[inflightKey] = pending;
    }

    pending
      .then((next) => {
        if (!cancelled) {
          setData({ ...next, loading: false, error: null });
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.error("Failed to load projects and milestones.", error);
          setData({
            projects: [],
            milestones: [],
            loading: false,
            error:
              "Projects and milestones could not be loaded. Check the data source permissions and try again.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
    // dataApi changes identity between host renders; the readiness flag and shared
    // in-flight query prevent duplicate requests on the genpage host double-mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataReady, cacheKey, inflightKey, invalidProjectId, projectId]);

  const query = search.trim().toLocaleLowerCase();
  const milestoneGroups = useMemo(() => {
    const groups = new Map<string, MilestoneRow[]>();
    data.milestones.forEach((milestone) => {
      const parentId = lookupId(milestone._cr7a1_project_value);
      if (!parentId) return;
      const group = groups.get(parentId) ?? [];
      group.push(milestone);
      groups.set(parentId, group);
    });
    return groups;
  }, [data.milestones]);
  const visibleProjects = useMemo(
    () => filterProjects(data.projects, query, milestoneGroups),
    [data.projects, milestoneGroups, query],
  );

  const matchingMilestones = (project: ProjectRecord): MilestoneRow[] => {
    const milestones = milestoneGroups.get(project.id.toLowerCase()) ?? [];
    if (!query || `${project.name} ${project.description}`.toLocaleLowerCase().includes(query)) {
      return milestones;
    }
    return milestones.filter((milestone) =>
      `${milestone.cr7a1_milestonename ?? ""} ${milestone.cr7a1_description ?? ""}`
        .toLocaleLowerCase()
        .includes(query),
    );
  };

  const selectedMilestone = data.milestones.find(
    (milestone) => milestone.cr7a1_milestoneid === selectedMilestoneId,
  );
  const pickedProjectId = selectedMilestone
    ? lookupId(selectedMilestone._cr7a1_project_value)
    : selectedProjectId?.toLowerCase();
  const selectedProject = data.projects.find(
    (project) => project.id.toLowerCase() === pickedProjectId,
  );
  const isEmpty = !data.loading && !data.error && visibleProjects.length === 0;

  const handleCreateMilestone = async (project: ProjectRecord) => {
    setCreatingMilestone(true);
    setMilestoneFormError(null);
    try {
      await window.Xrm.Navigation.navigateTo(
        {
          pageType: "entityrecord",
          entityName: "cr7a1_milestone",
          data: {
            cr7a1_project: project.id,
            cr7a1_projectname: project.name,
            cr7a1_projecttype: "cr7a1_project",
          },
        },
        { target: 2 },
      );
    } catch (error) {
      console.error("Failed to open the new milestone form.", error);
      setMilestoneFormError("The new milestone form could not be opened. Please try again.");
      setCreatingMilestone(false);
      return;
    }
    try {
      const milestones = await queryAllMilestones(dataApi);
      const projectIds = new Set(data.projects.map((item) => item.id.toLowerCase()));
      const next = {
        projects: data.projects,
        milestones: milestones.filter((milestone) => {
          const ownerId = lookupId(milestone._cr7a1_project_value);
          return !!ownerId && projectIds.has(ownerId);
        }),
      };
      window[cacheKey] = next;
      setData({ ...next, loading: false, error: null });
    } catch (error) {
      console.error("Failed to refresh milestones after closing the form.", error);
      setMilestoneFormError("The form closed, but milestones could not be refreshed. Reload the page to see changes.");
    } finally {
      setCreatingMilestone(false);
    }
  };

  const handleReturn = async (cancelled: boolean) => {
    const pageOutput: PageOutput = {
      cancelled,
      project:
        !cancelled && selectedProject
          ? makeProjectPickerRecord(selectedProject)
          : null,
      milestone:
        !cancelled && selectedMilestone
          ? makeMilestonePickerRecord(selectedMilestone)
          : null,
    };
    try {
      dataApi.setPageOutput(pageOutput);
      setOutputError(null);
      await window.Xrm.Navigation.navigateBack();
    } catch (error) {
      console.error("Failed to return the selection and close the dialog.", error);
      setOutputError("The dialog could not be closed. Please try again.");
    }
  };

  const renderProject = (project: ProjectRecord): React.ReactNode => {
    const expanded = expandedProjects[project.id] !== false;
    const milestones = matchingMilestones(project);
    const hasChildren = milestones.length > 0;

    return (
      <li
        className={styles.group}
        key={project.id}
        role="treeitem"
        aria-level={1}
        aria-expanded={hasChildren ? expanded : undefined}
      >
        <div
          className={styles.projectRow}
          style={{ backgroundColor: tokens.colorNeutralBackground3 }}
        >
          {hasChildren ? (
            <Button
              className={styles.expandButton}
              appearance="subtle"
              size="small"
              aria-label={`${expanded ? "Collapse" : "Expand"} ${project.name}`}
              aria-expanded={expanded}
              onClick={() =>
                setExpandedProjects((current) => ({
                  ...current,
                  [project.id]: !expanded,
                }))
              }
            >
              {expanded ? <ChevronDownRegular /> : <ChevronRightRegular />}
            </Button>
          ) : (
            <span className={styles.expandSpacer} aria-hidden="true" />
          )}
          <span className={styles.projectMarker} aria-hidden="true" />
          <Button
            className={styles.rowLabel}
            appearance={selectedProjectId === project.id ? "primary" : "subtle"}
            aria-pressed={selectedProjectId === project.id}
            onClick={() => {
              setSelectedMilestoneId(null);
              setSelectedProjectId(project.id);
            }}
          >
            {project.name}
          </Button>
          <span className={styles.details}>
            <Badge appearance="tint">
              {milestoneGroups.get(project.id.toLowerCase())?.length ?? 0} milestones
            </Badge>
            <Button
              size="small"
              appearance="secondary"
              aria-label={`New milestone for ${project.name}`}
              disabled={creatingMilestone}
              onClick={() => handleCreateMilestone(project)}
            >
              New milestone
            </Button>
          </span>
        </div>
        {expanded && hasChildren && (
          <ul className={styles.childList} role="group">
            {milestones.map((milestone) => {
              const milestoneId = milestone.cr7a1_milestoneid;
              const dueDate = milestone.cr7a1_duedate
                ? new Date(milestone.cr7a1_duedate).toLocaleDateString()
                : null;
              const completed =
                milestone.cr7a1_iscompleted === 1 ? "Completed" : "Open";
              return (
                <li
                  className={styles.milestoneRow}
                  key={milestoneId}
                  role="treeitem"
                  aria-level={2}
                  aria-selected={selectedMilestoneId === milestoneId}
                >
                  <Button
                    className={styles.rowLabel}
                    icon={
                      <span className={styles.milestoneIcon} aria-hidden="true">
                        <FlagRegular />
                      </span>
                    }
                    appearance={
                      selectedMilestoneId === milestoneId ? "primary" : "subtle"
                    }
                    aria-pressed={selectedMilestoneId === milestoneId}
                    onClick={() => {
                      setSelectedProjectId(project.id);
                      setSelectedMilestoneId((current) =>
                        current === milestoneId ? null : milestoneId,
                      );
                    }}
                  >
                    {milestone.cr7a1_milestonename || "Unnamed milestone"}
                  </Button>
                  <span className={styles.details}>
                    <Badge appearance="outline">{completed}</Badge>
                    {dueDate && <Text size={200}>Due {dueDate}</Text>}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </li>
    );
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.heading}>
          <Text as="h1" size={600} weight="semibold">
            Projects and milestones
          </Text>
          <Text size={200} block>
            Browse projects and their milestones.
            {projectId ? " Showing this project and its milestones." : ""}
          </Text>
        </div>
        <Input
          className={styles.search}
          value={search}
          onChange={(_, value) => setSearch(value.value)}
          placeholder="Search projects and milestones"
          aria-label="Search projects and milestones"
          type="search"
        />
      </header>

      {milestoneFormError && (
        <Text role="alert" className={styles.error}>
          {milestoneFormError}
        </Text>
      )}

      {data.loading ? (
        <div className={styles.spinner}>
          <Spinner label="Loading projects and milestones" />
        </div>
      ) : data.error ? (
        <div className={styles.content}>
          <Text role="alert" className={styles.error}>
            {data.error}
          </Text>
        </div>
      ) : (
        <section className={styles.content} aria-label="Projects and milestones">
          {isEmpty ? (
            <div className={styles.empty}>
              <Text>
                {projectId
                  ? "No matching project or milestones were found."
                  : search
                    ? "No projects or milestones match this search."
                    : "No projects are available."}
              </Text>
            </div>
          ) : (
            <ul className={styles.tree} role="tree" aria-label="Projects and milestones">
              {visibleProjects.map((project) => renderProject(project))}
            </ul>
          )}
        </section>
      )}

      {dialogMode && (
        <footer className={styles.footer}>
          <div className={styles.selectionSummary} aria-live="polite">
            <Text>Project: {selectedProject?.name ?? "None selected"}</Text>
            <Text>
              Milestone: {selectedMilestone?.cr7a1_milestonename ?? "None selected"}
            </Text>
            {outputError && <Text role="alert">{outputError}</Text>}
          </div>
          <div className={styles.actions}>
            <Button
              appearance="primary"
              onClick={() => handleReturn(false)}
            >
              OK
            </Button>
            <Button appearance="secondary" onClick={() => handleReturn(true)}>
              Cancel
            </Button>
          </div>
        </footer>
      )}
    </main>
  );
};

export default GeneratedComponent;
