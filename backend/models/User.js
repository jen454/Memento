const mongoose = require("mongoose"); // mongoose 불러오기
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;


// Schema 생성
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  id: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
  notifications: [
    {
      sender: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
      },
      message: {
        type: String,
      },
    },
  ],
  friend_list: [
    {
      id: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      name: {
        type: String,
      },
    },
  ],
});

UserSchema.statics.findOneById = function(id, cb) {
  return this.findOne({ id }, cb);
};

UserSchema.methods.comparePassword = function (plainPassword) {
  //plainPassword를 암호화해서 현재 비밀번호화 비교
  return bcrypt
    .compare(plainPassword, this.password)
    .then((isMatch) => isMatch)
    .catch((err) => err);
};

UserSchema.methods.generateToken = function () {
  let user = this;
  const token = jwt.sign(this._id.toHexString(), "secretToken");
  user.token = token;
  return user.save()
    .then((user) => user)
    .catch((err) => err);
};

UserSchema.statics.findByToken = function (token) {
  let user = this;
  //secretToken을 통해 user의 id값을 받아오고 해당 아이디를 통해
  //Db에 접근해서 유저의 정보를 가져온다
  return jwt.verify(token, "secretToken", function (err, decoded) {
    return user
      .findOne({ _id: decoded, token: token })
      .then((user) => user)
      .catch((err) => err);
  });
};

// model을 export 해주기
const User = mongoose.model("user", UserSchema);
module.exports = User;