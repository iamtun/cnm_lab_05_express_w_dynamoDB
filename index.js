import express from 'express';

//constant
const PORT = process.env.PORT;


const app = express();


//register middlewares
app.use(express.json({extended: false}));
app.use(express.static('./views'));

//config view
app.set('view engine', 'ejs');
app.set('views', './views');

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})