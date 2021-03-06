Сервер работает на порту [http://localhost:8000]

### POST /users

Регистрация (создание) нового пользователя. Возвращает объект вида, 
```
{
    "_id": "6084480dff016243547d9b8f",
    "username": "user7",
    "token": "mYKDveswA8d1mNb0b016r",
    "__v": 0
}
```
для вновь созданного пользователя.

### POST /users/login

Выполняет процедуру логина пользователя. В случае несовпадения пользователя или пароля возвращается ошибка 
400 Wrong username or password. В случае успешного логина возвращает объект вида, 
```
{"token": "5enDI2paOqusPavVWOnwB"}
```
содержащий новый сессионный токен пользователя


### Аутентификация и авторизация (процедура)

Проверяет наличие заголовка token и если не находит возвращает 401 No token presented. 
Далее ищет по значению token пользователя и если не находит возвращает 401 Wrong token: unauthorized.


### POST /trackHistory

Создает документ в коллекции истории прослушивания композиции. 
Далее производится процедура аутенетификации и авторизации, см. "Аутентификация и авторизация". 
При создании документа коллекции используется _id найденного пользователя.



### GET /trackHistory

Запрос на получение коллекции историй прослушивания с добавленной информацией по трекам и пользователям. 
Далее производится процедура аутенетификации и авторизации, см. "Аутентификация и авторизация". 
По найденному по заголовку token _id пользователя возвращается массив объектов вида

```
    {
        "_id": "60841e2343401c441cbe5697",
        "user": {
            "_id": "6083fc2840f53831b03b4d3e",
            "username": "user2"
        },
        "track": {
            "_id": "607c1081bdf2d84564ec34b2",
            "name": "Dogs of war",
            "album": "607c06317520a94498462d8b",
            "duration": "04:55"
        },
        "datetime": "2021-04-24T13:33:23.906Z",
        "__v": 0
    }
```
для данного пользователя


### Альбомы



### GET /albums

Запрос на получение всех документов из коллекции альбомов в случае отсутствия строки запроса. 
Возвращает массив объектов вида

```
    {
        "_id": "607c06317520a94498462d8b",
        "name": "A Momentary Lapse of Reason",
        "year": "1987",
        "artist": "607c0224d981e4073ce23e28",
        "image": "n4eNH4_b4J5kpU-bf6UUW.jpg",
        "__v": 0
    },

```
Если строка запроса содержит ?artist=value, возвращает массив альбомов для заданного исполнителя. 
Если исполнителя с именем value не существует возвращает 404 No such artist

### POST /albums

Создает документ в коллекции альбомов. 

### GET /albums/:id
Получает документ из коллекции альбомов по заданному id альбома

### PUT /albums/:id
Обновляет документ в коллекции альбомов по заданному id альбома

### DELETE /albums/:id
Удаляет документ из коллекции альбомов по заданному id альбома


### Исполнители
То же что и альбомы с учетом /artists. См. раздел "Альбомы"

### Треки
То же что и альбомы с учетом /tracks. См. раздел "Альбомы"

Исключение

### GET /tracks/:artist

Запрос на получение всех треков соотв. заданному в параметре запроса исполнителю. 
Запрос содержит связанную информацию по альбомам и испольнителям и возвращает массив объектов вида

```
    {
        "_id": "607c0cf9bdf2d84564ec34b0",
        "name": "Learning To Fly",
        "album": {
            "_id": "607c06317520a94498462d8b",
            "name": "A Momentary Lapse of Reason",
            "year": "1987",
            "artist": {
                "_id": "607c0224d981e4073ce23e28",
                "name": "Pink Floyd",
                "info": "Rock band",
                "image": "quB5G58ZGWN0pbVq17VKb.jpg",
                "__v": 0
            },
            "image": "n4eNH4_b4J5kpU-bf6UUW.jpg",
            "__v": 0
        },
        "duration": "04:25",
        "image": "rnIKYIULHg42pr5C1QtX-.jpg",
        "__v": 0
    },

```


