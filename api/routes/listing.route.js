import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createListing,
  deleteListing,
  getListing,
  getListings,
  updateListing,
} from "../controllers/listing.controller.js";
const router = express.Router();

router.get("/get", getListings);
router.get("/get/:id", getListing);
router.post("/create", verifyToken, createListing);
router.delete("/delete/:id", verifyToken, deleteListing);
router.post("/update/:id", verifyToken, updateListing);


export default router;
