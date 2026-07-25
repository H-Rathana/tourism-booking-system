import express from "express";

import {

    uploadGalleryImage,
    getGallery,
    deleteGallery

}
from "../controllers/tourGalleryController.js";

import {protect}
from "../middleware/authMiddleware.js";

import {isAdmin}
from "../middleware/roleMiddleware.js";

import { galleryUpload }
from "../utils/galleryUpload.js";

const router =
express.Router();

router.post(

    "/:tourId",

    protect,
    isAdmin,

    galleryUpload.single("image"),

    uploadGalleryImage

);

router.get(

    "/:tourId",

    getGallery

);

router.delete(

    "/:galleryId",

    protect,

    isAdmin,

    deleteGallery

);

export default router;