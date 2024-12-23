const WebSocket = require("ws");

const clients = new Set(); // Создаем хранилище подключенных клиентов

const server = new WebSocket.Server({port: 3000}); // Создаем сервер на порту 3000

server.on("connection", connection => {
    try {
        console.log("Новое подключение");
        clients.add(connection);

        // Отправка приветственного сообщение
        connection.send(JSON.stringify({
            type: "system",
            text: "Добро пожаловать в чат!",
        }));

        // Обработка входящих сообщений от клиента
        connection.on("message", message => {
            try {
                const data = JSON.parse(message);
                console.log(`Сообщение от ${data.username}: ${data.text}`);
                clients.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({
                            type: "message",
                            username: data.username,
                            text: data.text,
                        }));
                    }
                });
            } catch (err) {
                console.error("Ошибка обработки сообщения: ", err);
            }
        });

        //Обработка отключения клиента
        connection.on("close", () => {
            try {
                console.log("Клиент отключился");
                clients.delete(connection);
            } catch (err) {
                console.error(`Ошибка обработки данных: ${err}`);
            }
        });
    } catch (err) {
        console.error(`Ошибка подключения: ${err}`);
    }
});

console.log("Сервер запущен на порту: 3000");

