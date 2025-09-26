const KV_KEY = "tod-state";
const DEFAULT_STATE = {
  tasks: [],
  tags: ["Work", "Personal"],
  priorities: ["Low", "Medium", "High"],
  theme: "light",
  filterByTags: [],
};

const VALID_STATUSES = new Set(["To-Do", "In Progress", "Done"]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const corsHeaders = createCorsHeaders(request.headers.get("Origin"));

    if (url.pathname === "/api/tod/state") {
      if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: corsHeaders });
      }

      if (request.method === "GET") {
        const stored = await env.TOD_KV.get(KV_KEY, "json");
        const state = normalizeState(stored);
        return Response.json(state, { headers: corsHeaders });
      }

      if (request.method === "PUT") {
        let payload;
        try {
          payload = await request.json();
        } catch {
          return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const nextState = normalizeState(payload);
        await env.TOD_KV.put(KV_KEY, JSON.stringify(nextState));
        return new Response(null, { status: 204, headers: corsHeaders });
      }

      return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
    }

    return new Response(null, { status: 404, headers: corsHeaders });
  },
};

function createCorsHeaders(origin) {
  const allowOrigin = origin ?? "*";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET,PUT,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function normalizeState(input) {
  const base = structuredClone(DEFAULT_STATE);
  if (!input || typeof input !== "object") {
    return base;
  }

  const maybe = input;

  if (Array.isArray(maybe.tags)) {
    base.tags = sanitizeStringArray(maybe.tags, 20, 10, DEFAULT_STATE.tags);
  }

  if (Array.isArray(maybe.priorities)) {
    base.priorities = sanitizeStringArray(maybe.priorities, 20, 6, DEFAULT_STATE.priorities);
  }

  if (typeof maybe.theme === "string") {
    base.theme = maybe.theme === "dark" ? "dark" : "light";
  }

  if (Array.isArray(maybe.filterByTags)) {
    const allowedTags = new Set(base.tags);
    base.filterByTags = sanitizeStringArray(maybe.filterByTags, 20, 10, []).filter((tag) => allowedTags.has(tag));
  }

  if (Array.isArray(maybe.tasks)) {
    base.tasks = maybe.tasks
      .map(sanitizeTask)
      .filter((task) => task !== null);
  }

  return base;
}

function sanitizeTask(value) {
  if (!value || typeof value !== "object") {
    return null;
  }

  const raw = value;
  const title = coerceTrimmedString(raw.title, 100);
  if (!title) {
    return null;
  }

  const id = Number(raw.id);
  if (!Number.isFinite(id)) {
    return null;
  }

  const status = typeof raw.status === "string" && VALID_STATUSES.has(raw.status) ? raw.status : "To-Do";
  const priority = coerceTrimmedString(raw.priority, 20) ?? "Medium";
  const description = coerceTrimmedString(raw.description, 500) ?? "";
  const tags = sanitizeStringArray(raw.tags, 20, 10, []);

  const deadline = typeof raw.deadline === "string" && raw.deadline.length <= 30 ? raw.deadline : null;
  const createdAt = typeof raw.createdAt === "string" && raw.createdAt.length <= 30 ? raw.createdAt : new Date().toISOString();

  return {
    id,
    title,
    status,
    priority,
    description,
    tags,
    deadline,
    createdAt,
  };
}

function sanitizeStringArray(value, maxLength, maxItems, fallback) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const result = [];
  for (const entry of value) {
    if (result.length >= maxItems) {
      break;
    }
    const text = coerceTrimmedString(entry, maxLength);
    if (text && !result.includes(text)) {
      result.push(text);
    }
  }
  return result.length ? result : fallback;
}

function coerceTrimmedString(value, limit) {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  return trimmed.length > limit ? trimmed.slice(0, limit) : trimmed;
}