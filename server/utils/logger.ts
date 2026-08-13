import { pino } from "pino";

const baseLogger = pino({
  level: process.env.LOG_LEVEL || "info",
});

export const logger = new Proxy(baseLogger, {
  get(target, prop, receiver) {
    const original = Reflect.get(target, prop, receiver);
    if (
      typeof original === "function" &&
      ["info", "error", "warn", "debug", "fatal", "trace"].includes(
        prop as string,
      )
    ) {
      return (...args: any[]) => {
        try {
          const event = useEvent();
          if (event && event.context.reqId) {
            if (typeof args[0] === "object") {
              args[0] = { reqId: event.context.reqId, ...args[0] };
            } else if (typeof args[0] === "string") {
              args.unshift({ reqId: event.context.reqId });
            }
          }
        } catch {
          // Not in a request context (e.g. background task, startup)
        }
        return original.apply(target, args);
      };
    }
    return original;
  },
});
