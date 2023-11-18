module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const AnswerSchema = new Schema(
    {
      questionnaireId: String,
      answerList: [
        {
          componentId: String,
          value: String,
        },
      ],
    },
    { timestamps: true }
  );

  return mongoose.model('Answer', AnswerSchema);
};
