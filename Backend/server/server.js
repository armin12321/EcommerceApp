"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//third party packages
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var mongoose_1 = __importDefault(require("mongoose"));
var express_fileupload_1 = __importDefault(require("express-fileupload"));
var body_parser_1 = __importDefault(require("body-parser"));
//configs
var db_config_1 = require("../configs/db.config");
var server_config_1 = require("../configs/server.config");
//routes
var user_routes_1 = require("../routes/user.routes");
var public_routes_1 = require("../routes/public.routes");
var app = express_1.default();
//////////// ----- MIDDLEWARE ----- /////////////
//Frontend - Backend compatibility:
app.use(cors_1.default());
//Parsing requests of content-type: application/json:
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
// File Upload
app.use(express_fileupload_1.default());
//Parsing requests of content-type: urlencoded:
app.use(express_1.default.urlencoded({ extended: true }));
/////////////////////////////////////////////////
//Database connection initialization:
mongoose_1.default.connect("mongodb://" + db_config_1.dbConfig.HOST + ": " + db_config_1.dbConfig.PORT + "/" + db_config_1.dbConfig.DBNAME, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(function () { return console.log("Sucessfuly connected to database " + db_config_1.dbConfig.DBNAME); });
////////////// ------- ROUTES ------ //////////////
//Routes for user pages:
app.use('/api/user', user_routes_1.userRoutes);
//Routes for public pages:
app.use('/api/public', public_routes_1.publicRoutes);
///////////////////////////////////////////////////
//start listening on server's port
app.listen(server_config_1.serverConfig.PORT, function () { return console.log("Server started on port " + server_config_1.serverConfig.PORT); });
