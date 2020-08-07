//third party packages
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

//configs
import { dbConfig } from '../configs/db.config';
import { serverConfig } from '../configs/server.config';

//routes
import { userRoutes } from '../routes/user.routes';
import { publicRoutes } from '../routes/public.routes';


const app: any = express();

//////////// ----- MIDDLEWARE ----- /////////////
//Frontend - Backend compatibility:
app.use(cors());

//Parsing requests of content-type: application/json:
app.use(express.json());

//Parsing requests of content-type: urlencoded:
app.use(express.urlencoded({ extended: true }));

/////////////////////////////////////////////////

//Database connection initialization:
mongoose.connect(`mongodb://${dbConfig.HOST}: ${dbConfig.PORT}/${dbConfig.DBNAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log(`Sucessfuly connected to database ${dbConfig.DBNAME}`));

////////////// ------- ROUTES ------ //////////////
//Routes for user pages:
app.use('/api/user', userRoutes);

//Routes for public pages:
app.use('/api/public', publicRoutes);

///////////////////////////////////////////////////

//start listening on server's port
app.listen(serverConfig.PORT, () => console.log(`Server started on port ${serverConfig.PORT}`));


