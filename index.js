import express from 'express';
import bodyParser from 'body-parser';
import {
    DynamoDBClient,
    PutItemCommand,
    ScanCommand,
} from '@aws-sdk/client-dynamodb';

// config AWS
const config = {
    region: process.env.REGION,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
};

const docClient = new DynamoDBClient({
    region: config.region,
    credentials: config,
});

//constant
const PORT = process.env.PORT;
const TABLE_NAME = process.env.TABLE_NAME;

const app = express();

//register middlewares
app.use(express.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./views'));

//config view
app.set('view engine', 'ejs');
app.set('views', './views');

//routers
app.get('/', (req, res) => {
    const command = new ScanCommand({
        TableName: TABLE_NAME,
    });

    docClient
        .send(command)
        .then(({ Items }) => {
            return res.render('index', { Items });
        })
        .catch((err) => console.log(err));
});

app.post('/items', async (req, res) => {
    const { name, count } = req.body;
    const command = new PutItemCommand({
        TableName: TABLE_NAME,
        Item: {
            id: { S: `${new Date().getTime()}` },
            name: { S: name },
            count: { N: `${count}` },
        },
    });

    try {
        await docClient.send(command);
        return res.redirect('/');
    } catch (err) {
        return console.log(err);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
