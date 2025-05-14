import jsonServer from "json-server";
import path from "path";

const server = jsonServer.create();
const router = jsonServer.router(path.join(process.cwd(), "db.json"));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.rewriter({ "/empresas/*": "/$1" }));
server.use(router);

export default (req, res) =>
  new Promise((resolve, reject) =>
    server(req, res, (err) => (err ? reject(err) : resolve()))
  );
