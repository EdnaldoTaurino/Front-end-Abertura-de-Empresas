import jsonServer from "json-server";
import path from "path";

const server = jsonServer.create();
const router = jsonServer.router(path.join(process.cwd(), "src/mocks/db.json"));
const middlewares = jsonServer.defaults();

server.use(middlewares);
// faz com que /api/qualquer-coisa seja mapeado para /qualquer-coisa no router
server.use(jsonServer.rewriter({ "/api/*": "/$1" }));
server.use(router);

export default (req, res) =>
  new Promise((resolve, reject) => {
    server(req, res, (err) => (err ? reject(err) : resolve()));
  });
