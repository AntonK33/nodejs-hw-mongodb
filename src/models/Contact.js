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
        enum: ("work", "home", "personal"),
         required: "default"
    },
}, { versionKey: false, timestamps: true });

contactSchema.post("save");

contactSchema.pre("findOneAndUpdate");
contactSchema.post("findOneAndUpdate");

const Contact = model("contact", contactSchema);

export default Contact;