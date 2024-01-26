const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    phone_number: { type: Number, required: true },
    priority: { type: Number, required: true, enum: [0, 1, 2], default: 2 },
    password: {
      type: String,
      requried: true,
    },
  },

  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = async function (pwd) {
  return await bcrypt.compare(pwd, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
