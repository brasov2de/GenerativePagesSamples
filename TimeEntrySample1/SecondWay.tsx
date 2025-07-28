/*
Prompts
	1. Create a responsive page for time tracking using the Time Entry table, with references to the table Projects and Milestones.
	2. Group the grid data by time entry date
    3. Make the groups by date collapsible and expandable.
 */

import React, { useEffect, useMemo, useCallback, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  CircularProgress,
  Alert,
  useTheme,
  Collapse
} from "@mui/material";
import {
  AddRegular,
  EditRegular,
  DeleteRegular,
  MoreHorizontalRegular,
  SearchRegular,
  ChevronDownRegular,
  ChevronUpRegular
} from "@fluentui/react-icons";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers";

import type {
  GeneratedComponentProps,
  diana_timeentry,
  diana_project,
  diana_milestone,
  TableRegistrations,
  EnumRegistrations,
  ReadableTableRow,
  DataColumnValue,
  RowKeyDataColumnValue,
  ExtractSelectable,
} from "./RuntimeTypes";

// ==================== Styles Utility ====================
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

// ==================== Utility Functions ====================
function getFormatted(row: any, field: string, fallback: string = ""): string {
  return (
    row?.[`${field}@OData.Community.Display.V1.FormattedValue`] ??
    row?.[field] ??
    fallback
  );
}

function getProjectDisplay(row: ReadableTableRow<diana_timeentry>): string {
  return (
    row["_diana_projectid_value@OData.Community.Display.V1.FormattedValue"] ||
    ""
  );
}
function getMilestoneDisplay(row: ReadableTableRow<diana_timeentry>): string {
  return (
    row["_diana_milestone_value@OData.Community.Display.V1.FormattedValue"] ||
    ""
  );
}

// Group rows by date (date string: 'YYYY-MM-DD')
function groupRowsByDate(rows: ReadableTableRow<diana_timeentry>[]) {
  const groups: { [date: string]: ReadableTableRow<diana_timeentry>[] } = {};
  rows.forEach((row) => {
    const d = row.diana_date ? new Date(row.diana_date) : undefined;
    // Use ISO date string (yyyy-mm-dd) as group key
    const dateStr = d
      ? d.toISOString().slice(0, 10)
      : "No Date";
    if (!groups[dateStr]) groups[dateStr] = [];
    groups[dateStr].push(row);
  });
  return groups;
}

