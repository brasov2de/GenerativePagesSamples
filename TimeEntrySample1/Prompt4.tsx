import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  useTheme,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel, GridRenderEditCellParams, useGridApiContext } from "@mui/x-data-grid";
import {
  AddRegular,
  EditRegular,
  DeleteRegular,
  MoreHorizontalRegular,
  SearchRegular,
  ChevronDownRegular,
  ChevronUpRegular,
} from "@fluentui/react-icons";
import type {
  GeneratedComponentProps,
  diana_timeentry,
  diana_project,
  diana_milestone,
  EnumRegistrations,
  TableRegistrations,
  ReadableTableRow,
  UxAgentDataApi,
  RowKeyDataColumnValue,
} from "./RuntimeTypes";

// Section box style for consistent section containers
const sectionBoxStyle = (theme: any) => ({
  padding: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  borderRadius: `${theme.shape.borderRadius}px`,
  display: "flex",
  flexDirection: "column",
  width: "100%",
  boxShadow: theme.shadows[1],
  boxSizing: "border-box",
});

// Get display value for enum (use formatted value if available)
function getEnumDisplayValue<T>(
  row: ReadableTableRow<T>,
  field: keyof T
): string | number | undefined {
  const formattedKey = `${String(field)}@OData.Community.Display.V1.FormattedValue`;
  // @ts-ignore
  if (row[formattedKey]) return row[formattedKey];
  // @ts-ignore
  return row[field];
}

// Get display value for foreign key (use formatted value if available)
function getFKDisplayValue<T>(
  row: ReadableTableRow<T>,
  field: keyof T
): string | undefined {
  const formattedKey = `${String(field)}@OData.Community.Display.V1.FormattedValue`;
  // @ts-ignore
  return row[formattedKey] || "";
}

// Format date
function formatDate(val: Date | string | undefined | null): string {
  if (!val) return "";
  const date = typeof val === "string" ? new Date(val) : val;
  if (isNaN(date.getTime())) return "";
  // Format as yyyy-MM-dd
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// =================
// Page Header Component
// =================
interface PageHeaderProps {
  onAdd: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isEditDisabled: boolean;
  isDeleteDisabled: boolean;
  search: string;
  onSearchChange: (v: string) => void;
}
const PageHeader: React.FC<PageHeaderProps> = ({
  onAdd,
  onEdit,
  onDelete,
  isEditDisabled,
  isDeleteDisabled,
  search,
  onSearchChange,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const commonButtonStyles = {
    textTransform: "none" as const,
    mr: theme.spacing(1),
  };
  return (
    <Paper
      sx={{
        ...sectionBoxStyle(theme),
        mb: theme.spacing(2),
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <Typography variant="h1" component="h1">
            Time tracking
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: theme.spacing(1) }}>
            View and manage time entries
          </Typography>
          {/* Search bar */}
          <TextField
            variant="outlined"
            size="medium"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            fullWidth
            sx={{
              mt: theme.spacing(1),
              maxWidth: theme.spacing(80),
              minWidth: theme.spacing(30),
              alignSelf: "flex-start",
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRegular
                    style={{ fontSize: theme.typography.body1.fontSize }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        {/* Toolbar actions */}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-end",
            minHeight: 0,
            paddingLeft: 0,
            paddingRight: 0,
          }}
        >
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
            }}
          >
            <Button
              color="inherit"
              aria-label="add"
              variant="text"
              startIcon={
                <AddRegular
                  style={{ fontSize: theme.typography.body1.fontSize }}
                />
              }
              sx={commonButtonStyles}
              onClick={onAdd}
            >
              Add
            </Button>
            <Button
              color="inherit"
              aria-label="edit"
              variant="text"
              startIcon={
                <EditRegular
                  style={{ fontSize: theme.typography.body1.fontSize }}
                />
              }
              sx={commonButtonStyles}
              onClick={onEdit}
              disabled={isEditDisabled}
            >
              Edit
            </Button>
            <Button
              variant="text"
              color="inherit"
              aria-label="delete"
              startIcon={
                <DeleteRegular
                  style={{ fontSize: theme.typography.body1.fontSize }}
                />
              }
              sx={commonButtonStyles}
              onClick={onDelete}
              disabled={isDeleteDisabled}
            >
              Delete
            </Button>
          </Box>
          {/* Overflow menu for small screens */}
          <Box sx={{ display: { xs: "flex", sm: "none" } }}>
            <IconButton
              color="inherit"
              aria-label="open menu"
              aria-controls="overflow-menu"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              size="large"
            >
              <MoreHorizontalRegular
                style={{ fontSize: theme.typography.body1.fontSize }}
              />
            </IconButton>
          </Box>
          <Menu
            id="overflow-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            MenuListProps={{
              "aria-labelledby": "overflow-menu-button",
            }}
          >
            <MenuItem
              onClick={() => {
                handleMenuClose();
                onAdd();
              }}
            >
              <ListItemIcon>
                <AddRegular
                  style={{ fontSize: theme.typography.body1.fontSize }}
                />
              </ListItemIcon>
              <Typography variant="body1">Add</Typography>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                onEdit();
              }}
              disabled={isEditDisabled}
            >
              <ListItemIcon>
                <EditRegular
                  style={{ fontSize: theme.typography.body1.fontSize }}
                />
              </ListItemIcon>
              <Typography variant="body1">Edit</Typography>
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                onDelete();
              }}
              disabled={isDeleteDisabled}
            >
              <ListItemIcon>
                <DeleteRegular
                  style={{ fontSize: theme.typography.body1.fontSize }}
                />
              </ListItemIcon>
              <Typography variant="body1">Delete</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </Paper>
  );
};

