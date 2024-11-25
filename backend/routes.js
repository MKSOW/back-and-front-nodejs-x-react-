const express = require('express');
const router = express.Router();
const userRoutes = require('./routes/userRoutes')
const productRoutes = require('./routes/productRoutes')
const orderRoutes = require('./routes/orderRoutes')
const categorieRoutes = require('./routes/categorieRoute')
const messageRoute = require('./routes/messageRoute')




router.get('/',(req, res) => {
    res.send('welcome to the API');
});

router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/categorie',categorieRoutes);
router.use('/message',messageRoute)
module.exports = router;