// Format group header as readable date
function formatDateHeader(dateStr: string): string {
  if (dateStr === "No Date") return "No date";
  const dateObj = new Date(dateStr);
  return dateObj.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ==================== Dialogs: Add/Edit TimeEntry ====================
interface TimeEntryDialogProps {
  open: boolean;
  mode: "add" | "edit";
  initialData?: Partial<ReadableTableRow<diana_timeentry>>;
  projects: { value: string; label: string }[];
  milestones: { value: string; label: string }[];
  onCancel: () => void;
  onSave: (data: Partial<diana_timeentry>) => void;
  loading: boolean;
}

const TimeEntryDialog: React.FC<TimeEntryDialogProps> = ({
  open,
  mode,
  initialData = {},
  projects,
  milestones,
  onCancel,
  onSave,
  loading,
}) => {
  const theme = useTheme();

  // Controlled state for form fields
  const [date, setDate] = useState<Date | null>(initialData.diana_date ? new Date(initialData.diana_date) : null);
  const [project, setProject] = useState<string>(initialData._diana_projectid_value || "");
  const [milestone, setMilestone] = useState<string>(initialData._diana_milestone_value || "");
  const [duration, setDuration] = useState<number>(
    typeof initialData.diana_duration === "number" ? initialData.diana_duration : 1
  );
  const [name, setName] = useState<string>(initialData.diana_name || "");
  const [value, setValue] = useState<number>(
    typeof initialData.diana_value === "number" ? initialData.diana_value : 0
  );
  const [trigger, setTrigger] = useState<string>(initialData.diana_trigger || "");

  // Validation
  const [errors, setErrors] = useState<{ [K: string]: string }>({});

  useEffect(() => {
    setDate(initialData.diana_date ? new Date(initialData.diana_date) : null);
    setProject(initialData._diana_projectid_value || "");
    setMilestone(initialData._diana_milestone_value || "");
    setDuration(
      typeof initialData.diana_duration === "number"
        ? initialData.diana_duration
        : 1
    );
    setName(initialData.diana_name || "");
    setValue(
      typeof initialData.diana_value === "number"
        ? initialData.diana_value
        : 0
    );
    setTrigger(initialData.diana_trigger || "");
    setErrors({});
  }, [initialData, open]);

  const validate = (): boolean => {
    const e: { [K: string]: string } = {};
    if (!date) e.diana_date = "Date is required";
    if (!project) e._diana_projectid_value = "Project is required";
    if (!milestone) e._diana_milestone_value = "Milestone is required";
    if (!name.trim()) e.diana_name = "Name is required";
    if (!duration || duration <= 0) e.diana_duration = "Duration must be > 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      diana_date: date!,
      _diana_projectid_value: project,
      _diana_milestone_value: milestone,
      diana_name: name,
      diana_duration: duration,
      diana_value: value,
      diana_trigger: trigger,
    });
  };

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === "add" ? "Add time entry" : "Edit time entry"}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date"
                value={date}
                onChange={setDate}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    error={!!errors.diana_date}
                    helperText={errors.diana_date}
                    fullWidth
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!errors._diana_projectid_value}>
              <InputLabel>Project</InputLabel>
              <Select
                value={project}
                label="Project"
                onChange={(e) => setProject(e.target.value as string)}
              >
                {projects.map((prj) => (
                  <MenuItem value={prj.value} key={prj.value}>
                    {prj.label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors._diana_projectid_value}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required error={!!errors._diana_milestone_value}>
              <InputLabel>Milestone</InputLabel>
              <Select
                value={milestone}
                label="Milestone"
                onChange={(e) => setMilestone(e.target.value as string)}
              >
                {milestones.map((ms) => (
                  <MenuItem value={ms.value} key={ms.value}>
                    {ms.label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors._diana_milestone_value}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
              error={!!errors.diana_name}
              helperText={errors.diana_name}
              inputProps={{ maxLength: 64 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Duration (hours)"
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              fullWidth
              required
              error={!!errors.diana_duration}
              helperText={errors.diana_duration}
              inputProps={{ min: 1, max: 24 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Value"
              type="number"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              label="Trigger"
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              fullWidth
              inputProps={{ maxLength: 64 }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="inherit" variant="outlined" disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained" disabled={loading}>
          {mode === "add" ? "Add" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ==================== Confirm Delete Dialog ====================
interface ConfirmDeleteDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  loading: boolean;
  count: number;
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  open,
  onCancel,
  onConfirm,
  loading,
  count
}) => {
  const theme = useTheme();
  return (
    <Dialog open={open} onClose={loading ? undefined : onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>
        Confirm delete
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: theme.spacing(1) }}>
          {count === 1
            ? "Are you sure you want to delete this time entry? This action cannot be undone."
            : `Are you sure you want to delete these ${count} time entries? This action cannot be undone.`}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="inherit" variant="outlined" disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ==================== Page Header ====================
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
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", width: "100%" }}>
        <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <Typography variant="h1" component="h1">
            Time tracking
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: theme.spacing(1) }}>
            Track time entries, projects, and milestones
          </Typography>
          <TextField
            variant="outlined"
            size="medium"
            placeholder="Search..."
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            fullWidth
            sx={{
              mt: theme.spacing(1),
              maxWidth: theme.spacing(80),
              minWidth: theme.spacing(30),
              alignSelf: "flex-start"
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRegular style={{ fontSize: theme.typography.body1.fontSize }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        {/* Toolbar actions */}
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", minHeight: 0, paddingLeft: 0, paddingRight: 0 }}>
          <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}>
            <Button
              color="inherit"
              aria-label="add"
              variant="text"
              startIcon={<AddRegular style={{ fontSize: theme.typography.body1.fontSize }} />}
              sx={commonButtonStyles}
              onClick={onAdd}
            >Add</Button>
            <Button
              color="inherit"
              aria-label="edit"
              variant="text"
              startIcon={<EditRegular style={{ fontSize: theme.typography.body1.fontSize }} />}
              sx={commonButtonStyles}
              onClick={onEdit}
              disabled={isEditDisabled}
            >Edit</Button>
            <Button
              variant="text"
              color="inherit"
              aria-label="delete"
              startIcon={<DeleteRegular style={{ fontSize: theme.typography.body1.fontSize }} />}
              sx={commonButtonStyles}
              onClick={onDelete}
              disabled={isDeleteDisabled}
            >Delete</Button>
          </Box>
          <Box sx={{ display: { xs: "flex", sm: "none" } }}>
            <IconButton
              color="inherit"
              aria-label="open menu"
              aria-controls="overflow-menu"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              size="large"
            >
              <MoreHorizontalRegular style={{ fontSize: theme.typography.body1.fontSize }} />
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
            <MenuItem onClick={() => { handleMenuClose(); onAdd(); }}>
              <ListItemIcon>
                <AddRegular style={{ fontSize: theme.typography.body1.fontSize }} />
              </ListItemIcon>
              <Typography variant="body1">Add</Typography>
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); onEdit(); }} disabled={isEditDisabled}>
              <ListItemIcon>
                <EditRegular style={{ fontSize: theme.typography.body1.fontSize }} />
              </ListItemIcon>
              <Typography variant="body1">Edit</Typography>
            </MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); onDelete(); }} disabled={isDeleteDisabled}>
              <ListItemIcon>
                <DeleteRegular style={{ fontSize: theme.typography.body1.fontSize }} />
              </ListItemIcon>
              <Typography variant="body1">Delete</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </Paper>
  );
};

// ==================== Grouped List Section ====================
interface TimeEntryGroupedListSectionProps {
  groups: { [date: string]: ReadableTableRow<diana_timeentry>[] };
  groupOrder: string[];
  selectionModel: string[];
  onSelectionModelChange: (model: string[]) => void;
  loading: boolean;
  error: string;
  onRowDoubleClick?: (row: ReadableTableRow<diana_timeentry>) => void;
}

const TimeEntryGroupedListSection: React.FC<TimeEntryGroupedListSectionProps> = ({
  groups,
  groupOrder,
  selectionModel,
  onSelectionModelChange,
  loading,
  error,
  onRowDoubleClick,
}) => {
  const theme = useTheme();

  // State: expanded/collapsed for each group
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // When groupOrder changes, expand all by default
  useEffect(() => {
    setExpandedGroups((prev) => {
      // Expand all new groups, keep existing states for current ones
      const next: Record<string, boolean> = {};
      groupOrder.forEach((key) => {
        next[key] = prev[key] !== undefined ? prev[key] : true;
      });
      return next;
    });
  }, [groupOrder]);

  // Column structure for rows
  const colWidths = [110, 140, 140, 110, 120, 100, 120];
  // [Date, Project, Milestone, Duration, Name, Value, Trigger]

  // Helper for row selection
  const isRowSelected = (id: string) => selectionModel.includes(id);

  // Click handler
  const handleRowClick = (row: ReadableTableRow<diana_timeentry>, e: React.MouseEvent) => {
    // Ctrl/meta: multi-select, else single
    if (e.ctrlKey || e.metaKey) {
      if (isRowSelected(row.diana_timeentryid)) {
        onSelectionModelChange(selectionModel.filter((sid) => sid !== row.diana_timeentryid));
      } else {
        onSelectionModelChange([...selectionModel, row.diana_timeentryid]);
      }
    } else {
      if (selectionModel.length === 1 && isRowSelected(row.diana_timeentryid)) {
        onSelectionModelChange([]);
      } else {
        onSelectionModelChange([row.diana_timeentryid]);
      }
    }
  };

  // DoubleClick handler
  const handleRowDoubleClick = (row: ReadableTableRow<diana_timeentry>, e: React.MouseEvent) => {
    if (onRowDoubleClick) onRowDoubleClick(row);
  };

  // Group expand/collapse toggle
  const handleToggleGroup = (key: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Header row
  const renderListHeader = () => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        bgcolor: theme.palette.grey[100],
        borderBottom: `1px solid ${theme.palette.divider}`,
        px: theme.spacing(1),
        py: theme.spacing(0.5),
        fontWeight: 700,
        fontSize: theme.typography.body2.fontSize,
        color: theme.palette.text.primary,
        minHeight: 40,
        position: "sticky",
        top: 0,
        zIndex: 2,
      }}
    >
      {/* Empty for selection */}
      <Box sx={{ width: 32, flexShrink: 0 }} />
      <Box sx={{ width: colWidths[0], flexShrink: 0 }}>Date</Box>
      <Box sx={{ width: colWidths[1], flexShrink: 0 }}>Project</Box>
      <Box sx={{ width: colWidths[2], flexShrink: 0 }}>Milestone</Box>
      <Box sx={{ width: colWidths[3], flexShrink: 0 }}>Duration (h)</Box>
      <Box sx={{ width: colWidths[4], flexShrink: 0 }}>Name</Box>
      <Box sx={{ width: colWidths[5], flexShrink: 0 }}>Value</Box>
      <Box sx={{ width: colWidths[6], flexShrink: 0 }}>Trigger</Box>
    </Box>
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
        {error && (
          <Alert severity="error" sx={{ mb: theme.spacing(1) }}>
            {error}
          </Alert>
        )}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            width: "100%",
            pb: theme.spacing(1),
            boxSizing: "border-box",
          }}
        >
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 120 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {renderListHeader()}
              {groupOrder.length === 0 && (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  align="center"
                  sx={{ mt: theme.spacing(6) }}
                >
                  No time entries found.
                </Typography>
              )}
              {groupOrder.map((dateKey) => (
                <Box key={dateKey} sx={{ mb: theme.spacing(1) }}>
                  {/* Group Header */}
                  <Box
                    sx={{
                      position: "sticky",
                      top: 40, // below list header
                      zIndex: 1,
                      bgcolor: theme.palette.background.paper,
                      px: theme.spacing(1),
                      py: theme.spacing(0.5),
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <IconButton
                      size="small"
                      aria-label={expandedGroups[dateKey] ? "Collapse group" : "Expand group"}
                      onClick={() => handleToggleGroup(dateKey)}
                      sx={{
                        mr: 1,
                        transition: "transform 0.2s",
                        color: theme.palette.primary.main,
                      }}
                    >
                      {expandedGroups[dateKey] ? (
                        <ChevronUpRegular fontSize="20px" />
                      ) : (
                        <ChevronDownRegular fontSize="20px" />
                      )}
                    </IconButton>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 700,
                        fontSize: theme.typography.body1.fontSize,
                        color: theme.palette.primary.dark,
                        letterSpacing: 0.2,
                        flex: 1,
                      }}
                    >
                      {formatDateHeader(dateKey)}
                    </Typography>
                  </Box>
                  {/* Entries for this date */}
                  <Collapse in={!!expandedGroups[dateKey]} timeout="auto" unmountOnExit>
                    {groups[dateKey].map((row) => {
                      const selected = isRowSelected(row.diana_timeentryid);
                      return (
                        <Box
                          key={row.diana_timeentryid}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            px: theme.spacing(1),
                            py: theme.spacing(0.5),
                            bgcolor: selected
                              ? theme.palette.action.selected
                              : "transparent",
                            cursor: "pointer",
                            borderBottom: `1px solid ${theme.palette.divider}`,
                            borderRadius: `${theme.shape.borderRadius}px`,
                            transition: "background 0.2s",
                            "&:hover": {
                              bgcolor: theme.palette.action.hover,
                            },
                            outline: selected ? `2px solid ${theme.palette.primary.main}` : "none",
                          }}
                          tabIndex={0}
                          aria-selected={selected}
                          onClick={(e) => handleRowClick(row, e)}
                          onDoubleClick={(e) => handleRowDoubleClick(row, e)}
                        >
                          {/* Custom checkbox */}
                          <Box sx={{
                            width: 32,
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}>
                            <input
                              type="checkbox"
                              checked={selected}
                              tabIndex={-1}
                              readOnly
                              aria-label="Select row"
                              style={{ accentColor: theme.palette.primary.main, width: 18, height: 18 }}
                            />
                          </Box>
                          <Box sx={{ width: colWidths[0], flexShrink: 0, color: theme.palette.text.secondary, fontSize: theme.typography.body2.fontSize }}>
                            {/* Date (only for accessibility, as group header is shown) */}
                            <span className="sr-only">{formatDateHeader(dateKey)}</span>
                          </Box>
                          <Box sx={{ width: colWidths[1], flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {getProjectDisplay(row)}
                          </Box>
                          <Box sx={{ width: colWidths[2], flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {getMilestoneDisplay(row)}
                          </Box>
                          <Box sx={{ width: colWidths[3], flexShrink: 0 }}>
                            {row.diana_duration}
                          </Box>
                          <Box sx={{ width: colWidths[4], flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {row.diana_name}
                          </Box>
                          <Box sx={{ width: colWidths[5], flexShrink: 0 }}>
                            {row.diana_value}
                          </Box>
                          <Box sx={{ width: colWidths[6], flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {row.diana_trigger}
                          </Box>
                        </Box>
                      );
                    })}
                  </Collapse>
                </Box>
              ))}
            </>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

// ==================== Main Component ====================
const PAGE_SIZE = 30;

const GeneratedComponent: React.FC<GeneratedComponentProps> = (props) => {
  const { dataApi } = props;
  const theme = useTheme();

  // State
  const [rows, setRows] = useState<ReadableTableRow<diana_timeentry>[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [selectionModel, setSelectionModel] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [editRow, setEditRow] = useState<ReadableTableRow<diana_timeentry> | undefined>(undefined);
  const [projects, setProjects] = useState<{ value: string; label: string }[]>([]);
  const [milestones, setMilestones] = useState<{ value: string; label: string }[]>([]);

  // Add/Edit loading
  const [dialogLoading, setDialogLoading] = useState<boolean>(false);

  // Confirm delete dialog state
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  // Debounced search
  const [searchDebounced, setSearchDebounced] = useState(search);
  useEffect(() => {
    const timeout = setTimeout(() => setSearchDebounced(search), 300);
    return () => clearTimeout(timeout);
  }, [search]);

  // Fetch Projects for dropdown
  const fetchProjects = useCallback(async () => {
    try {
      const res = await dataApi.queryTable("diana_project", {
        select: ["diana_projectid", "diana_name"],
        pageSize: 100,
      });
      setProjects(
        res.rows.map((row) => ({
          value: `/diana_project(${row.diana_projectid})`,
          label: row.diana_name,
        }))
      );
    } catch (e) {
      setProjects([]);
    }
  }, [dataApi]);

  // Fetch Milestones for dropdown
  const fetchMilestones = useCallback(async () => {
    try {
      const res = await dataApi.queryTable("diana_milestone", {
        select: ["diana_milestoneid", "diana_name"],
        pageSize: 100,
      });
      setMilestones(
        res.rows.map((row) => ({
          value: `/diana_milestone(${row.diana_milestoneid})`,
          label: row.diana_name,
        }))
      );
    } catch (e) {
      setMilestones([]);
    }
  }, [dataApi]);

  // Fetch Time Entries
  const fetchTimeEntries = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const filter = searchDebounced
        ? `contains(diana_name,'${searchDebounced
            .replace(/'/g, "''")
            .trim()}')`
        : undefined;
      const res = await dataApi.queryTable("diana_timeentry", {
        select: [
          "diana_timeentryid",
          "diana_date",
          "diana_duration",
          "diana_name",
          "diana_value",
          "diana_trigger",
          "_diana_projectid_value",
          "_diana_milestone_value"
        ],
        pageSize: PAGE_SIZE,
        filter,
      });
      setRows(res.rows);
    } catch (e: any) {
      setError(e.message || "Failed to load time entries.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [dataApi, searchDebounced]);

  // Initial + on search load
  useEffect(() => {
    fetchProjects();
    fetchMilestones();
  }, [fetchProjects, fetchMilestones]);
  useEffect(() => {
    fetchTimeEntries();
    setSelectionModel([]);
  }, [fetchTimeEntries]);

  // Add
  const handleAdd = () => {
    setDialogMode("add");
    setEditRow(undefined);
    setDialogOpen(true);
  };

  // Edit
  const handleEdit = () => {
    if (selectionModel.length !== 1) return;
    const row = rows.find((r) => r.diana_timeentryid === selectionModel[0]);
    if (!row) return;
    setDialogMode("edit");
    setEditRow(row);
    setDialogOpen(true);
  };

  // Delete button now opens confirm dialog
  const handleDelete = () => {
    if (selectionModel.length === 0) return;
    setConfirmDialogOpen(true);
  };

  // Actual delete logic after confirmation
  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    setError("");
    try {
      for (const rowId of selectionModel) {
        await dataApi.deleteRow("diana_timeentry", rowId as string);
      }
      await fetchTimeEntries();
      setSelectionModel([]);
      setConfirmDialogOpen(false);
    } catch (e: any) {
      setError(e.message || "Failed to delete time entry.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Cancel confirm dialog
  const handleCancelDelete = () => {
    setConfirmDialogOpen(false);
  };

  // Save from Dialog
  const handleDialogSave = async (data: Partial<diana_timeentry>) => {
    setDialogLoading(true);
    try {
      if (dialogMode === "add") {
        await dataApi.createRow("diana_timeentry", {
          ...data,
        });
      } else if (dialogMode === "edit" && editRow) {
        await dataApi.updateRow("diana_timeentry", editRow.diana_timeentryid, {
          ...data,
        });
      }
      setDialogOpen(false);
      await fetchTimeEntries();
    } catch (e: any) {
      setError(e.message || "Failed to save time entry");
    } finally {
      setDialogLoading(false);
    }
  };

  // Cancel Dialog
  const handleDialogCancel = () => {
    setDialogOpen(false);
    setEditRow(undefined);
  };

  // Selection Change
  const handleSelectionModelChange = (model: string[]) => {
    setSelectionModel(model);
  };

  // Group rows by date (sorted descending by date)
  const grouped = useMemo(() => {
    const groups = groupRowsByDate(rows);
    // Sort group keys descending by date
    const groupOrder = Object.keys(groups).sort((a, b) => {
      // "No Date" last
      if (a === "No Date") return 1;
      if (b === "No Date") return -1;
      return b.localeCompare(a); // descending
    });
    return { groups, groupOrder };
  }, [rows]);

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
        <TimeEntryGroupedListSection
          groups={grouped.groups}
          groupOrder={grouped.groupOrder}
          selectionModel={selectionModel}
          onSelectionModelChange={handleSelectionModelChange}
          loading={loading}
          error={error}
        />
      </Box>

      {/* Add/Edit TimeEntry Dialog */}
      <TimeEntryDialog
        open={dialogOpen}
        mode={dialogMode}
        initialData={dialogMode === "edit" ? editRow : undefined}
        projects={projects}
        milestones={milestones}
        onCancel={handleDialogCancel}
        onSave={handleDialogSave}
        loading={dialogLoading}
      />

      {/* Confirm delete dialog */}
      <ConfirmDeleteDialog
        open={confirmDialogOpen}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        count={selectionModel.length}
      />
    </Box>
  );
};

export default GeneratedComponent;