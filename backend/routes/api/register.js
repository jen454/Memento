const express = require("express");
const User = require("../../models/User"); // User model 불러오기
const router = express.Router(); // express의 Router 사용
const bcrypt = require("bcryptjs"); // 암호화 모듈

// @route  POST api/register
// @desc   Register user
// @access Public
router.post("/", async (req, res) => {
  // req의 body 정보를 사용하려면 server.js에서 따로 설정을 해줘야함
  const { name, email, id, password } = req.body;

  try {
    // email, id, name을 비교하여 중복 확인
    let user = await User.findOne({ $or: [{ email }, { id }, { name }] });
    if (user) {
      const duplicateFields = [];
      if (user.email === email) duplicateFields.push("이메일");
      if (user.id === id) duplicateFields.push("아이디");
      if (user.name === name) duplicateFields.push("이름");

      return res
        .status(400)
        .json({ errors: [{ msg: `${duplicateFields.join(", ")}이(가) 이미 존재합니다.` }] });
    }

    // user에 name, email, password 값 할당
    user = new User({
      name,
      email,
      id,
      password,
    });

    // password를 암호화 하기
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save(); // db에 user 저장

    res.send("Success");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router; // export