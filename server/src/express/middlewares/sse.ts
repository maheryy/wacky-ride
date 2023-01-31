import { NextFunction, Request, Response } from "express";
import { ServerSentEvent } from "../../types/event";

const clients: Set<Response> = new Set();

const sse = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    res.initSSE = () => {
      res.writeHead(200, {
        "Cache-Control": "no-cache",
        "Content-Type": "text/event-stream",
        "Access-Control-Allow-Credentials": "true",
        Connection: "keep-alive",
      });
      clients.add(res);

      // Connection health check
      const keepAlive = setInterval(() => {
        res.write(":\n\n");
      }, 55000);

      res.on("close", () => {
        clearInterval(keepAlive);
        clients.delete(res);
        res.end();
      });
    };

    res.sendEvent = <T>(eventType: ServerSentEvent, data: T) => {
      const dataString =
        `data: ${JSON.stringify(data)}\n` + `event: ${eventType}\n\n`;

      for (const client of clients) {
        client.write(dataString);
      }
    };

    return next();
  };
};

export default sse;
