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
        usernameSpan.textContent = data.username + ": ";

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
