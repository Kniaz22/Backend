
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());


// Хранение ресторанов в памяти
let restaurants = [
    {
        id: 1,
        name: 'Италия',
        cuisine: 'Итальянская',
        address: 'ул. Ленина, 10',
        rating: 4.5
    },
    {
        id: 2,
        name: 'Сакура',
        cuisine: 'Японская',
        address: 'ул. Мира, 15',
        rating: 4.8
    },
    {
        id: 3,
        name: 'Восток',
        cuisine: 'Узбекская',
        address: 'ул. Центральная, 5',
        rating: 4.2
    }
];

let nextId = 4;

// Проверка данных ресторана
function validateRestaurant(data) {
    const { name, cuisine, address, rating } = data;

    if (
        typeof name !== 'string' || !name.trim() ||
        typeof cuisine !== 'string' || !cuisine.trim() ||
        typeof address !== 'string' || !address.trim()
    ) {
        return 'Поля name, cuisine и address обязательны и должны быть строками';
    }

    if (
        typeof rating !== 'number' ||
        !Number.isFinite(rating) ||
        rating < 0 || rating > 5
    ) {
        return 'Рейтинг должен быть числом от 0 до 5';
    }

    return null;
}

// GET — список, поиск, сортировка, пагинация
app.get('/restaurants', (req, res) => {
    const { search, sort, order = 'asc', page = '1', limit = '10' } = req.query;

    if (
        (search !== undefined && typeof search !== 'string') ||
        (sort !== undefined &&
            (!['id', 'name', 'cuisine', 'address', 'rating'].includes(sort))) ||
        !['asc', 'desc'].includes(order) ||
        !/^[1-9]\d*$/.test(String(page)) ||
        !/^[1-9]\d*$/.test(String(limit)) ||
        !Number.isSafeInteger(Number(page)) ||
        !Number.isSafeInteger(Number(limit))
    ) {
        return res.status(400).json({ error: 'Некорректные параметры запроса' });
    }

    let result = [...restaurants];

    // Поиск по названию
    if (search !== undefined) {
        result = result.filter(r =>
            r.name.toLowerCase().includes(search.toLowerCase())
        );
    }

    // Сортировка
    if (sort) {
        result.sort((a, b) => {
            let comparison;

            if (typeof a[sort] === 'number') {
                comparison = a[sort] - b[sort];
            } else {
                comparison = a[sort].localeCompare(b[sort], 'ru');
            }

            return order === 'desc' ? -comparison : comparison;
        });
    }

    // Пагинация
    const total = result.length;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const start = (pageNumber - 1) * limitNumber;

    result = result.slice(start, start + limitNumber);

    res.json({
        total,
        page: pageNumber,
        limit: limitNumber,
        restaurants: result
    });
});

// GET — получить ресторан по ID
app.get('/restaurants/:id', (req, res) => {
    const id = Number(req.params.id);
    const restaurant = restaurants.find(r => r.id === id);

    if (!restaurant) {
        return res.status(404).json({ error: 'Ресторан не найден' });
    }

    res.json(restaurant);
});

// POST — создать ресторан
app.post('/restaurants', (req, res) => {
    const error = validateRestaurant(req.body);

    if (error) {
        return res.status(400).json({ error });
    }

    const newRestaurant = {
        id: nextId++,
        name: req.body.name.trim(),
        cuisine: req.body.cuisine.trim(),
        address: req.body.address.trim(),
        rating: req.body.rating
    };

    restaurants.push(newRestaurant);

    res.status(201).json(newRestaurant);
});

// PUT — полностью обновить ресторан
app.put('/restaurants/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = restaurants.findIndex(r => r.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Ресторан не найден' });
    }

    const error = validateRestaurant(req.body);

    if (error) {
        return res.status(400).json({ error });
    }

    restaurants[index] = {
        id,
        name: req.body.name.trim(),
        cuisine: req.body.cuisine.trim(),
        address: req.body.address.trim(),
        rating: req.body.rating
    };

    res.json(restaurants[index]);
});

// DELETE — удалить ресторан
app.delete('/restaurants/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = restaurants.findIndex(r => r.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Ресторан не найден' });
    }

    restaurants.splice(index, 1);

    res.status(204).send();
});

// Обработка неизвестных маршрутов
app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
