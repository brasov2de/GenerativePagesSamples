Create a responsive page using a tree showing the project hierarchy and it's milestones.
Use a Fluent 9 UI controls, and show the background of the rows with different Fluent colors based in the depth level.
Each project level can have move Milestones attached, Show them inline in the tree, but mark them visually. 

The page will have a filter to search across projects and milestones.
Also the page accepts page Input: If the page is stared as a dialog (with a project id), it will show only the sub-projects and milestones filtered on that project).
Also, if the page is opened as a Dialog, the user is able to pick a project, a milestone or both and return it to the opener. Stated as a dialog, the page has 2 buttons for closing the page (with the picker records or without)

you can use Xrm.webApi to retrieve the projects with operator under, if the dataApi fuznctionality is not provided. Don't try to use operator "in" with gathered ids.