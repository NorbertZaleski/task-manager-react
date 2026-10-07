import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function login(req,res){
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({message:"No email or password"});
        }

        //znajdz user po email
        const user = await User.findOne({email});

        if (!user) {
            return res.status(400).json({message:"Invalid credentials"});
        }

        //porownaj haslo (bcrypt.compare) i generuj jwt token
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            })
        } else {
            res.status(400).json({error:"Invalid credentials"})
        }

    } catch (error) {
        console.log("Error in login controller: ", error);
        res.status(500).json({
            message:"Internal server error"
        });
    }
};


export async function register(req, res){
    try {
        const {name, email, password} = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({message: "Please add all fields"});
        }

        //czy user istnieje już?
        const userExists = await User.findOne({email});

        if (userExists) {
            return res.status(400).json({message: "User already exists with that email"});
        }

        //hashowanie hasła
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //stworz usera
        const user = await User.create({name, email, password: hashedPassword});

        //wygeneruj token jwt
        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            })
        }

    } catch (error) {
        console.log("Error in register controller: ", error);
        res.status(500).json({
            message:"Internal server error"
        });
    }
};

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
}