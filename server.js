require("dotenv").config();
const ws = require("ws");
const port = process.env.PORT || 3001;
const clients = new Set();

const wss = new ws.Server({port: port});

const messageDistribution = (message) => {
    clients.forEach(client => {
        const messageStr = JSON.stringify(message);
        if (client.readyState === ws.OPEN) {
            client.send(message);
            console.log(messageStr);
        }
    });
};

wss.on("connection", socket => {
    clients.add(socket);
    console.log("Новое подключение");

    // Отправка приветственного сообщения
    socket.send(JSON.stringify({
        type: "system",
        text: "Добро пожаловать в чат!"
    }));

    //Обработка сообщений от клиента
    socket.on("message", message => {
        const data = JSON.parse(message);
        if (data.type === "message") {
            console.log(`Сообщение от ${data.username}: ${data.text}`);
            messageDistribution({
                type: "message",
                username: data.username,
                text: data.text
            });
        }
        // else if (data.type === "system") {
        //     console.log(``)
        // }
    });
});

console.log(`Сервер запущен на http://127.0.0.1:${port}`)

