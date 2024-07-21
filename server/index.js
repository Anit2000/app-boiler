import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
const mode = process.env.NODE_ENV;
const PORT = 8081;

const createServer = async(root = process.cwd()) =>{
  const app = express();

  app.use(express.json());

  if(mode == 'dev'){
    const vite = await createViteServer({
      root: path.resolve(process.cwd(),"client"),
      server:{
        middlewareMode:true,
        hmr:{
          server: app.listen(PORT,()=>{
            console.log('Developmenet server is running on PORT', PORT)
          })
        }
      }
    });
    app.use(vite.middlewares);
    app.use("*",async (req,res) =>{
      const url = req.originalUrl;
      let template = fs.readFileSync(
        path.resolve(process.cwd(),"client","index.html"),"utf-8"
      );
      template = await vite.transformIndexHtml(url,template);
      res.status(200).set({"Content-Type":"text/html"}).end(template)
    })
  }
}
createServer();
