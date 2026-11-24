# Debug a generative page with a local override

This walkthrough uses a model-driven app's running environment and a locally edited
generative page. An override affects only your browser; it does not publish the
page. Use a development environment: the page can still read and change real
Dataverse data under your user permissions.

## Find the page ID

In the model-driven app designer, select the generative page in the pages list.
Copy the GUID in the **Generative page** field of its properties pane. This is
the page ID, not the app ID or a Dataverse record ID.

Alternatively, authenticate with the [Power Platform CLI](https://learn.microsoft.com/en-us/power-platform/developer/cli/introduction),
select the right environment, and list the app's pages:

```powershell
pac model list
pac model genpage list --app-id "<app-id>" --environment "https://<org>.crm.dynamics.com"
```

Find the page by name and copy its **Page ID**. Add `--include-unpublished` if
you need to find a draft. The checked-in `Dialog\Page` example has page ID
`04b846d6-183f-400e-a302-a5c168b46a92`; use your own ID for your environment.
The [CLI reference](https://learn.microsoft.com/en-us/power-platform/developer/cli/reference/model#pac-model-genpage-list)
describes the commands and options.

## Prepare local JavaScript

Download the page if you do not already have its source:

```powershell
pac model genpage download --app-id "<app-id>" --page-id "<page-id>" --environment "https://<org>.crm.dynamics.com" --output-directory ".\pages"
```

The download creates `pages\<page-id>\page.tsx`, `page.js`, `RuntimeTypes.ts`,
and `config.json`. Edit `page.tsx`, then transpile it to JavaScript. Supply the
page's comma-separated Dataverse table names from `config.json` when it uses
data sources:

```powershell
pac model genpage transpile --code-file ".\pages\<page-id>\page.tsx" --data-sources "<table1>,<table2>" --environment "https://<org>.crm.dynamics.com" --output-file ".\pages\<page-id>\page.debug.js"
```

Omit `--data-sources` if the page has none. Repeat transpilation after each TSX
change; an autoresponder cannot execute TSX directly. The downloaded `page.js`
is a starting point, but it does not automatically track edits to `page.tsx`.

## Find and override the response

The exact request and response format can vary with the runtime. Do not assume
the page ID is a JavaScript filename or that every response is a raw script.

1. Open the published app in Edge or Chrome and open DevTools (**F12**). In
   **Application > Service Workers**, enable **Bypass for network**. In
   **Network**, enable recording and **Preserve log**, then reload and navigate
   to the specific page. For a dialog, open it again.
2. Search the network requests for the page ID. If it is not in the URL, inspect
   relevant Fetch/XHR responses and search for a distinctive string from the
   page's code. Confirm the response belongs to the intended page and contains
   its executable JavaScript, rather than a table-data request or shared runtime
   bundle. Note the request URL and the response's content type and structure.
3. If the response is raw page JavaScript, create a response override for that
   specific URL and use the contents of `page.debug.js`. For example, in
   **Network**, right-click the request and choose **Override content**, select
   an overrides folder and allow access, then replace the saved response in
   **Sources > Overrides** with the compiled JavaScript. Save it.
4. If the JavaScript is inside a JSON response, preserve the complete response
   and replace only the observed code string with the compiled JavaScript,
   properly JSON-escaped. Do not replace the entire JSON response with a `.js`
   file. If you cannot identify the code field or preserve the response format,
   stop rather than overriding an unrelated request.
5. Reload or reopen the page with DevTools open. Confirm the request is marked as
   overridden, inspect its response for your local change, and set a breakpoint
   in the executed JavaScript under **Sources**. Trigger the relevant action.
   A distinctive temporary UI change or log message can also confirm which
   version ran. Debug the generated JavaScript unless a working source map is
   available.

The same principle applies to an autoresponder extension such as Resource
Override: match the observed URL narrowly and serve a local response in the
same format as the original. Extension permissions and local-file support vary;
use an extension only if you trust it with the app's traffic. Browser DevTools
local overrides are an alternative that does not require an extension.

## Troubleshooting and cleanup

- If no request matches, clear Network filters, bypass the service worker,
  reload, and reopen the page. A different host or cached response may be used.
- If the page fails to load, disable the override and compare the original
  response's structure and content type with the replacement. Check the Console
  for errors. DevTools overrides may not support every response type.
- If changes do not appear, save the override, recompile the TSX, update the
  override with the new output, and verify the overridden response. Confirm the
  breakpoint is in the code actually executed.
- Disable or remove the override when finished and reload to restore the
  published page. Keep desired changes in the source and use the normal
  `pac model genpage upload` workflow to publish them; test again with overrides
  disabled.

See Microsoft's [page ID instructions](https://learn.microsoft.com/en-us/power-apps/developer/model-driven-apps/clientapi/navigate-to-generative-page-examples#find-the-page-id)
and [local override guidance](https://learn.microsoft.com/en-us/power-apps/developer/model-driven-apps/debug-javascript-webresources).
The latter describes web resources; the generative page's response must be
identified and checked separately as described above.
