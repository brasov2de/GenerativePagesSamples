I take it back. Project is not a hierarchy. So you can get back to the dataApi requests.

But I still need to show a tree with it's milestones children.

When I pass a parameter "isDialog", show below 2 buttons: ok and cancel. Both of them should close the dialog. On "ok" pass the picked project and milestone back to the opener using dataApi.setPageOutput(pageOutput)

When a Milestone is picked, pass both project and milestone back. If a project is opened, pass only the projectid back.
In both cases, pass also the name of the picked project and milestone.