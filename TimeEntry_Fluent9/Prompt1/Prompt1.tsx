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
  shorthands
} from '@fluentui/react-components';
import {
  PanelLeftExpandRegular,
  PanelRightExpandRegular
} from '@fluentui/react-icons';
import type {
  GeneratedComponentProps,
  ReadableTableRow,
  diana_timeentry
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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statsOpen, setStatsOpen] = useState(true);

  const weekRange = useMemo(() => getWeekRange(selectedDate), [selectedDate]);

  const fetchData = useCallback(async () => {
    const filter = `(Microsoft.Dynamics.CRM.EqualUserId(PropertyName='ownerid')) and diana_date ge ${weekRange.start.toISOString()} and diana_date le ${weekRange.end.toISOString()}`;
    const result = await dataApi.queryTable("diana_timeentry", {
      select: ["diana_timeentryid", "diana_name", "diana_value", "_diana_projectid_value", "_diana_milestone_value"],
      filter
    });
    setTimeEntries(result.rows);
  }, [dataApi, weekRange]);

  useEffect(() => {
    loadThemeFromXml().then(setTheme);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
                {weekRange.start.toDateString()} - {weekRange.end.toDateString()}
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
                    appearance={selectedId === row.diana_timeentryid ? "brand" : undefined}
                    onClick={() => setSelectedId(row.diana_timeentryid)}
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
    </FluentProvider>
  );
};

export default GeneratedComponent;