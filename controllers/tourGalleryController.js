import * as galleryService
from "../services/tourGalleryService.js";

export const uploadGalleryImage =
async (req,res)=>{

    try{

        const {tourId}=req.params;

        if(!req.file){

            return res.status(400).json({
                message:"Image required"
            });

        }

        const gallery =
        await galleryService.createGalleryImage(

            tourId,
            req.file.filename

        );

        res.status(201).json(gallery);

    }catch(err){

        console.log(err);

        res.status(500).json({
            message:"Server Error"
        });

    }

};

export const getGallery =
async(req,res)=>{

    try{

        const gallery =
        await galleryService.getGalleryByTour(

            req.params.tourId

        );

        res.json(gallery);

    }catch(err){

        res.status(500).json({
            message:"Server Error"
        });

    }

};

export const deleteGallery =
async(req,res)=>{

    try{

        await galleryService.deleteGalleryImage(

            req.params.galleryId

        );

        res.json({
            message:"Deleted"
        });

    }catch(err){

        res.status(500).json({
            message:"Server Error"
        });

    }

};