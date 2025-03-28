import { Schema, model } from "mongoose";
import { handleSaveError, setUpdateSettings } from "./hooks.js";

const userSchema = new Schema({
    name: {
    type: String,
    required: true,
  },
    password: {
      type: String,
      required: true,
   
  },
  email: {
    type: String,
    required: true,
    unique: true,
     match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
  },
  // subscription: {
  //   type: String,
  //   enum: ["starter", "pro", "business"],
  //   default: "starter"
  // },
  
  // token: {
  //   type: String,
  //   default: null,
  // },
}, { versionKey: false, timestamps: true });

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};
userSchema.post("save", handleSaveError);
userSchema.pre("findOneAndUpdate", setUpdateSettings);
userSchema.post("findOneAndUpdate", handleSaveError);

 const User = model("user", userSchema);
export default User;