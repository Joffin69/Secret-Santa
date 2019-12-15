const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require("../model/user");

exports.userSignUp = (req, res, next) => {
  bcrypt.hash(req.body.password, 10). then(hash => {
    const user = new User ({
      empId: req.body.empId,
      name: req.body.name,
      password: hash
    });
    user.save()
    .then(result => {
      res.status(201).json({
        message: 'Hey Santa... You are signed in.. :)',
        user: result
      })
    })
    .catch(error => {
      console.log(error);
      res.status(404).json({
        message: 'Sign In failed ! :( .. Please enter valid credentials !'
      })
    })
  })
}

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({empId: req.body.empId})
  .then(user => {
    if (!user) {
      return res.status(404).json({
        message: 'Invalid authentication credentials.. Please enter valid credentials.. !'
      })
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password);
  })
  .then(result => {
    if(!result) {
      return res.status(404).json({
        message: 'Invalid authentication credentials.. Please enter valid credentials.. !'
      })
    }
    const token = jwt.sign({name: fetchedUser.name, id: fetchedUser._id},
      process.env.JWT_KEY,
      {expiresIn: '1h'});
    res.status(200).json({
      message: 'Login was successful !',
      token: token,
      expiresIn: 3600,
      user : fetchedUser
    })
  })
  .catch(err => {
    console.log(err);
    res.status(404).json({
      message: "Invalid authentication credentials! Please try again !"
    });
  });
}

exports.getUser = (req, res, next) => {
  let santa;
  User.findOne({empId: +req.params.id},{password:0,_id:0})
  .then(user => {
    santa = user;
    if(user.angel) {
      return User.findOne({name: user.angel},{empId:1})
    }
    return res.status(200).json({
      message: 'We got your details Santa... :)',
      santaData: user
    })
  })
  .then(angel => {
    if(angel.empId) {
      res.status(200).json({
        message: 'We got your details Santa... :)',
        santaData: santa,
        angelId: angel.empId
      })
    }
  })
  .catch(error => {
    res.status(404).json({
      message: 'Sorry Santa... Your details could not retrieved successfully :( .. Please login and try again !'
    })
  })
}

exports.getUsers = (req, res, next) => {
  User.find({ empId : {$ne : +req.params.id}, "santa": { "$exists": false }}, {empId:1,name:1})
  .then(userData => {
    res.status(200).json({
      message: 'User data retrieved successfully !',
      userData: userData
    });
  })
  .catch(err => {
    res.status(404).json({
      message: "Sorry Santa... There was some technical error... Could you please login again !"
    })
  })
}

exports.setAngel = (req, res, next) => {
  let empId = req.body.empId;
  let name = req.body.name;
  let firstUser;
  User.findOneAndUpdate({empId: empId},{angel: name},{new: true})
  .then(user => {
    firstUser = user;
    return User.findOneAndUpdate({name: firstUser.angel},{santa: firstUser.name},{new: true});
  })
  .then( user => {
    if(user.santa) {
      return res.status(200).json({
        message: 'Angel has been assigned successfully',
        userData: firstUser,
        angelId: user.empId
      })
    }
    res.status(404).json({
      message: 'Sorry Santa... We could not assign you an angel... :( Could you please try again  !'
    })
  })
  .catch(error => {
    console.log(error);
    res.status(404).json({
      message: 'Assignment unsuccessfull !',
      result: user
    })
  })
}

