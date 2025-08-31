# The Edit Dialog:

On click of a row, the columns should be editable in a **Dialog**.

The Dialog is showing the following fields using the Fluent 9 Field with orientation horizontal. 
- The Name column, labeled as Comment
- Project lookup: provide options fetched from the Projects table
- Milestone lookup: provide the options fetched from the Milestone table
- Date: Use the UTC format to save the date

For the lookups (project and milestone) show only the diana_name field (not the guid). Use the guid only for saving.

When the data is changed, refresh the sum in the filter area.



