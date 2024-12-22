let username = "";
let ws;
const chatMessage = document.getElementById("chatMessage");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const usernameSubmit = document.getElementById("usernameSubmit");
const usernameInput = document.getElementById("usernameInput");
const modal = document.getElementById("usernameModal");

// Инициализация websocket сщудинения
const webSocketConnection = () => {
    try {
       ws = new WebSocket("ws://localhost:3000");

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                displayMessage(data);
            } catch (err) {
                console.error(`Ошибка получения данных: ${err}`);
            }
        };

        ws.onclose = () => {
            console.log("Соединение закрыто");
        }
    } catch (err) {
        console.error(`Ошибка подключения: ${err}`);
    }
};

// Вывод сщщбщения ы чат
const displayMessage = (data) => {
    const messageDiv = document.createElement("div");
    if (data.type === "system") {
        messageDiv.className = "message system-message";
        messageDiv.textContent = data.text;
    } else if (data.type === "message") {
        messageDiv.className = "message";
        const usernameSpan = document.createElement("span");
        usernameSpan.className = "username";
        usernameSpan.textContent = data.username;

        messageDiv.appendChild(usernameSpan);
        messageDiv.appendChild(document.createTextNode(data.text));
    }

    chatMessage.appendChild(messageDiv);
    chatMessage.scrollTop = chatMessage.scrollHeight;
}

// Отправка сообщения
const sendMessage = () => {
    const message = messageInput.value.trim();

    if (message && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            username: username,
            text: message,
        }));
        messageInput.value = "";
    }
};

// Обработка входа пользователя
const setUsername = () => {
    username = usernameInput.value.trim();
    if (username) {
        modal.style.display = "none";
        webSocketConnection();
    }
};

// Обработка событий
document.addEventListener("DOMContentLoaded", () => {
    sendButton.addEventListener("click", sendMessage);
    messageInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
    });

    usernameSubmit.addEventListener("click", setUsername);
    usernameInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") setUsername();
    })
})

// let username;
// let socket;
//
// const usernameModal = document.getElementById("modal");
// const usernameInput = document.getElementById("messageInput");
// const userSubmit = document.getElementById("submitButton");
// const chatMessage = document.getElementById("chatMessage");
// const messageInput = document.getElementById("messageInput");
// const messageSubmit = document.getElementById("submitMessage");
//
// const connectToServer = () => {
//     socket = new WebSocket(`ws://localhost:3000`);
//
//     socket.onopen = () => {
//         console.log("Подключение к серверу произведено")
//     };
//
//     socket.onmessage = (event) => {
//         const data = JSON.parse(event.data);
//         if(data.type === "system") {
//             chatMessage.innerHTML += `<div class="system">${data.text}</div>`;
//         } else if (data.type === "chat") {
//             chatMessage.innerHTML += `<div class="user"><strong>${data.username}:</strong>${data.text}</div>`;
//         }
//
//         chatMessage.scrollTop = chatMessage.scrollHeight;
//     };
//
//     socket.onclose = () => {
//         console.log("Соединение закрыто");
//     };
// }
//
// // Обработка ввода username
// const setUsername = () => {
//     let username = usernameInput.value.trim();
//     if (username) {
//         usernameModal.style.display = "none";
//         connectToServer();
//     } else {
//         username = "ananimus";
//         usernameModal.style.display = "none";
//         connectToServer();
//     }
// }
//
// userSubmit.addEventListener("click", () => {
//     setUsername();
// })
//
// usernameInput.addEventListener("keypress", (event) => {
//     if (event.key === "Enter") {
//         setUsername();
//     }
// });
//
// // Обработка отправки сообщения
// const sendMessage = () => {
//     const message = messageInput.value.trim();
//     if (message && socket && socket.readyState === WebSocket.OPEN) {
//         socket.send(JSON.stringify({
//             type: "message",
//             username,
//             text: message
//         }));
//         messageInput.value = "";
//     }
// };
//
// messageSubmit.addEventListener("click", () => {
//     sendMessage();
// });
//
// messageInput.addEventListener("keypress", (event) => {
//     if (event.key === "Enter") {
//         sendMessage();
//     }
// });