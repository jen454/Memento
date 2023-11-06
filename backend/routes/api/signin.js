// const express = require("express");
// const User = require("../../models/User"); // User model 불러오기
// const router = express.Router(); // express의 Router 사용
// const bcrypt = require("bcryptjs"); // 암호화 모듈

// router.post('/', async (req, res) => {
//     const { id, password } = req.body;

//     // 요청된 아이디를 db에서 찾는다.
//     try {
//         const user = await User.findOne({ id });
//         if (!user) {
//             return res.status(404).json({
//                 loginSuccess: false,
//                 message: "Unvalid id"
//             });
//         }
//         // 요청된 아이디가 db에 있다면 비밀번호 일치여부 확인
//         user.comparePassword(password, (err, isMatch) => {
//             if (err) {
//                 console.error(err.message);
//                 return res.status(500).send("Server Error");
//             }
//             if (!isMatch)
//                 return res.status(400).json({
//                     loginSuccess: false,
//                     message: "Wrong password"
//                 });
//             // 일치 시, 토큰 생성
//             user.generateToken((err, user) => {
//                 if (err) {
//                     console.error(err.message);
//                     return res.status(400).send("Server Error");
//                 }
//                 // 토큰을 쿠키에 저장
//                 res.cookie("x_auth", user.token)
//                     .status(200)
//                     .json({
//                         loginSuccess: true,
//                         userId: user._id
//                     });
//             });
//         });
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).send("Server Error");
//     }
// });

// module.exports = router; // export