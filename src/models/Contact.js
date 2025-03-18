import { Schema, model } from "mongoose";


const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    phoneNumber: {
        type: String,
    },
    email: {
        type: String,
    },
    isFavourite: {
        type: Boolean,
        default: false,
    },
    contactType: {
         type: String,
        enum: ["work", "home", "personal"],
         required: [true, "default"],
    },
}, { versionKey: false, timestamps: true });

contactSchema.post("save", function (doc) {
  console.log("Contact has been saved: ", doc);
});

contactSchema.pre("findOneAndUpdate", function (next) {
  console.log("About to update contact:", this);
    next();
});
    
contactSchema.post("findOneAndUpdate", function (doc) {
  console.log("Contact has been updated: ", doc);
});

const Contact = model("contact", contactSchema);

export default Contact;