import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  FluentProvider,
  createLightTheme,
  BrandVariants,
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Button,
  tokens,
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogActions,
  DialogContent,
  Field,
  Input,
  Dropdown,
  Option
} from '@fluentui/react-components';
import {
  PanelLeftExpandRegular,
  PanelRightExpandRegular,
  ReOrderDotsVerticalFilled
} from '@fluentui/react-icons';
import type {
  GeneratedComponentProps,
  ReadableTableRow,
  diana_timeentry,
  diana_project,
  diana_milestone
} from "./RuntimeTypes";

// Provided theme loader
async function loadThemeFromXml(): Promise<ReturnType<typeof createLightTheme>> {
  const response = await fetch("/WebResources/diana_greenTheme.xml");
  const xmlText = await response.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "application/xml");
  const ramp: BrandVariants = {
    10: xmlDoc.getElementsByTagName("CustomTheme")[0]?.getAttribute("darker70") || "#004400",
    20: xmlDoc.getElementsByTagName("CustomTheme")[0]?.getAttribute("darker60") || "#005500",
    30: xmlDoc.getElementsByTagName("CustomTheme")[0]?.getAttribute("darker50") || "#006600",
    40: xmlDoc.getElementsByTagName("CustomTheme")[0]?.getAttribute("darker40") || "#007700",
    50: xmlDoc.getElementsByTagName("CustomTheme")[0]?.getAttribute("darker30") || "#008800",
    60: xmlDoc.getElementsByTagName("CustomTheme")[0]?.getAttribute("darker20") || "#009900",
    70: xmlDoc.getElementsByTagName("CustomTheme")[0]?.getAttribute("darker10") || "#00aa00",
    80: xmlDoc.getElementsByTagName("CustomTheme")[0]?.getAttribute("primary") || "#00bb00",
    90: xmlDoc.getElementsByTagName("CustomTheme")[0]?.getAttribute("lighter10") || "#22cc22",
    100: xmlDoc.getElementsByTagName("CustomTheme")[0]?.getAttribute("lighter20") || "#44dd44",
    110: xmlDoc.getElementsByTagName("CustomTheme")[0]?.getAttribute("lighter30") || "#66ee66",
    120: xmlDoc.getElementsByTagName("CustomTheme")[0]?.getAttribute("lighter40") || "#77ee77",
    130: xmlDoc.getElementsByTagName("CustomTheme")[0]?.getAttribute("lighter50") || "#88ee88",
    140: xmlDoc.getElementsByTagName("CustomTheme")[0]?.getAttribute("lighter60") || "#99ee99",
    150: xmlDoc.getElementsByTagName("CustomTheme")[0]?.getAttribute("lighter70") || "#aaeeaa",
    160: xmlDoc.getElementsByTagName("CustomTheme")[0]?.getAttribute("lighter80") || "#bbeecc"
  };
  return createLightTheme(ramp);
}

function getWeekRange(date: Date) {
  const day = date.getDay();
  const diffToMonday = (day + 6) % 7;
  const monday = new Date(date);
  monday.setDate(date.getDate() - diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { start: monday, end: sunday };
}

// DayTile Component
interface DayTileProps {
  date: Date;
  sum: number;
  onClick: () => void;
}
const DayTile: React.FC<DayTileProps> = ({ date, sum, onClick }) => {
  const dayNumber = date.getDate();
  const dayName = date.toLocaleDateString(undefined, { weekday: 'long' });
  const monthName = date.toLocaleDateString(undefined, { month: 'long' });

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px',
        backgroundColor: tokens.colorNeutralBackground2,
        borderRadius: tokens.borderRadiusMedium,
        boxShadow: tokens.shadow4,
        cursor: 'pointer',
        margin: '0 4px'
      }}
      onClick={onClick}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: tokens.borderRadiusCircular,
          backgroundColor: tokens.colorNeutralBackground3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600
        }}
      >
        {dayNumber}
      </div>
      <div style={{ flex: 1, paddingLeft: 8 }}>
        <div style={{ fontWeight: 600 }}>{dayName}</div>
        <div style={{ fontSize: '12px', color: tokens.colorNeutralForeground3 }}>{monthName}</div>
      </div>
      <div
        style={{
          padding: '2px 8px',
          borderRadius: tokens.borderRadiusCircular,
          backgroundColor: tokens.colorNeutralBackground3,
          fontSize: '12px',
          fontWeight: 500
        }}
      >
        {sum}
      </div>
    </div>
  );
};

