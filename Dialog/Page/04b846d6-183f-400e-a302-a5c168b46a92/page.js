// --- BEGIN GENERATED RUNTIME TYPES ---

var cr7a1_project_statecode;
(function (cr7a1_project_statecode) {
    cr7a1_project_statecode[cr7a1_project_statecode["Active"] = 0] = "Active";
    cr7a1_project_statecode[cr7a1_project_statecode["Inactive"] = 1] = "Inactive";
})(cr7a1_project_statecode || (cr7a1_project_statecode = {}));
var cr7a1_project_statuscode;
(function (cr7a1_project_statuscode) {
    cr7a1_project_statuscode[cr7a1_project_statuscode["Active"] = 1] = "Active";
    cr7a1_project_statuscode[cr7a1_project_statuscode["Inactive"] = 2] = "Inactive";
})(cr7a1_project_statuscode || (cr7a1_project_statuscode = {}));
var cr7a1_project_new_category;
(function (cr7a1_project_new_category) {
    cr7a1_project_new_category[cr7a1_project_new_category["Internal"] = 100000000] = "Internal";
    cr7a1_project_new_category[cr7a1_project_new_category["Invest"] = 100000001] = "Invest";
    cr7a1_project_new_category[cr7a1_project_new_category["Standard"] = 100000002] = "Standard";
    cr7a1_project_new_category[cr7a1_project_new_category["Absence"] = 100000003] = "Absence";
})(cr7a1_project_new_category || (cr7a1_project_new_category = {}));
var cr7a1_milestone_statecode;
(function (cr7a1_milestone_statecode) {
    cr7a1_milestone_statecode[cr7a1_milestone_statecode["Active"] = 0] = "Active";
    cr7a1_milestone_statecode[cr7a1_milestone_statecode["Inactive"] = 1] = "Inactive";
})(cr7a1_milestone_statecode || (cr7a1_milestone_statecode = {}));
var cr7a1_milestone_statuscode;
(function (cr7a1_milestone_statuscode) {
    cr7a1_milestone_statuscode[cr7a1_milestone_statuscode["Active"] = 1] = "Active";
    cr7a1_milestone_statuscode[cr7a1_milestone_statuscode["Inactive"] = 2] = "Inactive";
})(cr7a1_milestone_statuscode || (cr7a1_milestone_statuscode = {}));
var cr7a1_milestone_cr7a1_iscompleted;
(function (cr7a1_milestone_cr7a1_iscompleted) {
    cr7a1_milestone_cr7a1_iscompleted[cr7a1_milestone_cr7a1_iscompleted["No"] = 0] = "No";
    cr7a1_milestone_cr7a1_iscompleted[cr7a1_milestone_cr7a1_iscompleted["Yes"] = 1] = "Yes";
})(cr7a1_milestone_cr7a1_iscompleted || (cr7a1_milestone_cr7a1_iscompleted = {}));

