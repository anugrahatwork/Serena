let fetch: typeof globalThis.fetch;

if (typeof globalThis.fetch === "undefined") {
  // We're in Node.js, so use node-fetch
  fetch = require('node-fetch') as typeof globalThis.fetch;
} else {
  // Fetch is natively available in the browser or Node.js 18+
  fetch = globalThis.fetch;
}

export default fetch;
