import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const test = (req, res) => {
    res.send("Test Route being called!!!");
};

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(403, "No tienes permiso para actualizar este usuario"));

    try {
        if (req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password, 10);
        }

        const updateFields = {};
        if (req.body.username !== undefined) updateFields.username = req.body.username;
        if (req.body.email !== undefined) updateFields.email = req.body.email;
        if (req.body.password !== undefined) updateFields.password = req.body.password;
        if (req.body.avatar !== undefined) updateFields.avatar = req.body.avatar;
        if (req.body.phone !== undefined) updateFields.phone = req.body.phone;

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: updateFields,
            },
            { new: true }
        );

        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);

    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
     if (req.user.id !== req.params.id) return next(errorHandler(401, "No tienes permiso para eliminar este usuario"));
     try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json("Usuario eliminado correctamente");

     } catch (error) {
        next(error);
     }
};

export const getUserListings = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, "No tienes permiso para ver estos anuncios"));
    }

    try {
        const listings = await Listing.find({ userRef: req.params.id });
        res.status(200).json(listings);
    } catch (error) {
        next(error);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(errorHandler(404, "Usuario no encontrado"));
        }

        const { password: pass, ...rest } = user._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};
