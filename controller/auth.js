const bcrypt = require('bcrypt');
const UserModel = require('../model/UserModel');
const jwt = require("jsonwebtoken");
require("dotenv").config();

// signup route handler

exports.signup = async (req, res) => {
    try{
        // get data
        const {name, email, password, role} = req.body;
        // check if user already exists
        const existingUser = await UserModel.findOne({email});

        if(existingUser) {
            return res.status(400).json({
                success: false,
                message:"User already exists"
            });
        }

        // secure password
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch(error){
            return res.status(500).json({
                success: false,
                message:"Error hashing password"
            })
        }

        // create entry for user
        const user = await UserModel.create({
            name,
            email,
            password:hashedPassword,
            role
        })

        return res.status(200).json({
            success: true,
            message: "User created successfully"
        });

    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message:"User cannot be registered, please try again later"
        })
    }
}

// login route handler

exports.login = async (req, res) => {
    try{
        // get data
        const {email, password} = req.body;

        // validation on email and password
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message:"Please provide both email and password"
            });
        }

        // check if user registered
        let user = await UserModel.findOne({email});
        // if user is not registered
        if(!user){
            return res.status(401).json({
                success: false,
                message:"User not found"
            });
        }

        const payload = {
            email:user.email,
            id: user._id,
            role: user.role
        };

        // verify password and generate a JWT token
        if(await bcrypt.compare(password, user.password)){
            // password matches
            let token = jwt.sign(payload,
                                    process.env.JWT_SECRET,
                                    {
                                        expiresIn: '2h',
                                    });
            
            user = user.toObject();
            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 3 * 24 + 60 * 60 *1000 ),
                httpOnly:true,
            }

            res.cookie("rahulToken", token, options).status(200).json({
                success: true,
                message: "Logged in successfully",
                user, token
            })
            // res.status(200).json({
            //     success: true,
            //     message: "Logged in successfully",
            //     user, token
            // })
        }
        else{
            // password do not match
            return res.status(403).json({
                success: false,
                message:"Invalid password"
            });
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message:"Failed to login, please try again later"
        })
    }
}