const mongoose = require("mongoose");

// Diary Schema 생성
const DiarySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// User ID로 일기 찾기
DiarySchema.statics.findByUserId = function (userId) {
  return this.find({ userId });
};

// 일기의 제목으로 찾기
DiarySchema.statics.findOneByTitle = function (title, cb) {
  return this.findOne({ title }, cb);
};

// model을 export 해주기
const Diary = mongoose.model("Diary", DiarySchema);
module.exports = Diary;
