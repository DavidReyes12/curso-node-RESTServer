
let user = null;
let socket = null;

//HTML Reference
const txtUid = document.querySelector("#txtUid");
const txtMessage = document.querySelector("#txtMessage");
const ulUsers = document.querySelector("#ulUsers");
const ulMessages = document.querySelector("#ulMessages");
const btnOut = document.querySelector("#btnOut");

// validate localStorage token 
const validateJWT = async() => {
    
    const token = localStorage.getItem("token") || "";

    if ( token.length <= 10 ) {
        window.location = "index.html";
        throw new Error("There is not token in the server");
    };

    const resp = await fetch("http://localhost:8080/api/auth/", {
        headers: { "x-token": token },
    });

    const { user: userDB, token: tokenDB } = await resp.json();
    localStorage.setItem( "token", tokenDB );
    user = userDB;
    document.title = user.name

    await connectSocket();

};

const connectSocket = async() => {

    socket = io({
        "extraHeaders": {
            "x-token": localStorage.getItem("token"),
        }
    });

    socket.on("connect", () => {
        console.log("Sockets online")
    })

    socket.on("disconnect", () => {
        console.log("Sockets offline")
    })
    
    socket.on("get-messages", mapMessages );

    socket.on("active-users", mapUsers );

    socket.on("private-message", (payload) => {
        console.log("privado", payload) 
    });

};

const mapUsers = ( users = [] ) => {
    
    let usersHtml = "";
    users.forEach( ({ name, uid }) => {

        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success">${ name }</h5>
                    <span clss="fs-6 text-muted"> ${ uid } </span>
                </p>
            </li>
        `;

    });

    ulUsers.innerHTML = usersHtml;

};

const mapMessages = ( messages = [] ) => {
    
    let messagesHtml = "";
    messages.forEach( ({ name, message }) => {

        messagesHtml += `
            <li>
                <p>
                    <span class="text-primary">${ name }</span>
                    <span> ${ message } </span>
                </p>
            </li>
        `;

    });

    ulMessages.innerHTML = messagesHtml;

};

txtMessage.addEventListener("keyup", ({ keyCode }) => {
    
    const message = txtMessage.value;
    const uid     = txtUid.value;

    if ( keyCode !== 13 ) return;
    if ( message.length === 0 ) return;

    socket.emit( "send-message", { message, uid } );

    txtMessage.value = "";

});


const main = async() => {
    
    await validateJWT();

};

main();


