import mongoose from "mongoose";

const mediaAssetSchema = new mongoose.Schema(
  {
    originalName: { type: String, required: true },
    fileName: { type: String, required: true, unique: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true },
    source: {
      type: String,
      enum: ["produto", "biblioteca"],
      default: "produto",
    },
    produtoId: { type: mongoose.Schema.Types.ObjectId, ref: "Produto" },
  },
  { timestamps: true },
);

const MediaAsset = mongoose.model("MediaAsset", mediaAssetSchema);
export default MediaAsset;
