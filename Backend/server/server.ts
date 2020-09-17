//third party packages
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';
//configs
import { dbConfig } from '../configs/db.config';
import { serverConfig } from '../configs/server.config';

//routes
import { userRoutes } from '../routes/user.routes';
import { publicRoutes } from '../routes/public.routes';
import { productRoutes } from '../routes/product.routes';
import { infoRoutes } from '../routes/info.routes';

//hand defined middlewares
import {authMiddleware} from '../middlewares/auth.middleware';
import { info } from 'console';


const app: any = express();

//////////// ----- MIDDLEWARE ----- /////////////
//allow certain headers to be able to get token from client:
app.use(authMiddleware.addHeaders);

//Frontend - Backend compatibility:
app.use(cors());

//Parsing requests of content-type: application/json:
app.use(express.json());

// File Upload
app.use(fileUpload());

//Parsing requests of content-type: urlencoded:
app.use(express.urlencoded({ extended: true }));

/////////////////////////////////////////////////

//Database connection initialization:
mongoose.connect(dbConfig.ATLASURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log(`Sucessfuly connected to ATLAS database`));

////////////// ------- ROUTES ------ //////////////
//Routes for user pages:
app.use('/api/user', userRoutes);

//Routes for public pages:
app.use('/api/public', publicRoutes);

// Routes for products 
app.use('/api/product', productRoutes);

// Routes for notifications
app.use('/api/info', infoRoutes);

///////////////////////////////////////////////////

//start listening on server's port
app.listen(serverConfig.PORT, () => console.log(`Server started on port ${serverConfig.PORT}`));


