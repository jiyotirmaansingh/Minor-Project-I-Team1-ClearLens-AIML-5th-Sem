const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {UserModel} = require("../models/users");


const signup = async(req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await UserModel.findOne({email});
        if(user){
            return res.status(409)
            .json({message: `User already exists`, success:false});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const userModel = new UserModel({ name, email, password: hashedPassword });
        await userModel.save();
        res.status(201)
            .json({message:`Signup succesfully !`, 
                success: true 
            });
    } catch (error) {
        res.status(500)
            .json({message:`Internal Server error ! ${error}`, 
                success: false 
            });
    }
}
const errorMsg = `Authentication failed email or password is wrong`;
const login = async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({email});
        if(!user){
            return res.status(403)
            .json({message: errorMsg , success:false});
        }
        const isPassEqual = await bcrypt.compare(password, user.password);
        if(!isPassEqual){
            return res.status(403)
            .json({message: errorMsg , success:false});
        }
        const jwtToken = jwt.sign(
            {email:user.email, _id: user._id},
            process.env.JWT_SECRET,
            {expiresIn:"24h"}            
        )
        res.status(200)
            .json({message:`Login success !`, 
                success: true,
                jwtToken,
                email,
                name: user.name 
            });
    } catch (error) {
        res.status(500)
            .json({message:`Internal Server error !`, 
                success: false 
            });
    }
}
module.exports = { signup, login };