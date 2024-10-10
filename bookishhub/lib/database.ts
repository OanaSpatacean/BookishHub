import "server-only"
import { PrismaClient } from "@prisma/client";

declare global{
    var cachedDatabaseClient: PrismaClient;
}

export let databaseClient: PrismaClient;

if("production" !== process.env.NODE_ENV){
    if(global.cachedDatabaseClient){
        databaseClient = global.cachedDatabaseClient;
    }
    else{
        global.cachedDatabaseClient = new PrismaClient();
    }
}
else{
    databaseClient = new PrismaClient();
}
