const express = require("express");
const app = express();
const connectDB = require("./config/db");
const PORT = process.env.PORT || 5001;
const cors = require("cors");
const User = require("./models/User");
const cookieParser = require("cookie-parser");
const { auth } = require("./middleware/auth");
const Diary = require("./models/Diary");

app.use(
  cors({
    origin: true,
    credentials: true, //도메인이 다른경우 서로 쿠키등을 주고받을때 허용해준다고 한다
  })
);
// allow us to get the data in request.body
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("API RUNNING...");
});

app.use("/api/register", require("./routes/api/register")); // 회원가입 모듈화

app.post("/api/login", async (req, res) => {
  try {
    const user = await User.findOneById(req.body.id);

    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "존재하지 않는 아이디입니다.",
      });
    }

    const isMatch = await user.comparePassword(req.body.password);

    if (!isMatch) {
      return res.json({
        loginSuccess: false,
        message: "비밀번호가 일치하지 않습니다",
      });
    }

    user
      .generateToken() // 토큰 생성 및 사용자 객체에 저장
      .then((user) => {
        res
          .cookie("x_auth", user.token) // 쿠키 설정
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  } catch (error) {
    console.error("로그인 요청 중 오류:", error);
    res.status(500).json({ loginSuccess: false, error });
  }
});

//auth 미들웨어를 가져온다
//auth 미들웨어에서 필요한것 : Token을 찾아서 검증하기
app.get("/api/auth", auth, (req, res) => {
  if (req.error) {
    return res.status(401).json({ isAuth: false, error: req.error });
  }
  //auth 미들웨어를 통과한 상태 이므로
  //req.user에 user값을 넣어줬으므로
  res.status(200).json({
    _id: req._id,
    // isAdmin: req.user.name === null ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    id: req.user.id,
  });
});

app.get("/api/logout", auth, async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.user._id },
      { token: "" }
    );
    res.clearCookie("x_auth");
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.error("로그아웃 처리 중 에러:", err);
    return res.status(500).json({ success: false, err });
  }
});

app.get("/api/userinfo", auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    email: req.user.email,
    name: req.user.name,
    id: req.user.id,
  });
});

// 회원 조회
app.get("/api/all_users", async (req, res) => {
  try {
    const { keyword } = req.query;

    let query = {};
    if (keyword) {
      // 검색어가 있는 경우, 이름에 검색어가 포함된 유저를 조회
      query = { name: { $regex: keyword, $options: "i" } };
    }

    const users = await User.find({}, { _id: 0, name: 1 }); // 필요한 필드만 선택하여 조회 {} -> query
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "사용자 목록을 가져오지 못했습니다.", error });
  }
});

// 1. 일기 생성 API
app.post("/api/diary", auth, async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user._id;

  try {
    const newDiary = new Diary({
      title,
      content,
      userId,
    });

    const savedDiary = await newDiary.save();

    res.json(savedDiary);
  } catch (error) {
    console.error("일기 저장 중 오류:", error);
    res
      .status(500)
      .json({ message: "서버 오류로 인해 일기 저장에 실패했습니다." });
  }
});

// 2. 특정 사용자의 모든 일기 조회 API
app.get("/api/diaries/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const diaries = await Diary.findByUserId(userId);

    res.json(diaries);
  } catch (error) {
    console.error("일기 조회 중 오류:", error);
    res
      .status(500)
      .json({ message: "서버 오류로 인해 일기 조회에 실패했습니다." });
  }
});

// 3. 일기 제목으로 검색 API
app.get("/api/diaries/search/:title", async (req, res) => {
  const { title } = req.params;

  try {
    const diaries = await Diary.findOneByTitle(title);

    if (!diaries)
      return res.status(404).json({ message: "찾는 제목의 일지가 없습니다." });

    return res.json(diaries);
  } catch (error) {
    console.error("일지 검색 중 오류:", error);
    return res
      .status(500)
      .json({ message: "서버 오류로 인해 검색에 실패했습니다." });
  }
});

// 친구 추가 요청 처리
app.post("/api/add_friend_request", auth, async (req, res) => {
  try {
    const { friendName } = req.body;
    const currentUser = await User.findById(req.user._id);
    const friendToAdd = await User.findOne({ name: friendName });

    if (!friendToAdd) {
      return res
        .status(404)
        .json({ success: false, message: "친구를 찾을 수 없습니다." });
    }

    if (currentUser.friend_list.includes(friendToAdd._id)) {
      return res
        .status(400)
        .json({ success: false, message: "이미 친구입니다." });
    }

    // 친구 추가 요청 처리 로직
    const sender = currentUser._id; // 현재 로그인한 사용자의 _id
    const notificationMessage = `${currentUser.name}님이 친구 요청을 보냈습니다.`;

    // 해당 친구에게 알림 추가
    friendToAdd.notifications.push({ sender, message: notificationMessage });
    await friendToAdd.save();

    return res
      .status(200)
      .json({ success: true, message: "친구 추가 요청을 보냈습니다." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  }
});

// 친구 요청 수락 처리
app.post("/api/accept_friend_request", auth, async (req, res) => {
  try {
    const { sender } = req.body;
    const currentUser = await User.findById(req.user._id);
    const requesterUser = await User.findById(sender);

    console.log(currentUser._id);
    console.log(currentUser.name);
    console.log(requesterUser._id);
    console.log(requesterUser.name);

    if (!requesterUser) {
      return res
        .status(404)
        .json({ success: false, message: "요청한 유저를 찾을 수 없습니다." });
    }

    currentUser.friend_list.push({
      id: requesterUser._id,
      name: requesterUser.name,
    });

    requesterUser.friend_list.push({
      id: req.user._id,
      name: req.user.name,
    });

    // 알림 수락 처리 후 해당 알림 삭제
    currentUser.notifications = currentUser.notifications.filter(
      (notification) => notification.sender.toString() !== sender
    );

    await currentUser.save();
    await requesterUser.save();

    return res
      .status(200)
      .json({ success: true, message: "친구요청이 수락되었습니다." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  }
});

// 거절 후 알림 목록에서 삭제
app.post("/api/reject_friend_request", auth, async (req, res) => {
  try {
    const { sender } = req.body;
    const currentUser = await User.findById(req.user._id);

    // 알림 거절 처리 후 해당 알림 삭제
    currentUser.notifications = currentUser.notifications.filter(
      (notification) => notification.sender.toString() !== sender
    );
    await currentUser.save();

    return res
      .status(200)
      .json({ success: true, message: "친구요청이 거절되었습니다." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  }
});

// 알림 목록 가져오기
app.get("/api/notifications", auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    if (!currentUser) {
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    }

    const notifications = currentUser.notifications;
    res.status(200).json({ notifications });
  } catch (error) {
    console.error("알림 목록 가져오기 오류:", error);
    res.status(500).json({ error: "알림 목록을 가져올 수 없습니다." });
  }
});

// 친구 목록 보여주기
app.get("/api/my_friend_list_show", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    }

    res.status(200).json({ my_friend_list: user.friend_list });
    console.log(" == 친구목록 확인 완료 ^^ ==");
  } catch (error) {
    console.error("친구 목록 가져오기 오류:", error);
    res.status(500).json({ error: "친구 목록을 가져올 수 없습니다." });
  }
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
