# Stage 1:Page structure

Build a responsive page for time tracking.

The Page will use only controls from Fluent UI 9: https://github.com/microsoft/fluentui and will respect the **Theming from Fluent UI 9**, by wrapping the whole app in a **FluentProvider**. Never use hardcoded colors. Always use **Fluent UI 9 theming  tokens**.

**Don't use @mui/material**.

The page is composed by:

	- a header with a height of 40px
	- the rest is split in 2 horizontal containers: 
        - the main area , which is split in 2 horizontal containers: 
            - the filter area , should have 100px height
            - and the data area
        - a side area for statistics, with a width of 250px, which should be collapsible and expandable using the icons:PanelLeftExpandRegular and PanelRightExpandRegular 

**Split the filter** area in 2 vertical zones.The upper one is a calendar picker for the weeks which allows to navigate through the weeks. The lower filter area shows the days in the selected week. 


The data area will show records from the TimeEntry table **owned by the current user**, by adding this filter to the query:
filter=(Microsoft.Dynamics.CRM.EqualUserId(PropertyName='ownerid'). Filter also on the selected week. Show the only the columns Name (labeled as Comment), Value, Project and Milestone.

## Theming

Use the following function to generate the Fluent UI 9 theme:


```typescript
async function loadThemeFromXml(): Promise<ReturnType<typeof createLightTheme>> {
     const response = await fetch("/WebResources/diana_greenTheme.xml");
     const xmlText = await response.text();
     const parser = new DOMParser();
     const xmlDoc = parser.parseFromString(xmlText, "application/xml");
     const basePaletteColor = xmlDoc.getElementsByTagName("CustomTheme")[0]?.getAttribute("basePaletteColor") || "#007804";
     const vibrancy = parseFloat(xmlDoc.getElementsByTagName("CustomTheme")[0]?.getAttribute("vibrancy") || "0");
     const hueTorsion = parseFloat(xmlDoc.getElementsByTagName("CustomTheme")[0]?.getAttribute("hueTorsion") || "0");

     const ramp : BrandVariants = [

       {  10: xmlDoc.getElementsByTagName("CustomTheme")[0]?.getAttribute("darker70") },
       { 20: xmlDoc.getElementsByTagName("CustomTheme")[0]?.getAttribute("darker60") },
       { 30: xmlDoc.getElementsByTagName("CustomTheme")[0]?.getAttribute("darker50") },
       { 40: xmlDoc.getElementsByTagName("CustomTheme")[0]?.getAttribute("darker40") },
       { 50: xmlDoc.getElementsByTagName("CustomTheme")[0]?.getAttribute("darker30") },
       { 60: xmlDoc.getElementsByTagName("CustomTheme")[0]?.getAttribute("darker20") },
       { 70: xmlDoc.getElementsByTagName("CustomTheme")[0]?.getAttribute("darker10") },
       { 80: xmlDoc.getElementsByTagName("CustomTheme")[0]?.getAttribute("primary") },
       { 90: xmlDoc.getElementsByTagName("CustomTheme")[0]?.getAttribute("lighter10") },
       { 100: xmlDoc.getElementsByTagName("CustomTheme")[0]?.getAttribute("lighter20") },
       { 110: xmlDoc.getElementsByTagName("CustomTheme")[0]?.getAttribute("lighter30") },
       { 120: xmlDoc.getElementsByTagName("CustomTheme")[0]?.getAttribute("lighter40") },
       { 130: xmlDoc.getElementsByTagName("CustomTheme")[0]?.getAttribute("lighter50") },
       { 140: xmlDoc.getElementsByTagName("CustomTheme")[0]?.getAttribute("lighter60") },
       { 150: xmlDoc.getElementsByTagName("CustomTheme")[0]?.getAttribute("lighter70") },
       { 160: xmlDoc.getElementsByTagName("CustomTheme")[0]?.getAttribute("lighter80") }
     ]

     const theme = createLightTheme(ramp);
     console.log("Theme parameters:", { basePaletteColor, vibrancy, hueTorsion });
     console.log("Generated theme:", theme);
     return theme;

}

```

For the Table control, the selected row should use the TableRow with the appearance="brand". 





