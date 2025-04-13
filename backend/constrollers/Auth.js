const prisma = require("./config/schema.prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
    try{
          const role = req.params
          if(role=="staff"){
            const {
                email,
                password,
                name,
                phone,
                role,
                station
            } = req.body;

            
            if ( !email || !password) {
                  return res.status(403).send({
                  success: false,
                  message: "All Fields are required",
                });
            }


            const existingUser = await prisma.Staff.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "User already exists. Please sign in to continue.",
                });
            }


     
          const hashedPassword = await bcrypt.hash(password, 10);

      
            const user = await prisma.Staff.create({
                email,
                password: hashedPassword,
                name,
                phone,
                role,
                station
            });

            return res.status(200).json({
                success: true,
                user,
                message: "User registered successfully",
            });
          }
          else{
                const {
                    email,
                    password,
                    name,
                    phone,
                    addresses,
                    orders
                } = req.body;

                
                if ( !email || !password) {
                    return res.status(403).send({
                    success: false,
                    message: "All Fields are required",
                    });
                }


                const existingUser = await prisma.User.findOne({ email });
                if (existingUser) {
                    return res.status(400).json({
                        success: false,
                        message: "User already exists. Please sign in to continue.",
                    });
                }


        
            const hashedPassword = await bcrypt.hash(password, 10);

        
                const user = await prisma.User.create({
                    email,
                    password: hashedPassword,
                    name,
                    phone,
                    addresses,
                    orders
                });

                return res.status(200).json({
                    success: true,
                    user,
                    message: "User registered successfully",
                });

          }
    }
    catch(error){
        res.send(error.message);
    }
}

exports.login = async (req, res) =>{
    try{
     
        const {email, password} = req.body;

        
        if(!email || !password){
            return res.status(403).json({
                success: false,
                message: "Enter all Feilds"
            })
        }

      
   
        const isuser = await prisma.User.findOne({email});
        const isSatff =  await prisma.Staff.findOne({email});

        if(!isuser && !isSatff){
            return res.status(403).json({
                success: false,
                message: "User is not registered, Please Signup first",
            })
        }
        const user = isSatff ? isSatff : isuser;
       
        if(await bcrypt.compare(password, user.password)){
           
            const payload = {
                email: user.email,
                id: user._id,
                role: isSatff ? "staff" : "customer"
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "24h",
            })
            user.password = undefined;
            
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly: true,
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "Logged in successfully",
            })
        }else{
            return res.status(403).json({
                success: false,
                message: "Password is incorrect",
            })
        }

      
       

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Log in failure, please try again"
        })
    }

}
