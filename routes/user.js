const express  = require('express');
const router = express.Router();
const User = require("../model/UserModel");

const {login, signup} = require("../controller/auth");
const {auth, isStudent, isAdmin} = require("../middlewares/auth");

router.post("/login", login);
router.post("/signup", signup);

// testing protected routes for single middlewares

router.get("/test", auth, (req,res) =>{
    res.json({
        success: true,
        message:"Welcome to the protected route for TESTS",
    })
});

// protected routes
router.get("/student", auth, isStudent, (req,res) => {
    res.json({
        success: true,
        message:"Welcome to the protected route for STUDENTS",
    })
});

router.get("/admin", auth, isAdmin, (req,res) => {
    res.json({
        success:true,
        message:"Welcome to the protected route for ADMIN"
    })
});

router.get("/getEmail" , auth, async (req, res) => {
    try{
        const id = req.user.id;
        console.log("ID:", id);
        const user = await User.findById(id);

        res.status(200).json({
            success:true,
            user:user,
            message:"Welcome to the email route"
        })
    }

    catch(error){
        res.status(500).json({
            success:false,
            error:error.message,
            message:"Fatt gya code"
        })
    }
});


module.exports = router;