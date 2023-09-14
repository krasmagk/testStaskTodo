const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware для парсинга JSON в запросах
app.use(express.json());
var cors = require('cors')

app.use(cors()) // Use this after the variable declaration
// Секретный ключ для создания и проверки JWT токенов
const secretKey = 'yourSecretKey';

// JSON-файл для хранения пользователей и задач (todo)
const dbFile = 'db.json';

// Создаем или обновляем JSON-файл для хранения данных
function saveData(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

// Проверка наличия пользователя в базе данных
function findUser(email) {
  const data = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
  const user = data.users.find((user) => user.email === email);
  
  if (user) {
    user.id = data.users.indexOf(user);
  }

  return user;
}

// Роутер для регистрации новых пользователей
app.post('/register', (req, res) => {
  const { email, password } = req.body;
console.log(12321321312);
  if (!email || !password) {
    return res.status(400).json({ message: 'Введите имя пользователя и пароль' });
  }

  const data = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));

  if (findUser(email)) {
    return res.status(400).json({ message: 'Пользователь с таким именем уже существует' });
  }

  const newUser = { email, password };
  data.users.push(newUser);

  saveData(data);

  res.json({ message: 'Пользователь успешно зарегистрирован' });
});

// Роутер для аутентификации и создания JWT токена
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Введите имя пользователя и пароль' });
  }

  const user = findUser(email);

  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Неправильное имя пользователя или пароль' });
  }

  // Создаем JWT токен
  const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });

  res.json({ message: 'Аутентификация успешна', token });
});

// Middleware для проверки JWT токена
function authenticateToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Необходимо предоставить токен аутентификации' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Недействительный токен' });
    }

    req.user = user;
    next();
  });
}

// Роутер для операций с todo листом
app.use('/todo', authenticateToken);

// Получение списка задач
app.get('/todo', (req, res) => {
  const data = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
  const user = findUser(req.user.email);

  res.json(user.todoList || []);
});

// Добавление новой задачи
app.post('/todo', (req, res) => {
  const { task, close } = req.body;
  const data = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
  const user = findUser(req.user.email);
  console.log(user);
  if (!user.todoList) {
    user.todoList = [];
    console.log('todo list created');
  }

  user.todoList.push({ task, close});
  data.users[user.id] = user
  saveData(data);

  res.json({ message: 'Задача успешно добавлена' });
});

// Обновление задачи по индексу
app.put('/todo/:index', (req, res) => {
  const { index } = req.params;
  const { task,close  } = req.body;
  const data = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
  const user = findUser(req.user.email);

  if (!user.todoList || index < 0 || index >= user.todoList.length) {
    return res.status(404).json({ message: 'Задача не найдена' });
  }

  user.todoList[index] = { task, close };
  data.users[user.id] = user
  saveData(data);

  res.json({ message: 'Задача успешно обновлена' });
});

// Удаление задачи по индексу
app.delete('/todo/:index', (req, res) => {
  const { index } = req.params;
  const data = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
  const user = findUser(req.user.email);

  if (!user.todoList || index < 0 || index >= user.todoList.length) {
    return res.status(404).json({ message: 'Задача не найдена' });
  }

  user.todoList.splice(index, 1);
  data.users[user.id] = user
  saveData(data);

  res.json({ message: 'Задача успешно удалена' });
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