// --- END GENERATED RUNTIME TYPES ---

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React, { useEffect, useMemo, useState } from "react";
import { Badge, Button, Input, Spinner, Text, makeStyles, shorthands, tokens, } from "@fluentui/react-components";
import { ChevronDownRegular, ChevronRightRegular, FlagRegular } from "@fluentui/react-icons";
var useStyles = makeStyles({
    page: __assign({ position: "relative", contain: "layout", display: "flex", flexDirection: "column", height: "100%", minHeight: "0", color: tokens.colorNeutralForeground1, backgroundColor: tokens.colorNeutralBackground1, boxSizing: "border-box" }, shorthands.overflow("hidden")),
    header: __assign(__assign(__assign({ display: "flex", alignItems: "center", flexWrap: "wrap" }, shorthands.gap(tokens.spacingHorizontalM)), shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalL)), { borderBottom: "1px solid ".concat(tokens.colorNeutralStroke2) }),
    heading: { flex: "1 1 14rem", minWidth: "0" },
    search: { flex: "2 1 14rem", minWidth: "10rem" },
    content: __assign(__assign({ display: "flex", flex: "1 1 auto", flexDirection: "column", minHeight: "0" }, shorthands.overflow("auto")), shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalL)),
    tree: __assign(__assign(__assign({ display: "flex", flexDirection: "column", listStyleType: "none" }, shorthands.gap(tokens.spacingVerticalS)), shorthands.padding(0)), shorthands.margin(0)),
    group: __assign(__assign(__assign({ display: "flex", flexDirection: "column", listStyleType: "none" }, shorthands.gap(tokens.spacingVerticalXS)), shorthands.padding(0)), shorthands.margin(0)),
    projectRow: __assign(__assign(__assign({ display: "flex", alignItems: "center", flexWrap: "wrap", minHeight: "3rem" }, shorthands.gap(tokens.spacingHorizontalS)), shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalM)), { borderRadius: tokens.borderRadiusMedium }),
    childList: __assign(__assign(__assign(__assign({ display: "flex", flexDirection: "column", listStyleType: "none" }, shorthands.gap(tokens.spacingVerticalXS)), shorthands.padding(0, 0, 0, tokens.spacingHorizontalL)), shorthands.margin(0, 0, 0, tokens.spacingHorizontalM)), { borderLeft: "1px solid ".concat(tokens.colorNeutralStroke2) }),
    milestoneRow: __assign(__assign(__assign({ display: "flex", alignItems: "center", flexWrap: "wrap", minHeight: "2.75rem" }, shorthands.gap(tokens.spacingHorizontalS)), shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalM)), { borderRadius: tokens.borderRadiusMedium, backgroundColor: tokens.colorNeutralBackground2 }),
    rowLabel: {
        display: "flex",
        flex: "0 1 auto",
        justifyContent: "flex-start",
        minWidth: "0",
        textAlign: "left",
    },
    milestoneIcon: {
        display: "inline-flex",
        alignItems: "center",
        flex: "0 0 auto",
        color: tokens.colorBrandForeground1,
    },
    expandButton: {
        width: "2rem",
        minWidth: "2rem",
    },
    expandSpacer: {
        display: "inline-block",
        width: "2rem",
        flex: "0 0 2rem",
    },
    details: __assign(__assign({ display: "flex", alignItems: "center", flexWrap: "wrap", marginInlineStart: "auto" }, shorthands.gap(tokens.spacingHorizontalS)), { color: tokens.colorNeutralForeground2 }),
    error: __assign(__assign({}, shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM)), { borderRadius: tokens.borderRadiusMedium, color: tokens.colorStatusDangerForeground1, backgroundColor: tokens.colorStatusDangerBackground1 }),
    empty: __assign(__assign({ display: "flex", justifyContent: "center" }, shorthands.padding(tokens.spacingVerticalXXL, tokens.spacingHorizontalM)), { color: tokens.colorNeutralForeground2 }),
    footer: __assign(__assign(__assign({ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }, shorthands.gap(tokens.spacingHorizontalM)), shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalL)), { borderTop: "1px solid ".concat(tokens.colorNeutralStroke2) }),
    selectionSummary: __assign(__assign({ flex: "1 1 14rem", display: "flex", flexWrap: "wrap" }, shorthands.gap(tokens.spacingHorizontalS)), { color: tokens.colorNeutralForeground2 }),
    actions: __assign({ display: "flex", flexWrap: "wrap" }, shorthands.gap(tokens.spacingHorizontalS)),
    spinner: __assign({ display: "flex", justifyContent: "center" }, shorthands.padding(tokens.spacingVerticalXXL)),
    milestoneMarker: {
        width: "0.55rem",
        height: "0.55rem",
        flex: "0 0 auto",
        borderRadius: tokens.borderRadiusCircular,
        backgroundColor: tokens.colorBrandForeground1,
    },
    projectMarker: {
        width: "0.75rem",
        height: "0.75rem",
        flex: "0 0 auto",
        borderRadius: tokens.borderRadiusSmall,
        backgroundColor: tokens.colorBrandBackground,
    },
});
function normalizeId(value) {
    var _a;
    if (!value)
        return undefined;
    var match = value.match(/\(([^)]+)\)/);
    var id = ((_a = match === null || match === void 0 ? void 0 : match[1]) !== null && _a !== void 0 ? _a : value).replace(/[{}]/g, "").toLowerCase();
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(id)
        ? id
        : undefined;
}
function lookupId(value) {
    if (typeof value !== "string")
        return undefined;
    return normalizeId(value);
}
function readDialogInput(pageInput) {
    var _a;
    var data = (_a = pageInput === null || pageInput === void 0 ? void 0 : pageInput.data) !== null && _a !== void 0 ? _a : {};
    var inputProjectId = typeof data.projectId === "string"
        ? data.projectId
        : (pageInput === null || pageInput === void 0 ? void 0 : pageInput.entityName) === "cr7a1_project"
            ? pageInput.recordId
            : undefined;
    var projectId = normalizeId(inputProjectId);
    return {
        projectId: projectId,
        invalidProjectId: !!inputProjectId && !projectId,
        dialogMode: data.isDialog === true,
    };
}
function queryAllProjects(dataApi) {
    return __awaiter(this, void 0, void 0, function () {
        var firstPage, projects, page;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dataApi.queryTable("cr7a1_project", {
                        select: ["cr7a1_projectid", "cr7a1_projectname", "cr7a1_description"],
                        orderBy: "cr7a1_projectname asc",
                        pageSize: 500,
                    })];
                case 1:
                    firstPage = _a.sent();
                    projects = __spreadArray([], firstPage.rows, true);
                    page = firstPage;
                    _a.label = 2;
                case 2:
                    if (!(page.hasMoreRows && page.loadMoreRows)) return [3 /*break*/, 4];
                    return [4 /*yield*/, page.loadMoreRows()];
                case 3:
                    page = _a.sent();
                    projects.push.apply(projects, page.rows);
                    return [3 /*break*/, 2];
                case 4: return [2 /*return*/, projects];
            }
        });
    });
}
function queryAllMilestones(dataApi) {
    return __awaiter(this, void 0, void 0, function () {
        var firstPage, milestones, page;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, dataApi.queryTable("cr7a1_milestone", {
                        select: [
                            "cr7a1_milestoneid",
                            "cr7a1_milestonename",
                            "cr7a1_description",
                            "cr7a1_duedate",
                            "cr7a1_iscompleted",
                            "_cr7a1_project_value",
                        ],
                        orderBy: "cr7a1_milestonename asc",
                        pageSize: 500,
                    })];
                case 1:
                    firstPage = _a.sent();
                    milestones = __spreadArray([], firstPage.rows, true);
                    page = firstPage;
                    _a.label = 2;
                case 2:
                    if (!(page.hasMoreRows && page.loadMoreRows)) return [3 /*break*/, 4];
                    return [4 /*yield*/, page.loadMoreRows()];
                case 3:
                    page = _a.sent();
                    milestones.push.apply(milestones, page.rows);
                    return [3 /*break*/, 2];
                case 4: return [2 /*return*/, milestones];
            }
        });
    });
}
function mapProjects(rows) {
    return rows.map(function (project) { return ({
        id: project.cr7a1_projectid,
        name: project.cr7a1_projectname || "Unnamed project",
        description: project.cr7a1_description || "",
    }); });
}
function filterProjects(projects, query, milestoneGroups) {
    if (!query)
        return projects;
    return projects.filter(function (project) {
        var _a;
        var matches = "".concat(project.name, " ").concat(project.description).toLocaleLowerCase().includes(query);
        var milestoneMatches = ((_a = milestoneGroups.get(project.id.toLowerCase())) !== null && _a !== void 0 ? _a : []).some(function (milestone) {
            var _a, _b;
            return "".concat((_a = milestone.cr7a1_milestonename) !== null && _a !== void 0 ? _a : "", " ").concat((_b = milestone.cr7a1_description) !== null && _b !== void 0 ? _b : "")
                .toLocaleLowerCase()
                .includes(query);
        });
        return matches || milestoneMatches;
    });
}
function makeProjectPickerRecord(project) {
    return {
        id: project.id,
        name: project.name,
        entityName: "cr7a1_project",
    };
}
function makeMilestonePickerRecord(milestone) {
    return {
        id: milestone.cr7a1_milestoneid,
        name: milestone.cr7a1_milestonename || "Unnamed milestone",
        entityName: "cr7a1_milestone",
    };
}
var GeneratedComponent = function (props) {
    var _a, _b;
    var styles = useStyles();
    var dataApi = props.dataApi, pageInput = props.pageInput;
    var _c = readDialogInput(pageInput), projectId = _c.projectId, invalidProjectId = _c.invalidProjectId, dialogMode = _c.dialogMode;
    var dataReady = !!dataApi;
    var cacheKey = "__genpage_ProjectMilestoneTree_".concat(projectId !== null && projectId !== void 0 ? projectId : "all", "_Cache");
    var inflightKey = "__genpage_ProjectMilestoneTree_".concat(projectId !== null && projectId !== void 0 ? projectId : "all", "_Inflight");
    var cached = window[cacheKey];
    var _d = useState(function () {
        var _a, _b;
        return ({
            projects: (_a = cached === null || cached === void 0 ? void 0 : cached.projects) !== null && _a !== void 0 ? _a : [],
            milestones: (_b = cached === null || cached === void 0 ? void 0 : cached.milestones) !== null && _b !== void 0 ? _b : [],
            loading: cached === undefined,
            error: null,
        });
    }), data = _d[0], setData = _d[1];
    var _e = useState(""), search = _e[0], setSearch = _e[1];
    var _f = useState({}), expandedProjects = _f[0], setExpandedProjects = _f[1];
    var _g = useState(dialogMode && projectId ? projectId : null), selectedProjectId = _g[0], setSelectedProjectId = _g[1];
    var _h = useState(null), selectedMilestoneId = _h[0], setSelectedMilestoneId = _h[1];
    var _j = useState(null), outputError = _j[0], setOutputError = _j[1];
    var _k = useState(null), milestoneFormError = _k[0], setMilestoneFormError = _k[1];
    var _l = useState(false), creatingMilestone = _l[0], setCreatingMilestone = _l[1];
    useEffect(function () {
        if (invalidProjectId) {
            setData({
                projects: [],
                milestones: [],
                loading: false,
                error: "The project input must be a valid Dataverse record ID.",
            });
            return;
        }
        if (!dataReady)
            return;
        var hit = window[cacheKey];
        if (hit) {
            if (data.projects !== hit.projects || data.milestones !== hit.milestones) {
                setData(__assign(__assign({}, hit), { loading: false, error: null }));
            }
            return;
        }
        var cancelled = false;
        var pending = window[inflightKey];
        if (!pending) {
            pending = Promise.all([
                queryAllProjects(dataApi),
                queryAllMilestones(dataApi),
            ])
                .then(function (_a) {
                var projects = _a[0], milestones = _a[1];
                var mappedProjects = mapProjects(projects);
                var scopedProjects = projectId
                    ? mappedProjects.filter(function (project) { return project.id.toLowerCase() === projectId; })
                    : mappedProjects;
                var projectIds = new Set(scopedProjects.map(function (project) { return project.id.toLowerCase(); }));
                var scopedMilestones = milestones.filter(function (milestone) {
                    var parentId = lookupId(milestone._cr7a1_project_value);
                    return parentId ? projectIds.has(parentId) : false;
                });
                var next = { projects: scopedProjects, milestones: scopedMilestones };
                window[cacheKey] = next;
                return next;
            })
                .finally(function () {
                if (window[inflightKey] === pending)
                    delete window[inflightKey];
            });
            window[inflightKey] = pending;
        }
        pending
            .then(function (next) {
            if (!cancelled) {
                setData(__assign(__assign({}, next), { loading: false, error: null }));
            }
        })
            .catch(function (error) {
            if (!cancelled) {
                console.error("Failed to load projects and milestones.", error);
                setData({
                    projects: [],
                    milestones: [],
                    loading: false,
                    error: "Projects and milestones could not be loaded. Check the data source permissions and try again.",
                });
            }
        });
        return function () {
            cancelled = true;
        };
        // dataApi changes identity between host renders; the readiness flag and shared
        // in-flight query prevent duplicate requests on the genpage host double-mount.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataReady, cacheKey, inflightKey, invalidProjectId, projectId]);
    var query = search.trim().toLocaleLowerCase();
    var milestoneGroups = useMemo(function () {
        var groups = new Map();
        data.milestones.forEach(function (milestone) {
            var _a;
            var parentId = lookupId(milestone._cr7a1_project_value);
            if (!parentId)
                return;
            var group = (_a = groups.get(parentId)) !== null && _a !== void 0 ? _a : [];
            group.push(milestone);
            groups.set(parentId, group);
        });
        return groups;
    }, [data.milestones]);
    var visibleProjects = useMemo(function () { return filterProjects(data.projects, query, milestoneGroups); }, [data.projects, milestoneGroups, query]);
    var matchingMilestones = function (project) {
        var _a;
        var milestones = (_a = milestoneGroups.get(project.id.toLowerCase())) !== null && _a !== void 0 ? _a : [];
        if (!query || "".concat(project.name, " ").concat(project.description).toLocaleLowerCase().includes(query)) {
            return milestones;
        }
        return milestones.filter(function (milestone) {
            var _a, _b;
            return "".concat((_a = milestone.cr7a1_milestonename) !== null && _a !== void 0 ? _a : "", " ").concat((_b = milestone.cr7a1_description) !== null && _b !== void 0 ? _b : "")
                .toLocaleLowerCase()
                .includes(query);
        });
    };
    var selectedMilestone = data.milestones.find(function (milestone) { return milestone.cr7a1_milestoneid === selectedMilestoneId; });
    var pickedProjectId = selectedMilestone
        ? lookupId(selectedMilestone._cr7a1_project_value)
        : selectedProjectId === null || selectedProjectId === void 0 ? void 0 : selectedProjectId.toLowerCase();
    var selectedProject = data.projects.find(function (project) { return project.id.toLowerCase() === pickedProjectId; });
    var isEmpty = !data.loading && !data.error && visibleProjects.length === 0;
    var handleCreateMilestone = function (project) { return __awaiter(void 0, void 0, void 0, function () {
        var error_1, milestones, projectIds_1, next, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setCreatingMilestone(true);
                    setMilestoneFormError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, window.Xrm.Navigation.navigateTo({
                            pageType: "entityrecord",
                            entityName: "cr7a1_milestone",
                            data: {
                                cr7a1_project: project.id,
                                cr7a1_projectname: project.name,
                                cr7a1_projecttype: "cr7a1_project",
                            },
                        }, { target: 2 })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Failed to open the new milestone form.", error_1);
                    setMilestoneFormError("The new milestone form could not be opened. Please try again.");
                    setCreatingMilestone(false);
                    return [2 /*return*/];
                case 4:
                    _a.trys.push([4, 6, 7, 8]);
                    return [4 /*yield*/, queryAllMilestones(dataApi)];
                case 5:
                    milestones = _a.sent();
                    projectIds_1 = new Set(data.projects.map(function (item) { return item.id.toLowerCase(); }));
                    next = {
                        projects: data.projects,
                        milestones: milestones.filter(function (milestone) {
                            var ownerId = lookupId(milestone._cr7a1_project_value);
                            return !!ownerId && projectIds_1.has(ownerId);
                        }),
                    };
                    window[cacheKey] = next;
                    setData(__assign(__assign({}, next), { loading: false, error: null }));
                    return [3 /*break*/, 8];
                case 6:
                    error_2 = _a.sent();
                    console.error("Failed to refresh milestones after closing the form.", error_2);
                    setMilestoneFormError("The form closed, but milestones could not be refreshed. Reload the page to see changes.");
                    return [3 /*break*/, 8];
                case 7:
                    setCreatingMilestone(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var handleReturn = function (cancelled) { return __awaiter(void 0, void 0, void 0, function () {
        var pageOutput, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    pageOutput = {
                        cancelled: cancelled,
                        project: !cancelled && selectedProject
                            ? makeProjectPickerRecord(selectedProject)
                            : null,
                        milestone: !cancelled && selectedMilestone
                            ? makeMilestonePickerRecord(selectedMilestone)
                            : null,
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    dataApi.setPageOutput(pageOutput);
                    setOutputError(null);
                    return [4 /*yield*/, window.Xrm.Navigation.navigateBack()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error("Failed to return the selection and close the dialog.", error_3);
                    setOutputError("The dialog could not be closed. Please try again.");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var renderProject = function (project) {
        var _a, _b;
        var expanded = expandedProjects[project.id] !== false;
        var milestones = matchingMilestones(project);
        var hasChildren = milestones.length > 0;
        return (React.createElement("li", { className: styles.group, key: project.id, role: "treeitem", "aria-level": 1, "aria-expanded": hasChildren ? expanded : undefined },
            React.createElement("div", { className: styles.projectRow, style: { backgroundColor: tokens.colorNeutralBackground3 } },
                hasChildren ? (React.createElement(Button, { className: styles.expandButton, appearance: "subtle", size: "small", "aria-label": "".concat(expanded ? "Collapse" : "Expand", " ").concat(project.name), "aria-expanded": expanded, onClick: function () {
                        return setExpandedProjects(function (current) {
                            var _a;
                            return (__assign(__assign({}, current), (_a = {}, _a[project.id] = !expanded, _a)));
                        });
                    } }, expanded ? React.createElement(ChevronDownRegular, null) : React.createElement(ChevronRightRegular, null))) : (React.createElement("span", { className: styles.expandSpacer, "aria-hidden": "true" })),
                React.createElement("span", { className: styles.projectMarker, "aria-hidden": "true" }),
                React.createElement(Button, { className: styles.rowLabel, appearance: selectedProjectId === project.id ? "primary" : "subtle", "aria-pressed": selectedProjectId === project.id, onClick: function () {
                        setSelectedMilestoneId(null);
                        setSelectedProjectId(function (current) {
                            return current === project.id ? null : project.id;
                        });
                    } }, project.name),
                React.createElement("span", { className: styles.details },
                    React.createElement(Badge, { appearance: "tint" }, (_b = (_a = milestoneGroups.get(project.id.toLowerCase())) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0,
                        " milestones"),
                    React.createElement(Button, { size: "small", appearance: "secondary", "aria-label": "New milestone for ".concat(project.name), disabled: creatingMilestone, onClick: function () { return handleCreateMilestone(project); } }, "New milestone"))),
            expanded && hasChildren && (React.createElement("ul", { className: styles.childList, role: "group" }, milestones.map(function (milestone) {
                var milestoneId = milestone.cr7a1_milestoneid;
                var dueDate = milestone.cr7a1_duedate
                    ? new Date(milestone.cr7a1_duedate).toLocaleDateString()
                    : null;
                var completed = milestone.cr7a1_iscompleted === 1 ? "Completed" : "Open";
                return (React.createElement("li", { className: styles.milestoneRow, key: milestoneId, role: "treeitem", "aria-level": 2, "aria-selected": selectedMilestoneId === milestoneId },
                    React.createElement(Button, { className: styles.rowLabel, icon: React.createElement("span", { className: styles.milestoneIcon, "aria-hidden": "true" },
                            React.createElement(FlagRegular, null)), appearance: selectedMilestoneId === milestoneId ? "primary" : "subtle", "aria-pressed": selectedMilestoneId === milestoneId, onClick: function () {
                            setSelectedProjectId(project.id);
                            setSelectedMilestoneId(function (current) {
                                return current === milestoneId ? null : milestoneId;
                            });
                        } }, milestone.cr7a1_milestonename || "Unnamed milestone"),
                    React.createElement("span", { className: styles.details },
                        React.createElement(Badge, { appearance: "outline" }, completed),
                        dueDate && React.createElement(Text, { size: 200 },
                            "Due ",
                            dueDate))));
            })))));
    };
    return (React.createElement("main", { className: styles.page },
        React.createElement("header", { className: styles.header },
            React.createElement("div", { className: styles.heading },
                React.createElement(Text, { as: "h1", size: 600, weight: "semibold" }, "Projects and milestones"),
                React.createElement(Text, { size: 200, block: true },
                    "Browse projects and their milestones.",
                    projectId ? " Showing this project and its milestones." : "")),
            React.createElement(Input, { className: styles.search, value: search, onChange: function (_, value) { return setSearch(value.value); }, placeholder: "Search projects and milestones", "aria-label": "Search projects and milestones", type: "search" })),
        milestoneFormError && (React.createElement(Text, { role: "alert", className: styles.error }, milestoneFormError)),
        data.loading ? (React.createElement("div", { className: styles.spinner },
            React.createElement(Spinner, { label: "Loading projects and milestones" }))) : data.error ? (React.createElement("div", { className: styles.content },
            React.createElement(Text, { role: "alert", className: styles.error }, data.error))) : (React.createElement("section", { className: styles.content, "aria-label": "Projects and milestones" }, isEmpty ? (React.createElement("div", { className: styles.empty },
            React.createElement(Text, null, projectId
                ? "No matching project or milestones were found."
                : search
                    ? "No projects or milestones match this search."
                    : "No projects are available."))) : (React.createElement("ul", { className: styles.tree, role: "tree", "aria-label": "Projects and milestones" }, visibleProjects.map(function (project) { return renderProject(project); }))))),
        dialogMode && (React.createElement("footer", { className: styles.footer },
            React.createElement("div", { className: styles.selectionSummary, "aria-live": "polite" },
                React.createElement(Text, null,
                    "Project: ", (_a = selectedProject === null || selectedProject === void 0 ? void 0 : selectedProject.name) !== null && _a !== void 0 ? _a : "None selected"),
                React.createElement(Text, null,
                    "Milestone: ", (_b = selectedMilestone === null || selectedMilestone === void 0 ? void 0 : selectedMilestone.cr7a1_milestonename) !== null && _b !== void 0 ? _b : "None selected"),
                outputError && React.createElement(Text, { role: "alert" }, outputError)),
            React.createElement("div", { className: styles.actions },
                React.createElement(Button, { appearance: "primary", onClick: function () { return handleReturn(false); } }, "OK"),
                React.createElement(Button, { appearance: "secondary", onClick: function () { return handleReturn(true); } }, "Cancel"))))));
};
export default GeneratedComponent;

