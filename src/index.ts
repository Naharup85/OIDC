import http from 'node:http';
import dotenv from ''


const main=async ()=>{
    const server=http.createServer();


    server.listen()
}


main()
.catch((error)=>{
    console.log("unable to start server ,errors",error)
})