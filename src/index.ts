import * as Server from "./server";
import * as Database from "./database";
import * as Configs from "./configurations";

//console.log(`Running enviroment ${process.env.NODE_ENV || "dev"}`);

// Catch unhandling unexpected exceptions
process.on('uncaughtException', (error: Error) => {
    console.error(`uncaughtException ${error.message}`);
});

// Catch unhandling rejected promises
process.on('unhandledRejection', (reason: any) => {
    console.error(`unhandledRejection ${reason}`);
});

// Init Database
const dbConfigs = Configs.getDatabaseConfig();
const database = Database.init(dbConfigs);

// Init DatabasePg
//const databasepg = DatabasePg.init(dbConfigs);
// console.log(dbConfigs);
// Starting Application Server
const serverConfigs = Configs.getServerConfigs();


Server.init(serverConfigs, database).then((server) => {
    server.start(() => {
        console.log(`server running at: ${server.info.uri} env ${process.env.NODE_ENV}`);
    });
});