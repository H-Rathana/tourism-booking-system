import * as wishlistService
from "../services/wishlistService.js";

// Add
export const addWishlist =
async (req,res) => {

  try {

    
    const userId =
        req.user.id;

    const { tour_id } =
      req.body;

    const wishlist =
      await wishlistService
      .addToWishlist(
        userId,
        tour_id
      );

    res.status(201).json(
      wishlist
    );

  } catch(error){

    res.status(500).json({
      message:error.message
    });

  }

};

// Get
export const getWishlist =
async (req,res) => {

  try {

    const userId =
        req.user.id;

    const wishlist =
      await wishlistService
      .getWishlist(userId);

    res.json(wishlist);

  } catch(error){

    res.status(500).json({
      message:error.message
    });

  }

};

// Delete
export const removeWishlist =
async (req,res) => {

  try {

    const userId =
        req.user.id;

    const { tourId } =
      req.params;

    await wishlistService
      .removeWishlist(
        userId,
        tourId
      );

    res.json({
      message:
      "Removed successfully"
    });

  } catch(error){

    res.status(500).json({
      message:error.message
    });

  }

};