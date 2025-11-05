"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const child_process_1 = require("child_process");
const util_1 = require("util");
const zod_1 = require("zod");
const exec = (0, util_1.promisify)(child_process_1.exec);
// Initialize the MCP server with a name and version
const server = new mcp_js_1.McpServer({ name: 'workshops-de-angular-mcp', version: '1.0.0' });
server.registerTool('generate_component', {
    title: 'Generate Angular Component',
    description: 'Creates a new Angular component using the Angular CLI',
    inputSchema: {
        name: zod_1.z.string().describe('Component name'),
        path: zod_1.z.string().optional().describe('Target path or project')
    }
}, async ({ name, path }) => {
    // CLI is already in the project root, so we need to remove the src/app prefix
    path = path?.replace(/^src\/app\/?/, '');
    // Construct the CLI command
    const target = path ? `${path}/${name}` : name;
    const cliCommand = `npx @angular/cli generate component ${target} --standalone --flat --skip-tests --inline-style --inline-template --no-interactive`;
    try {
        // Execute from the project root (process.cwd() is the project root when running via npm)
        const result = await exec(cliCommand, { cwd: process.cwd() });
        return { content: [{ type: 'text', text: `✅ Component generated successfully:\n${result.stdout}` }] };
    }
    catch (error) {
        return {
            content: [{ type: 'text', text: `❌ CLI Error: ${error instanceof Error ? error.message : 'Unknown error'}` }]
        };
    }
});
// Start listening for MCP messages on STDIN/STDOUT
const transport = new stdio_js_1.StdioServerTransport();
server
    .connect(transport)
    .then(() => console.log('MCP server started'))
    .catch(error => console.error('Error connecting to MCP server:', error));
