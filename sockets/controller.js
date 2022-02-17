const { verifyJWT } = require("../helpers");
const { ChatMessages } = require("../models");

const chatMessages = new ChatMessages();

const socketController = async( socket, io ) => {
    
    // console.log("Client connected", socket.id );

   const user = await verifyJWT(socket.handshake.headers["x-token"]);

   if ( !user ) return socket.disconnect();

   // connect user
    chatMessages.connectUser( user );
    io.emit( "active-users", chatMessages.usersArr );
    socket.emit( "get-messages", chatMessages.last10 );

    // connect to special chat
    socket.join( user.id ); // global, socket.id, user.id

    // disconnect user
    socket.on("disconnect", () => {
        chatMessages.disconnectUser( user.id );
        io.emit( "active-users", chatMessages.usersArr );
    });
    
    socket.on("send-message", ({ uid, message }) => {

        if ( uid ) {

            // Private message
            socket.to( uid ).emit( "private-message",  { from: user.name, message });

        } else {
            
            // send to everybody
            chatMessages.sendMessage( user.id, user.name, message );
            io.emit( "get-messages", chatMessages.last10 );

        };
        

    });

}


module.exports = {
    socketController
};
