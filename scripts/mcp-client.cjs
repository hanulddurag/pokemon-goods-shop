const fs = require('fs');
const path = require('path');

const TOKEN_FILE = path.join(process.env.USERPROFILE || process.env.HOME, '.gemini', 'antigravity-cli', 'mcp_oauth_tokens.json');
const PROJECT_ID = 'rcqaonpsdvnwlmcpqpzg';
const MCP_ENDPOINT = 'https://mcp.supabase.com/mcp?features=docs%2Caccount%2Cdatabase%2Cdebugging%2Cdevelopment%2Cfunctions%2Cbranching%2Cfeedback%2Cnotebooks';

function getAccessToken() {
  if (!fs.existsSync(TOKEN_FILE)) {
    throw new Error('MCP token file not found at ' + TOKEN_FILE);
  }
  const tokenData = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8'));
  const entry = Object.values(tokenData)[0];
  if (!entry || !entry.token || !entry.token.access_token) {
    throw new Error('No valid token found in ' + TOKEN_FILE);
  }
  return entry.token.access_token;
}

async function callMcpTool(toolName, args = {}) {
  const token = getAccessToken();
  const headers = {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json',
    'Accept': 'application/json, text/event-stream'
  };

  const initRes = await fetch(MCP_ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'antigravity', version: '1.0' } }
    })
  });

  if (!initRes.ok) {
    throw new Error(`MCP Init failed with status ${initRes.status}: ${await initRes.text()}`);
  }

  const sessionId = initRes.headers.get('mcp-session-id');

  await fetch(MCP_ENDPOINT, {
    method: 'POST',
    headers: { ...headers, 'Mcp-Session-Id': sessionId },
    body: JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' })
  });

  const res = await fetch(MCP_ENDPOINT, {
    method: 'POST',
    headers: { ...headers, 'Mcp-Session-Id': sessionId },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: { project_id: PROJECT_ID, ...args }
      }
    })
  });

  const responseJson = await res.json();
  if (responseJson.error) {
    throw new Error(`MCP error: ${JSON.stringify(responseJson.error)}`);
  }

  const content = responseJson.result?.content?.[0]?.text;
  if (content) {
    try {
      return JSON.parse(content);
    } catch {
      return content;
    }
  }
  return responseJson.result;
}

module.exports = {
  callMcpTool,
  PROJECT_ID,
  getAccessToken
};
