import jsonServer from "json-server";
import path from "path";

// cria uma instância do json-server
const server = jsonServer.create();
const router = jsonServer.router(path.join(process.cwd(), "src/mocks/db.json"));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

// exporta como handler do Vercel
export default (req, res) => {
  return new Promise((resolve, reject) => {
    server(req, res, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};
