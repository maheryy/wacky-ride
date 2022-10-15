import { Request, Response, NextFunction } from "express";

let clients: Set<Response> = new Set();

const sse = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    res.initSSE = () => {
      res.writeHead(200, {
        "Cache-Control": "no-cache",
        "Content-Type": "text/event-stream",
        "Connection": "keep-alive",
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

    res.sendEvent = (eventType: string, data: object) => {
      const dataString =
        `data: ${JSON.stringify(data)}\n` + `event: ${eventType}\n\n`;

      for (let client of clients) {
        client.write(dataString);
      }
    };

    return next();
  };
};

export default sse;
