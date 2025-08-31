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
  PanelRightExpandRegular
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

const GeneratedComponent: React.FC<GeneratedComponentProps> = ({ dataApi }) => {
  const [theme, setTheme] = useState<ReturnType<typeof createLightTheme> | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeEntries, setTimeEntries] = useState<ReadableTableRow<diana_timeentry>[]>([]);
  const [statsOpen, setStatsOpen] = useState(true);
  const [projects, setProjects] = useState<ReadableTableRow<diana_project>[]>([]);
  const [milestones, setMilestones] = useState<ReadableTableRow<diana_milestone>[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<ReadableTableRow<diana_timeentry> | null>(null);
  const [formValues, setFormValues] = useState<{ comment: string; projectId: string; milestoneId: string; date: string }>({ comment: '', projectId: '', milestoneId: '', date: '' });

  const weekRange = useMemo(() => getWeekRange(selectedDate), [selectedDate]);
  const sumValue = useMemo(() => timeEntries.reduce((sum, r) => sum + (r.diana_value || 0), 0), [timeEntries]);

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
    setEditRecord(row);
    setFormValues({
      comment: row.diana_name || '',
      projectId: row._diana_projectid_value?.match(/\(([^)]+)\)/)?.[1] || '',
      milestoneId: row._diana_milestone_value?.match(/\(([^)]+)\)/)?.[1] || '',
      date: row.diana_date ? new Date(row.diana_date).toISOString().substring(0, 10) : ''
    });
    setEditDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editRecord) return;
    await dataApi.updateRow("diana_timeentry", editRecord.diana_timeentryid, {
      diana_name: formValues.comment,
      _diana_projectid_value: `/diana_project(${formValues.projectId})`,
      _diana_milestone_value: `/diana_milestone(${formValues.milestoneId})`,
      diana_date: new Date(formValues.date + 'T00:00:00Z')
    });
    setEditDialogOpen(false);
    setEditRecord(null);
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
            <div style={{ flex: 1, display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
              {Array.from({ length: 7 }).map((_, i) => {
                const day = new Date(weekRange.start);
                day.setDate(day.getDate() + i);
                return <div key={i}>{day.toDateString()}</div>;
              })}
            </div>
          </div>
          {/* Data area */}
          <div style={{ flex: 1, overflow: 'auto' }}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Comment</TableHeaderCell>
                  <TableHeaderCell>Value</TableHeaderCell>
                  <TableHeaderCell>Project</TableHeaderCell>
                  <TableHeaderCell>Milestone</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeEntries.map(row => (
                  <TableRow
                    key={row.diana_timeentryid}
                    onClick={() => handleRowClick(row)}
                  >
                    <TableCell>{row.diana_name}</TableCell>
                    <TableCell>{row.diana_value}</TableCell>
                    <TableCell>{row["_diana_projectid_value@OData.Community.Display.V1.FormattedValue"]}</TableCell>
                    <TableCell>{row["_diana_milestone_value@OData.Community.Display.V1.FormattedValue"]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={(_, data) => setEditDialogOpen(data.open)}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Edit Time Entry</DialogTitle>
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