import http from 'node:http';
import dotenv from 'dotenv';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

import { createServerApplication } from './app.js';

dotenv.config({path: '.env'});

const db = drizzle(process.env.DATABASE_URL as string);

const PORT=process.env.PORT || 8000;


const main=async ()=>{
    try {
        const server=http.createServer(createServerApplication());
    
    
        server.listen(PORT,()=>{
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        
    }
}


main()
