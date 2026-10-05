const express = require('express');
const app = express();
const port = 3000;

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.get('/', (req, res) => {
    res.send('Hello, студент!');
});

app.get('/api/dishes', (req, res) => {
    res.json([
        { id: 1, name: 'Борщ', category: 'Первые блюда', price: 250 },
        { id: 2, name: 'Плов', category: 'Вторые блюда', price: 350 },
        { id: 3, name: 'Цезарь', category: 'Салаты', price: 280 },
        { id: 4, name: 'Тирамису', category: 'Десерты', price: 220 }
    ]);
});

app.get('/api/menus', (req, res) => {
    res.json([
        { id: 1, name: 'Обеденное меню', dishesCount: 12 },
        { id: 2, name: 'Вечернее меню', dishesCount: 18 },
        { id: 3, name: 'Детское меню', dishesCount: 8 }
    ]);
});

app.get('/api/dishes/:id', (req, res) => {
    res.json({
        requestedId: Number(req.params.id),
        status: 'success'
    });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});

//app.use((req, res, next) => { 
  //  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    //next();
//});