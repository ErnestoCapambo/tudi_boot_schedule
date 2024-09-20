import { Express } from "express"
import express from "express"
import { Server as HttpServer, createServer } from "http";
import ManagerCron from '../Schedules/index'


export class App {
    public app: Express;
    private _port: number;
    public server: HttpServer;

    constructor() {
        this.app = express();
        this.server = createServer(this.app);
        this.middlewares();
        this._port = Number(process.env.PORT) || 3345;

    }

    middlewares() {
        this.app.use(express.json())
    }
    
    start() {
        this.server.listen(this._port, () => {

            console.log(`🚀 Server is running at port ${this._port}`)
            ManagerCron.run()
        })
    }
}