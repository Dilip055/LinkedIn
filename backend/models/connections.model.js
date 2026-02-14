import mongoose from "mongoose";

const connectionSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  connectionId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  status_accepted: {
    type: Boolean,
    default: null,
  },
});


const connectionRequest = mongoose.model("ConnectionRequest", connectionSchema);


export default connectionRequest;
