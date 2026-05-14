import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
    try {
        if (!req.body.imageUrls || req.body.imageUrls.length === 0) {
            return next(errorHandler(400, "Debes subir al menos una imagen"));
        }

        if (Number(req.body.regularPrice) < Number(req.body.discountPrice)) {
            return next(errorHandler(400, "El precio de descuento no puede ser mayor al precio regular"));
        }

        const listing = await Listing.create({
            ...req.body,
            userRef: req.user.id,
        });
        return res.status(201).json(listing);

    } catch (error) {
        next(error);
    }
};

export const getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return next(errorHandler(404, "Anuncio no encontrado"));
        }

        res.status(200).json(listing);
    } catch (error) {
        next(error);
    }
};

export const getListings = async (req, res, next) => {
    try {
        const limit = Number.isNaN(parseInt(req.query.limit, 10)) ? 9 : parseInt(req.query.limit, 10);
        const startIndex = Number.isNaN(parseInt(req.query.startIndex, 10)) ? 0 : parseInt(req.query.startIndex, 10);
        const offer = req.query.offer === undefined || req.query.offer === 'false'
            ? { $in: [false, true] }
            : req.query.offer;
        const furnished = req.query.furnished === undefined || req.query.furnished === 'false'
            ? { $in: [false, true] }
            : req.query.furnished;
        const parking = req.query.parking === undefined || req.query.parking === 'false'
            ? { $in: [false, true] }
            : req.query.parking;
        const type = req.query.type === undefined || req.query.type === 'all'
            ? { $in: ['sale', 'rent'] }
            : req.query.type;
        const searchTerm = req.query.searchTerm || '';
        const sort = ['createdAt', 'regularPrice', 'updatedAt'].includes(req.query.sort)
            ? req.query.sort
            : 'createdAt';
        const order = req.query.order === 'asc' ? 'asc' : 'desc';

        const listings = await Listing.find({
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } },
                { address: { $regex: searchTerm, $options: 'i' } },
            ],
            offer,
            furnished,
            parking,
            type,
        })
            .sort({ [sort]: order })
            .limit(limit)
            .skip(startIndex);

        return res.status(200).json(listings);
    } catch (error) {
        next(error);
    }
};

export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        return next(errorHandler(404, "Anuncio no encontrado"));
    }

    if (req.user.id !== listing.userRef) {
        return next(errorHandler(403, "Solo puedes eliminar tus propios anuncios"));
    }

    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json("Anuncio eliminado correctamente");
    } catch (error) {
        next(error);
    }
};

export const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        return next(errorHandler(404, "Anuncio no encontrado"));
    }

    if (req.user.id !== listing.userRef) {
        return next(errorHandler(403, "Solo puedes actualizar tus propios anuncios"));
    }

    try {
        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedListing);
    } catch (error) {
        next(error);
    }
};
