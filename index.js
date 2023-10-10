const cookieParser = require('cookie-parser')
const express = require ('express')
const bodyParser = require('body-parser')

const jsonParser = bodyParser.json()

require('dotenv').config()
const app = express()

//regular middleware 
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(jsonParser)

//cookie middleware
app.use(cookieParser())


const userRouter = require('./routes/userroutes')
const twilioRouter = require('./routes/phoneauthroutes')
const msgRouter = require('./routes/msgroutes')



app.use('/api', userRouter)
app.use('/api', twilioRouter);
app.use('/api', msgRouter);


app.get('/', (req, res) => {
    res.send("helloooohii")
})

app.listen(3000, () => {
    console.log('server is running on port 3000');
})