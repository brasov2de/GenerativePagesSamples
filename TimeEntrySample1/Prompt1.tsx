/*Prompt used

"Create a responsive page for time tracking using the Time Entry table"
 */

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
  CircularProgress,
} from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import {
  AddRegular,
  EditRegular,
  DeleteRegular,
  MoreHorizontalRegular,
  SearchRegular,
} from "@fluentui/react-icons";
import type {
  GeneratedComponentProps,
  diana_timeentry,
  EnumRegistrations,
  TableRegistrations,
  ReadableTableRow,
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
  // Try OData formatted value
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
// DataGrid Section
// ================
interface TimeEntryGridSectionProps {
  rows: ReadableTableRow<diana_timeentry>[];
  loading: boolean;
  selectionModel: GridRowSelectionModel;
  onSelectionModelChange: (model: GridRowSelectionModel) => void;
}
const TimeEntryGridSection: React.FC<TimeEntryGridSectionProps> = ({
  rows,
  loading,
  selectionModel,
  onSelectionModelChange,
}) => {
  const theme = useTheme();

  // Define columns for diana_timeentry
  // Show relevant columns, using formatted values for enums/FKs
  const columns = useMemo<GridColDef<ReadableTableRow<diana_timeentry>>[]>(
    () => [
      {
        field: "diana_name",
        headerName: "Name",
        flex: 1.2,
        minWidth: 150,
        sortable: true,
        valueGetter: (params) => params.row.diana_name,
      },
      {
        field: "diana_date",
        headerName: "Date",
        flex: 1,
        minWidth: 130,
        type: "date",
        valueGetter: (params) =>
          params.row.diana_date ? new Date(params.row.diana_date) : null,
        renderCell: (params) => formatDate(params.row.diana_date),
        sortable: true,
      },
      {
        field: "diana_duration",
        headerName: "Duration (min)",
        flex: 0.7,
        minWidth: 90,
        type: "number",
        valueGetter: (params) => params.row.diana_duration,
        sortable: true,
      },
      {
        field: "diana_dialog",
        headerName: "Dialog",
        flex: 1,
        minWidth: 120,
        sortable: true,
        valueGetter: (params) =>
          getEnumDisplayValue(params.row, "diana_dialog"),
      },
      {
        field: "_diana_projectid_value",
        headerName: "Project",
        flex: 1,
        minWidth: 140,
        sortable: false,
        valueGetter: (params) =>
          getFKDisplayValue(params.row, "_diana_projectid_value"),
      },
      {
        field: "diana_milestonegroupingname",
        headerName: "Milestone",
        flex: 1,
        minWidth: 120,
        sortable: false,
        valueGetter: (params) => params.row.diana_milestonegroupingname,
      },
      {
        field: "diana_value",
        headerName: "Value",
        flex: 0.8,
        minWidth: 80,
        type: "number",
        valueGetter: (params) => params.row.diana_value,
        sortable: true,
      },
      {
        field: "statecode",
        headerName: "State",
        flex: 0.8,
        minWidth: 90,
        sortable: true,
        valueGetter: (params) => getEnumDisplayValue(params.row, "statecode"),
      },
      {
        field: "statuscode",
        headerName: "Status",
        flex: 1,
        minWidth: 110,
        sortable: true,
        valueGetter: (params) => getEnumDisplayValue(params.row, "statuscode"),
      },
    ],
    []
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
          rows={rows}
          columns={columns}
          getRowId={(row) => row.diana_timeentryid}
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
          rowSelectionModel={selectionModel}
          onRowSelectionModelChange={onSelectionModelChange}
          loading={loading}
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

  useEffect(() => {
    fetchEntries();
    setSelectionModel([]); // Reset selection on refetch
  }, [fetchEntries]);

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
        <TimeEntryGridSection
          rows={entries}
          loading={loading}
          selectionModel={selectionModel}
          onSelectionModelChange={handleSelectionModelChange}
        />
      </Box>
    </Box>
  );
};

export default GeneratedComponent;