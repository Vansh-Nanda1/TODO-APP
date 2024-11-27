const { Schema, model } = require("mongoose");
const moment = require("moment");
const todoSchema = new Schema(
  {
    task: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    lastDate: {
      type: Date,
      // default : Date.now
      set: function (Date) {
        // Parse with fallback for 2-digit years (DD/MM/YY)
        return moment(
          Date,
          [
            "DD/MM/YYYY",
            "DD/MM/YY",
            "MM/DD/YYYY",
            "YYYY/DD/MM",
            "MM/DD/YY",
            "YY/DD/MM",
          ],
          true
        ).toDate();
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = model("Todo", todoSchema);
