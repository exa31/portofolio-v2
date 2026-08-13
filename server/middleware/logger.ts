import { randomUUID } from "node:crypto";

export default defineEventHandler((event) => {
  // Generate a new request ID and attach to context
  event.context.reqId = randomUUID();
});