// ================
// Project Select Cell for Inline Editing
// ================
interface ProjectSelectEditCellProps extends GridRenderEditCellParams {
  projects: ReadableTableRow<diana_project>[];
}
const ProjectSelectEditCell: React.FC<ProjectSelectEditCellProps> = (props) => {
  const { id, value, field, api, projects } = props;
  const [internalValue, setInternalValue] = useState<string>(value ?? "");

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setInternalValue(event.target.value as string);
    api.setEditCellValue({ id, field, value: event.target.value as string }, event);
  };

  return (
    <FormControl fullWidth size="small">
      <Select
        value={internalValue}
        onChange={handleChange}
        autoFocus
        displayEmpty
        MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
      >
        {projects.map((project) => (
          <MenuItem value={`/diana_project(${project.diana_projectid})`} key={project.diana_projectid}>
            {project["diana_name@OData.Community.Display.V1.FormattedValue"] ?? project.diana_name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

// ================
// Milestone Select Cell for Inline Editing
// ================
interface MilestoneSelectEditCellProps extends GridRenderEditCellParams {
  milestones: ReadableTableRow<diana_milestone>[];
  selectedProjectId?: string;
}
const MilestoneSelectEditCell: React.FC<MilestoneSelectEditCellProps> = (props) => {
  const { id, value, field, api, milestones, selectedProjectId } = props;
  const [internalValue, setInternalValue] = useState<string>(value ?? "");

  // Filter milestones to those that belong to the selected project
  const filteredMilestones = useMemo(() => {
    if (!selectedProjectId) return milestones;
    return milestones.filter(
      (ms) =>
        (ms._diana_project_value &&
          ms._diana_project_value === `/diana_project(${selectedProjectId})`)
    );
  }, [milestones, selectedProjectId]);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setInternalValue(event.target.value as string);
    api.setEditCellValue({ id, field, value: event.target.value as string }, event);
  };

  return (
    <FormControl fullWidth size="small">
      <Select
        value={internalValue}
        onChange={handleChange}
        autoFocus
        displayEmpty
        MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
      >
        {filteredMilestones.map((milestone) => (
          <MenuItem value={`/diana_milestone(${milestone.diana_milestoneid})`} key={milestone.diana_milestoneid}>
            {milestone["diana_name@OData.Community.Display.V1.FormattedValue"] ?? milestone.diana_name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

// ================
// DataGrid Section with Grouping and Collapsibility
// ================
interface GroupedTimeEntryRow {
  type: "group";
  id: string; // e.g., 'group-2023-07-25'
  dateKey: string; // e.g., '2023-07-25'
  displayDate: string;
}
interface DataTimeEntryRow extends ReadableTableRow<diana_timeentry> {
  type: "data";
}
type TimeEntryGridRow = GroupedTimeEntryRow | DataTimeEntryRow;

interface TimeEntryGridSectionProps {
  rows: ReadableTableRow<diana_timeentry>[];
  loading: boolean;
  selectionModel: GridRowSelectionModel;
  onSelectionModelChange: (model: GridRowSelectionModel) => void;
  onProcessRowUpdate: (
    updatedRow: DataTimeEntryRow,
    originalRow: DataTimeEntryRow
  ) => Promise<DataTimeEntryRow>;
  projects: ReadableTableRow<diana_project>[];
  milestones: ReadableTableRow<diana_milestone>[];
  error: string;
  setError: (e: string) => void;
}
const TimeEntryGridSection: React.FC<TimeEntryGridSectionProps> = ({
  rows,
  loading,
  selectionModel,
  onSelectionModelChange,
  onProcessRowUpdate,
  projects,
  milestones,
  error,
  setError,
}) => {
  const theme = useTheme();

  // Collapsed groups state: dateKey -> true if collapsed
  const [collapsedGroups, setCollapsedGroups] = useState<{ [dateKey: string]: boolean }>({});

  // Group by date (descending), insert group header rows, and filter children by collapse state
  const groupedRows = useMemo<TimeEntryGridRow[]>(() => {
    // Group the rows by dateKey
    const groups: { [dateKey: string]: ReadableTableRow<diana_timeentry>[] } = {};
    rows.forEach((row) => {
      const date = row.diana_date
        ? new Date(row.diana_date)
        : new Date("1970-01-01");
      // Use yyyy-MM-dd for grouping (remove time)
      const dateKey = date
        .toISOString()
        .slice(0, 10); // '2023-07-25'
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(row);
    });

    // Sort date keys descending (most recent first)
    const sortedDateKeys = Object.keys(groups).sort((a, b) =>
      a < b ? 1 : -1
    );

    // Build grouped row list with collapsibility
    const result: TimeEntryGridRow[] = [];
    sortedDateKeys.forEach((dateKey) => {
      const displayDate = formatDate(dateKey);
      result.push({
        type: "group",
        id: `group-${dateKey}`,
        dateKey,
        displayDate,
      });
      if (!collapsedGroups[dateKey]) {
        // Only include children if group is expanded
        groups[dateKey]
          .sort((a, b) => (a.diana_name || "").localeCompare(b.diana_name || ""))
          .forEach((row) => {
            result.push({ ...row, type: "data" });
          });
      }
    });
    return result;
  }, [rows, collapsedGroups]);

  // Only allow selection of data rows (not group header rows)
  const filteredSelectionModel = useMemo(() => {
    return selectionModel.filter((id) =>
      groupedRows.find((row) => row.type === "data" && (row as DataTimeEntryRow).diana_timeentryid === id)
    );
  }, [selectionModel, groupedRows]);

  const handleSelectionModelChange = (model: GridRowSelectionModel) => {
    // Only allow selecting data rows
    const filtered = model.filter((id) =>
      groupedRows.find((row) => row.type === "data" && (row as DataTimeEntryRow).diana_timeentryid === id)
    );
    onSelectionModelChange(filtered);
  };

  // Column definitions - now with editable cells
  const columns = useMemo<GridColDef<TimeEntryGridRow>[]>(
    () => [
      {
        field: "diana_name",
        headerName: "Name",
        flex: 1.2,
        minWidth: 150,
        sortable: false,
        editable: true,
        renderCell: (params) => {
          const row = params.row as TimeEntryGridRow;
          if (row.type === "group") {
            // Collapsed or expanded for this group
            const isCollapsed = !!collapsedGroups[row.dateKey];
            return (
              <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                <IconButton
                  size="small"
                  aria-label={isCollapsed ? "Expand group" : "Collapse group"}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCollapsedGroups((prev) => ({
                      ...prev,
                      [row.dateKey]: !prev[row.dateKey],
                    }));
                  }}
                  sx={{
                    mr: 1,
                    color: theme.palette.primary.main,
                  }}
                  tabIndex={0}
                >
                  {isCollapsed ? (
                    <ChevronDownRegular
                      style={{ fontSize: 22 }}
                      aria-hidden="true"
                    />
                  ) : (
                    <ChevronUpRegular
                      style={{ fontSize: 22 }}
                      aria-hidden="true"
                    />
                  )}
                </IconButton>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.primary.main,
                    background: theme.palette.grey[100],
                    width: "100%",
                    px: 2,
                    py: 1,
                    borderRadius: `${theme.shape.borderRadius}px`,
                  }}
                >
                  {row.displayDate}
                </Typography>
              </Box>
            );
          }
          return (row as DataTimeEntryRow).diana_name;
        },
        colSpan: (params) => (params.row.type === "group" ? 9 : undefined),
        cellClassName: (params) =>
          params.row.type === "group" ? "group-header-row" : "",
        // Only editable on data rows
        editable: (params) => params.row.type === "data",
      },
      {
        field: "diana_date",
        headerName: "Date",
        flex: 1,
        minWidth: 130,
        type: "date",
        editable: false, // Not inline editable for simplicity
        renderCell: (params) => {
          if ((params.row as TimeEntryGridRow).type === "group") return null;
          return formatDate((params.row as DataTimeEntryRow).diana_date);
        },
        valueGetter: (params) =>
          params.row.type === "data"
            ? (params.row as DataTimeEntryRow).diana_date
              ? new Date((params.row as DataTimeEntryRow).diana_date)
              : null
            : null,
        hideable: false,
      },
      {
        field: "diana_duration",
        headerName: "Duration (min)",
        flex: 0.7,
        minWidth: 90,
        type: "number",
        editable: true,
        renderCell: (params) => {
          if ((params.row as TimeEntryGridRow).type === "group") return null;
          return (params.row as DataTimeEntryRow).diana_duration;
        },
        editable: (params) => params.row.type === "data",
      },
      {
        field: "diana_dialog",
        headerName: "Dialog",
        flex: 1,
        minWidth: 120,
        editable: false, // Not editable for now
        renderCell: (params) => {
          if ((params.row as TimeEntryGridRow).type === "group") return null;
          return getEnumDisplayValue(
            params.row as DataTimeEntryRow,
            "diana_dialog"
          );
        },
      },
      {
        field: "_diana_projectid_value",
        headerName: "Project",
        flex: 1,
        minWidth: 140,
        editable: true,
        renderCell: (params) => {
          if ((params.row as TimeEntryGridRow).type === "group") return null;
          return getFKDisplayValue(
            params.row as DataTimeEntryRow,
            "_diana_projectid_value"
          );
        },
        renderEditCell: (params) => {
          // Only editable for data rows
          if (params.row.type !== "data") return null;
          return (
            <ProjectSelectEditCell
              {...params}
              projects={projects}
            />
          );
        },
        editable: (params) => params.row.type === "data",
      },
      {
        field: "_diana_milestone_value",
        headerName: "Milestone",
        flex: 1,
        minWidth: 140,
        editable: true,
        renderCell: (params) => {
          if ((params.row as TimeEntryGridRow).type === "group") return null;
          // Show milestone display name
          const row = params.row as DataTimeEntryRow;
          // Try to find the milestone by FK
          const milestoneFK = row._diana_milestone_value;
          const milestoneDisplay =
            (milestones.find(
              (ms) => ms._diana_milestoneid === milestoneFK || `/diana_milestone(${ms.diana_milestoneid})` === milestoneFK
            )?.["diana_name@OData.Community.Display.V1.FormattedValue"]) ??
            row["diana_milestonegroupingname"] ??
            "";
          return milestoneDisplay;
        },
        renderEditCell: (params) => {
          if (params.row.type !== "data") return null;
          // Find selected project for this row
          const row = params.row as DataTimeEntryRow;
          let selectedProjectId = "";
          if (typeof row._diana_projectid_value === "string") {
            const m = /^\/diana_project\(([^)]+)\)/.exec(row._diana_projectid_value);
            if (m) selectedProjectId = m[1];
          }
          return (
            <MilestoneSelectEditCell
              {...params}
              milestones={milestones}
              selectedProjectId={selectedProjectId}
            />
          );
        },
        editable: (params) => params.row.type === "data",
      },
      {
        field: "diana_value",
        headerName: "Value",
        flex: 0.8,
        minWidth: 80,
        type: "number",
        editable: true,
        renderCell: (params) => {
          if ((params.row as TimeEntryGridRow).type === "group") return null;
          return (params.row as DataTimeEntryRow).diana_value;
        },
        editable: (params) => params.row.type === "data",
      },
      {
        field: "statecode",
        headerName: "State",
        flex: 0.8,
        minWidth: 90,
        renderCell: (params) => {
          if ((params.row as TimeEntryGridRow).type === "group") return null;
          return getEnumDisplayValue(
            params.row as DataTimeEntryRow,
            "statecode"
          );
        },
      },
      {
        field: "statuscode",
        headerName: "Status",
        flex: 1,
        minWidth: 110,
        renderCell: (params) => {
          if ((params.row as TimeEntryGridRow).type === "group") return null;
          return getEnumDisplayValue(
            params.row as DataTimeEntryRow,
            "statuscode"
          );
        },
      },
    ],
    [theme, collapsedGroups, projects, milestones]
  );

  return (
    <Paper
      sx={{
        ...sectionBoxStyle(theme),
        flex: 1,
        minHeight: 0,
        overflow: "hidden",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          width: "100%",
          minHeight: 0,
          overflowY: "hidden",
          boxSizing: "border-box",
        }}
      >
        <DataGrid
          rows={groupedRows}
          columns={columns}
          getRowId={(row) =>
            row.type === "group"
              ? row.id
              : (row as DataTimeEntryRow).diana_timeentryid
          }
          pageSizeOptions={[10, 20, 50]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          disableRowSelectionOnClick
          checkboxSelection
          isRowSelectable={(params) =>
            (params.row as TimeEntryGridRow).type === "data"
          }
          rowSelectionModel={filteredSelectionModel}
          onRowSelectionModelChange={handleSelectionModelChange}
          loading={loading}
          processRowUpdate={async (updatedRow, originalRow) => {
            // Only process updates for data rows
            if (updatedRow.type !== "data") return originalRow;
            return onProcessRowUpdate(
              updatedRow as DataTimeEntryRow,
              originalRow as DataTimeEntryRow
            );
          }}
          onProcessRowUpdateError={(error) => {
            setError(error?.message || "Failed to update entry.");
          }}
          sx={{
            border: "none",
            width: "100%",
            height: "100%",
            boxSizing: "border-box",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: theme.palette.grey[100],
              fontWeight: theme.typography.fontWeightBold,
              borderBottom: `1px solid ${theme.palette.divider}`,
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: theme.typography.fontWeightBold,
              color: theme.palette.text.primary,
            },
            "& .MuiDataGrid-cell": {
              borderBottom: `1px solid ${theme.palette.divider}`,
              padding: theme.spacing(1, 2),
              color: theme.palette.text.primary,
            },
            "& .MuiDataGrid-row": {
              "&.group-header-row": {
                background: theme.palette.grey[100],
                pointerEvents: "auto",
                "&:hover": {
                  background: theme.palette.grey[200],
                },
              },
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.grey[50],
              minHeight: "48px",
            },
            "& .MuiDataGrid-overlay": {
              zIndex: 2,
            },
            "& .MuiDataGrid-main": {
              fontFamily: theme.typography.fontFamily,
              overflow: "auto",
            },
            "& .MuiDataGrid-virtualScroller": {
              overflowY: "auto",
            },
            "& .MuiTablePagination-root": {
              color: theme.palette.text.primary,
            },
            "& .MuiButtonBase-root": {
              borderRadius: theme.shape.borderRadius,
            },
            outline: "none",
          }}
          aria-label="Time entry grid"
        />
      </Box>
    </Paper>
  );
};

// ================
// Main Component
// ================
const PAGE_SIZE = 20;

const GeneratedComponent: React.FC<GeneratedComponentProps> = (props) => {
  const { dataApi } = props;
  const theme = useTheme();

  // Main data state
  const [entries, setEntries] = useState<ReadableTableRow<diana_timeentry>[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);
  const [search, setSearch] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Projects/Milestones for selection
  const [projects, setProjects] = useState<ReadableTableRow<diana_project>[]>([]);
  const [milestones, setMilestones] = useState<ReadableTableRow<diana_milestone>[]>([]);
  const [loadingLookups, setLoadingLookups] = useState<boolean>(true);

  // For paging (future, if needed)
  const [hasMoreRows, setHasMoreRows] = useState<boolean>(false);
  const [loadMoreRowsFn, setLoadMoreRowsFn] =
    useState<(() => Promise<any>) | null>(null);

  // Debounce search
  const [searchDebounce, setSearchDebounce] = useState<string>(search);
  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounce(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fields to select
  const fieldsToFetch = useMemo(
    () =>
      [
        "diana_timeentryid",
        "diana_name",
        "diana_date",
        "diana_duration",
        "diana_dialog",
        "_diana_projectid_value",
        "diana_milestonegroupingname",
        "_diana_milestone_value",
        "diana_value",
        "statecode",
        "statuscode",
      ] as (keyof diana_timeentry)[],
    []
  );

  // Fetch entries
  const fetchEntries = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const filter = searchDebounce
        ? `contains(diana_name,'${searchDebounce.replace(/'/g, "''")}')`
        : undefined;

      const result = await dataApi.queryTable("diana_timeentry", {
        select: fieldsToFetch,
        pageSize: PAGE_SIZE,
        filter,
      });

      setEntries(result.rows);
      setHasMoreRows(result.hasMoreRows);
      setLoadMoreRowsFn(() => result.loadMoreRows || null);
    } catch (ex: any) {
      setError(ex.message || "Failed to load time entries.");
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [dataApi, fieldsToFetch, searchDebounce]);

  // Fetch projects and milestones for dropdowns
  const fetchProjectsAndMilestones = useCallback(async () => {
    setLoadingLookups(true);
    try {
      // Projects
      const projResult = await dataApi.queryTable("diana_project", {
        select: [
          "diana_projectid",
          "diana_name",
        ],
        pageSize: 200,
      });
      setProjects(projResult.rows);

      // Milestones
      const msResult = await dataApi.queryTable("diana_milestone", {
        select: [
          "diana_milestoneid",
          "diana_name",
          "_diana_project_value",
        ],
        pageSize: 500,
      });
      setMilestones(msResult.rows);
    } catch (ex: any) {
      // Don't block grid for lookup failure, but show error
      setError("Failed to load projects/milestones.");
      setProjects([]);
      setMilestones([]);
    } finally {
      setLoadingLookups(false);
    }
  }, [dataApi]);

  useEffect(() => {
    fetchEntries();
    setSelectionModel([]); // Reset selection on refetch
  }, [fetchEntries]);

  useEffect(() => {
    fetchProjectsAndMilestones();
  }, [fetchProjectsAndMilestones]);

  // Toolbar actions
  const handleAdd = () => {
    // In Power Apps, this would open the create form (navigate to entity record)
    const baseUrl = window.location.origin + window.location.pathname;
    window.open(
      `${baseUrl}?pagetype=entityrecord&etn=diana_timeentry&id=`,
      "_blank",
      "noopener"
    );
  };

  const handleEdit = () => {
    if (selectionModel.length !== 1) return;
    const rowId = selectionModel[0];
    const baseUrl = window.location.origin + window.location.pathname;
    window.open(
      `${baseUrl}?pagetype=entityrecord&etn=diana_timeentry&id=${encodeURIComponent(
        String(rowId)
      )}`,
      "_blank",
      "noopener"
    );
  };

  const handleDelete = async () => {
    if (selectionModel.length === 0) return;
    if (
      !window.confirm(
        "Are you sure you want to delete the selected time entry/entries? This action cannot be undone."
      )
    ) {
      return;
    }
    setLoading(true);
    setError("");
    try {
      for (const rowId of selectionModel) {
        await dataApi.deleteRow("diana_timeentry", String(rowId));
      }
      setEntries((prev) =>
        prev.filter((rec) => !selectionModel.includes(rec.diana_timeentryid))
      );
      setSelectionModel([]);
    } catch (ex: any) {
      setError(ex.message || "Failed to delete time entry.");
    } finally {
      setLoading(false);
    }
  };

  // Selection change
  const handleSelectionModelChange = (model: GridRowSelectionModel) => {
    setSelectionModel(model);
  };

  // Handle row update (inline edit)
  const handleProcessRowUpdate = async (
    updatedRow: DataTimeEntryRow,
    originalRow: DataTimeEntryRow
  ): Promise<DataTimeEntryRow> => {
    setError(""); // clear error
    try {
      // Compute changed fields
      const changed: Partial<diana_timeentry> = {};
      // Allow updating editable fields only
      if (updatedRow.diana_name !== originalRow.diana_name) {
        changed.diana_name = updatedRow.diana_name;
      }
      if (updatedRow.diana_duration !== originalRow.diana_duration) {
        changed.diana_duration = updatedRow.diana_duration;
      }
      if (updatedRow.diana_value !== originalRow.diana_value) {
        changed.diana_value = updatedRow.diana_value;
      }
      if (
        updatedRow._diana_projectid_value !== originalRow._diana_projectid_value
      ) {
        changed._diana_projectid_value = updatedRow._diana_projectid_value;
      }
      if (
        updatedRow._diana_milestone_value !== originalRow._diana_milestone_value
      ) {
        changed._diana_milestone_value = updatedRow._diana_milestone_value;
      }

      if (Object.keys(changed).length === 0) {
        return updatedRow; // no-op
      }

      // Save to backend
      await dataApi.updateRow(
        "diana_timeentry",
        updatedRow.diana_timeentryid,
        changed
      );

      // Update in local state
      setEntries((prev) =>
        prev.map((row) =>
          row.diana_timeentryid === updatedRow.diana_timeentryid
            ? { ...row, ...changed }
            : row
        )
      );

      return { ...updatedRow, ...changed };
    } catch (ex: any) {
      setError(ex.message || "Failed to update time entry.");
      throw ex;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        width: "100%",
        height: "100%",
        overflow: "auto",
        padding: theme.spacing(3),
        bgcolor: "transparent",
        boxShadow: "none",
        boxSizing: "border-box",
      }}
    >
      <PageHeader
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isEditDisabled={selectionModel.length !== 1}
        isDeleteDisabled={selectionModel.length === 0}
        search={search}
        onSearchChange={setSearch}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          gap: theme.spacing(3),
          width: "100%",
          minHeight: 0,
          maxWidth: "100%",
          boxSizing: "border-box",
        }}
      >
        {error && (
          <Paper
            sx={{
              ...sectionBoxStyle(theme),
              mb: theme.spacing(2),
              borderLeft: `4px solid ${theme.palette.error.main}`,
              bgcolor: theme.palette.error.light,
            }}
          >
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          </Paper>
        )}
        {loadingLookups ? (
          <Box sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", minHeight: 180 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TimeEntryGridSection
            rows={entries}
            loading={loading}
            selectionModel={selectionModel}
            onSelectionModelChange={handleSelectionModelChange}
            onProcessRowUpdate={handleProcessRowUpdate}
            projects={projects}
            milestones={milestones}
            error={error}
            setError={setError}
          />
        )}
      </Box>
    </Box>
  );
};

export default GeneratedComponent;