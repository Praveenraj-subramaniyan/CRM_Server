const User = require("../Models/User");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();
mongoose.connect(process.env.MongoDb_Url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function CheckUser(emailIdLogin) {
  try {
    const user = await User.findOne({ email: emailIdLogin });
    if (user) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

async function AuthenticateUser(emailIdLogin, passwordLogin) {
  try {
    const userCheck = await User.findOne({ email: emailIdLogin });
    const validPassword = await bcrypt.compare(passwordLogin, userCheck.password );
    if (validPassword) {
      return userCheck;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}


  
 
module.exports = { CheckUser, AuthenticateUser };