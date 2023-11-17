module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const ComponentSchema = new Schema(
    {
      fe_id: String,
      type: String,
      title: String,
      props: Object,
      isHidden: Boolean,
      isLocked: Boolean,
    }
  );

  const QuestionnaireSchema = new Schema(
    {
      userId: String,
      title: String,
      desc: String,
      js: String,
      css: String,
      isPublished: Boolean,
      isStar: Boolean,
      isDeleted: Boolean,
      answerCount: Number,
      componentList: [ ComponentSchema ],
    },
    { timestamps: true }
  );

  return mongoose.model('Questionnaire', QuestionnaireSchema);
};