const GeneratedComponent: React.FC<GeneratedComponentProps> = ({ dataApi }) => {
  const [theme, setTheme] = useState<ReturnType<typeof createLightTheme> | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeEntries, setTimeEntries] = useState<ReadableTableRow<diana_timeentry>[]>([]);
  const [statsOpen, setStatsOpen] = useState(true);
  const [projects, setProjects] = useState<ReadableTableRow<diana_project>[]>([]);
  const [milestones, setMilestones] = useState<ReadableTableRow<diana_milestone>[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<ReadableTableRow<diana_timeentry> | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [formValues, setFormValues] = useState<{ comment: string; projectId: string; milestoneId: string; date: string }>({ comment: '', projectId: '', milestoneId: '', date: '' });

  const weekRange = useMemo(() => getWeekRange(selectedDate), [selectedDate]);
  const sumValue = useMemo(() => timeEntries.reduce((sum, r) => sum + (r.diana_value || 0), 0), [timeEntries]);

  const dailySums = useMemo(() => {
    const map: Record<string, number> = {};
    timeEntries.forEach(r => {
      if (!r.diana_date) return;
      const dateKey = new Date(r.diana_date as any).toISOString().substring(0, 10);
      map[dateKey] = (map[dateKey] || 0) + (r.diana_value || 0);
    });
    return map;
  }, [timeEntries]);

  const groupedEntries = useMemo(() => {
    const groups: Record<string, ReadableTableRow<diana_timeentry>[]> = {};
    timeEntries.forEach(r => {
      if (!r.diana_date) return;
      const dateKey = new Date(r.diana_date as any).toISOString().substring(0, 10);
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(r);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [timeEntries]);

  const fetchData = useCallback(async () => {
    const filter = `(Microsoft.Dynamics.CRM.EqualUserId(PropertyName='ownerid')) and diana_date ge ${weekRange.start.toISOString()} and diana_date le ${weekRange.end.toISOString()}`;
    const result = await dataApi.queryTable("diana_timeentry", {
      select: ["diana_timeentryid", "diana_name", "diana_value", "_diana_projectid_value", "_diana_milestone_value", "diana_date"],
      filter
    });
    setTimeEntries(result.rows);
  }, [dataApi, weekRange]);

  const fetchLookups = useCallback(async () => {
    const projRes = await dataApi.queryTable("diana_project", { select: ["diana_projectid", "diana_name"] });
    setProjects(projRes.rows);
    const mileRes = await dataApi.queryTable("diana_milestone", { select: ["diana_milestoneid", "diana_name"] });
    setMilestones(mileRes.rows);
  }, [dataApi]);

  useEffect(() => {
    loadThemeFromXml().then(setTheme);
    fetchLookups();
  }, [fetchLookups]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRowClick = (row: ReadableTableRow<diana_timeentry>) => {
    setIsCreateMode(false);
    setEditRecord(row);
    setFormValues({
      comment: row.diana_name || '',
      projectId: row._diana_projectid_value?.match(/\(([^)]+)\)/)?.[1] || '',
      milestoneId: row._diana_milestone_value?.match(/\(([^)]+)\)/)?.[1] || '',
      date: row.diana_date ? new Date(row.diana_date).toISOString().substring(0, 10) : ''
    });
    setEditDialogOpen(true);
  };

  const handleDayClick = (day: Date) => {
    setIsCreateMode(true);
    setEditRecord(null);
    setFormValues({
      comment: '',
      projectId: '',
      milestoneId: '',
      date: day.toISOString().substring(0, 10)
    });
    setEditDialogOpen(true);
  };

  const handleSave = async () => {
    if (isCreateMode) {
      await dataApi.createRow("diana_timeentry", {
        diana_name: formValues.comment,
        _diana_projectid_value: `/diana_project(${formValues.projectId})`,
        _diana_milestone_value: `/diana_milestone(${formValues.milestoneId})`,
        diana_date: new Date(formValues.date + 'T00:00:00Z')
      });
    } else if (editRecord) {
      await dataApi.updateRow("diana_timeentry", editRecord.diana_timeentryid, {
        diana_name: formValues.comment,
        _diana_projectid_value: `/diana_project(${formValues.projectId})`,
        _diana_milestone_value: `/diana_milestone(${formValues.milestoneId})`,
        diana_date: new Date(formValues.date + 'T00:00:00Z')
      });
    }
    setEditDialogOpen(false);
    setEditRecord(null);
    await fetchData();
  };

  // Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, rowId: string) => {
    e.dataTransfer.setData("text/plain", rowId);
  };

  const handleDropOnDay = async (e: React.DragEvent, targetDateKey: string) => {
    e.preventDefault();
    const rowId = e.dataTransfer.getData("text/plain");
    if (!rowId) return;
    const record = timeEntries.find(r => r.diana_timeentryid === rowId);
    if (!record) return;
    const currentDateKey = record.diana_date ? new Date(record.diana_date).toISOString().substring(0, 10) : '';
    if (currentDateKey === targetDateKey) return; // no change
    await dataApi.updateRow("diana_timeentry", rowId, {
      diana_date: new Date(targetDateKey + 'T00:00:00Z')
    });
    await fetchData();
  };

  if (!theme) return null;

  return (
    <FluentProvider theme={theme} style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      {/* Header */}
      <div style={{ height: 40, display: 'flex', alignItems: 'center', padding: '0 8px', borderBottom: `1px solid ${tokens.colorNeutralStroke1}` }}>
        <strong>Time Tracking</strong>
      </div>
      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left main area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Filter area */}
          <div style={{ height: 100, borderBottom: `1px solid ${tokens.colorNeutralStroke1}`, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: 4 }}>
              <Button onClick={() => setSelectedDate(d => new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7))}>Prev Week</Button>
              <div style={{ flex: 1, textAlign: 'center' }}>
                {weekRange.start.toDateString()} - {weekRange.end.toDateString()} | Sum: {sumValue}
              </div>
              <Button onClick={() => setSelectedDate(d => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7))}>Next Week</Button>
            </div>
            <div style={{ flex: 1, display: 'flex', padding: '0 4px' }}>
              {Array.from({ length: 7 }).map((_, i) => {
                const day = new Date(weekRange.start);
                day.setDate(day.getDate() + i);
                const dateKey = day.toISOString().substring(0, 10);
                return (
                  <DayTile key={i} date={day} sum={dailySums[dateKey] || 0} onClick={() => handleDayClick(day)} />
                );
              })}
            </div>
          </div>
          {/* Data area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
            {groupedEntries.map(([dateKey, rows]) => (
              <div
                key={dateKey}
                style={{ marginBottom: 16, minHeight: 200, border: `1px solid ${tokens.colorNeutralStroke1}`, borderRadius: tokens.borderRadiusMedium }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDropOnDay(e, dateKey)}
              >
                <div style={{ padding: 8, fontWeight: 600 }}>{new Date(dateKey).toDateString()}</div>
                <Table>
                  <TableHeader>
                    <TableRow style={{ backgroundColor: tokens.colorBrandBackground2 }}>
                      <TableHeaderCell style={{ width: 40 }}></TableHeaderCell>
                      <TableHeaderCell>Project</TableHeaderCell>
                      <TableHeaderCell>Date</TableHeaderCell>
                      <TableHeaderCell>Value</TableHeaderCell>
                      <TableHeaderCell>Milestone</TableHeaderCell>
                      <TableHeaderCell>Name</TableHeaderCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map(row => (
                      <TableRow key={row.diana_timeentryid} onClick={() => handleRowClick(row)}>
                        <TableCell style={{ width: 40, cursor: 'grab' }} onClick={(e) => e.stopPropagation()}>
                          <div draggable onDragStart={(e) => handleDragStart(e, row.diana_timeentryid)}>
                            <ReOrderDotsVerticalFilled />
                          </div>
                        </TableCell>
                        <TableCell>{row["_diana_projectid_value@OData.Community.Display.V1.FormattedValue"]}</TableCell>
                        <TableCell>{row.diana_date ? new Date(row.diana_date).toLocaleDateString() : ''}</TableCell>
                        <TableCell>{row.diana_value}</TableCell>
                        <TableCell>{row["_diana_milestone_value@OData.Community.Display.V1.FormattedValue"]}</TableCell>
                        <TableCell>{row.diana_name}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        </div>
        {/* Side stats panel */}
        <div style={{ width: statsOpen ? 250 : 32, borderLeft: `1px solid ${tokens.colorNeutralStroke1}`, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: 4, cursor: 'pointer' }} onClick={() => setStatsOpen(o => !o)}>
            {statsOpen ? <PanelRightExpandRegular /> : <PanelLeftExpandRegular />}
          </div>
          {statsOpen && <div style={{ padding: 8 }}>Statistics content here</div>}
        </div>
      </div>

      {/* Edit / Create Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={(_, data) => setEditDialogOpen(data.open)}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>{isCreateMode ? "New Time Entry" : "Edit Time Entry"}</DialogTitle>
            <DialogContent>
              <Field label="Comment" orientation="horizontal">
                <Input value={formValues.comment} onChange={(_, d) => setFormValues(f => ({ ...f, comment: d.value }))} />
              </Field>
              <Field label="Project" orientation="horizontal">
                <Dropdown
                  value={projects.find(p => p.diana_projectid === formValues.projectId)?.diana_name || ''}
                  onOptionSelect={(_, opt) => setFormValues(f => ({ ...f, projectId: opt.optionValue as string }))}
                >
                  {projects.map(p => (
                    <Option key={p.diana_projectid} value={p.diana_projectid}>{p.diana_name}</Option>
                  ))}
                </Dropdown>
              </Field>
              <Field label="Milestone" orientation="horizontal">
                <Dropdown
                  value={milestones.find(m => m.diana_milestoneid === formValues.milestoneId)?.diana_name || ''}
                  onOptionSelect={(_, opt) => setFormValues(f => ({ ...f, milestoneId: opt.optionValue as string }))}
                >
                  {milestones.map(m => (
                    <Option key={m.diana_milestoneid} value={m.diana_milestoneid}>{m.diana_name}</Option>
                  ))}
                </Dropdown>
              </Field>
              <Field label="Date" orientation="horizontal">
                <Input type="date" value={formValues.date} onChange={(_, d) => setFormValues(f => ({ ...f, date: d.value }))} />
              </Field>
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
              <Button appearance="primary" onClick={handleSave}>Save</Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </FluentProvider>
  );
};

export default GeneratedComponent;