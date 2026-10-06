import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function login(req,res){
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({message:"No email or password"});
    }

    //znajdz user po email
    //spradz czy konto jest aktywne
    //porownaj haslo (bcrypt.compare)
    //generuj jwt token
    //
};


export async function register(req, res){
    try {
        const {name, email, password} = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({error: "Please add all fields"});
        }

        //czy user istnieje już?
        const userExists = await User.findOne({email});

        if (userExists) {
            return res.status(400).json({error: "User already exists with that email"});
        }

        //hashowanie hasła
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //stworz usera
        const user = await User.create({name, email, password: hashedPassword});

        //wygeneruj token jwt
        const token = jwt.sign(
            { id: user._id, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );

        res.status(201).json({
            token
        })

    } catch (error) {
        console.log("Error in register controller: ", error);
        res.status(500).json({
            message:"Internal server error"
        });
    }
};