"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const models_1 = require("./models");
const Schema_zod_1 = require("./Schema.zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const dbConnect_1 = require("./dbConnect");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post('/api/v1/sign-up', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = Schema_zod_1.signUpSchema.safeParse(req.body);
    if (!result.success || !result) {
        res.status(500).json({
            message: "sign up failed",
            error: "validation error: " + result.error
        });
        return;
    }
    const { username, password } = result.data;
    try {
        const existingUser = yield models_1.UserModel.findOne({
            username: username
        });
        if (existingUser) {
            res.status(401).json({
                message: "User already exists"
            });
            return;
        }
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
        return;
    }
    try {
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = new models_1.UserModel({
            username: username,
            password: hashedPassword,
            publicKey: "",
            privateKey: ""
        });
        yield user.save();
        res.json({
            message: "User signed up successfully"
        });
    }
    catch (error) {
        res.status(400).json({
            message: "Failed to sign up"
        });
    }
}));
app.post('/api/v1/sign-in', (req, res) => {
    const result = Schema_zod_1.signUpSchema;
    res.json({
        message: "User signed in successfully"
    });
});
app.post('/api/v1/txn/sign', (req, res) => {
    const { username, password } = req.body;
    res.json({
        message: "User signed in successfully"
    });
});
app.get('/api/v1/txn', (req, res) => {
    const { username, password } = req.body;
    res.json({
        message: "User signed in successfully"
    });
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("connecting to the database....");
        yield (0, dbConnect_1.dbConnect)();
        app.listen(3000, () => {
            console.log("server listening on port 3000..");
        });
    });
}
main();
