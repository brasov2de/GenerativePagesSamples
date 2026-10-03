// ---------------- Type Definitions which can be imported from ./RuntimeTypes -------------------------
export interface TableRegistrations extends BaseTableRegistrations {
    "cr7a1_milestone": cr7a1_milestone,
    "cr7a1_project": cr7a1_project,
}
export interface EnumRegistrations extends BaseEnumRegistrations {
    "cr7a1_milestone-cr7a1_iscompleted": cr7a1_milestone_cr7a1_iscompleted,
    "cr7a1_milestone-statecode": cr7a1_milestone_statecode,
    "cr7a1_milestone-statuscode": cr7a1_milestone_statuscode,
    "cr7a1_project-new_category": cr7a1_project_new_category,
    "cr7a1_project-statecode": cr7a1_project_statecode,
    "cr7a1_project-statuscode": cr7a1_project_statuscode,
}
export type cr7a1_milestone = TableRow<{
    // Primary Key Column
    readonly cr7a1_milestoneid: string,
    cr7a1_description: string,
    cr7a1_duedate: Date,
    cr7a1_iscompleted: cr7a1_milestone_cr7a1_iscompleted,
    cr7a1_milestonename: string,
    // Foreign Key Column
    _cr7a1_project_value: `/cr7a1_project(${string})`,
    readonly cr7a1_projectname: string,
    readonly createdbyname: string,
    readonly createdbyyominame: string,
    readonly createdonbehalfbyname: string,
    readonly createdonbehalfbyyominame: string,
    readonly modifiedbyname: string,
    readonly modifiedbyyominame: string,
    readonly modifiedonbehalfbyname: string,
    readonly modifiedonbehalfbyyominame: string,
    readonly owningbusinessunitname: string,
    statecode: cr7a1_milestone_statecode,
    statuscode: cr7a1_milestone_statuscode,
}>

export type cr7a1_project = TableRow<{
    // Primary Key Column
    readonly cr7a1_projectid: string,
    cr7a1_description: string,
    cr7a1_enddate: Date,
    cr7a1_imageurl: string,
    // Foreign Key Column
    readonly _cr7a1_projectmanager_value: `/cr7a1_user(${string})`,
    readonly cr7a1_projectmanagername: string,
    cr7a1_projectname: string,
    cr7a1_startdate: Date,
    readonly createdbyname: string,
    readonly createdbyyominame: string,
    readonly createdonbehalfbyname: string,
    readonly createdonbehalfbyyominame: string,
    readonly modifiedbyname: string,
    readonly modifiedbyyominame: string,
    readonly modifiedonbehalfbyname: string,
    readonly modifiedonbehalfbyyominame: string,
    new_category: cr7a1_project_new_category,
    new_expectedrevenue: number,
    readonly new_magiccolumn: string,
    readonly new_magiccolumn_promptcolumndetails: string,
    readonly new_magiccolumn_promptcolumnstatus: number,
    readonly owningbusinessunitname: string,
    statecode: cr7a1_project_statecode,
    statuscode: cr7a1_project_statuscode,
}>

const enum cr7a1_milestone_cr7a1_iscompleted {
"No" = 0,
"Yes" = 1,
}
const enum cr7a1_milestone_statecode {
"Active" = 0,
"Inactive" = 1,
}
const enum cr7a1_milestone_statuscode {
"Active" = 1,
"Inactive" = 2,
}
const enum cr7a1_project_new_category {
"Internal" = 100000000,
"Invest" = 100000001,
"Standard" = 100000002,
"Absence" = 100000003,
}
const enum cr7a1_project_statecode {
"Active" = 0,
"Inactive" = 1,
}
const enum cr7a1_project_statuscode {
"Active" = 1,
"Inactive" = 2,
}

export interface UxAgentDataApi extends BaseUxAgentDataApi<TableRegistrations, EnumRegistrations> {}

export interface GeneratedComponentProps {
    dataApi: UxAgentDataApi;
}

