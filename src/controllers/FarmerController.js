const Farmer = require("../models/FarmerSchema");

const createFarmer = async (req, res, next) => {
  try {
    const {
      name,
      mobile,
      village,
      taluka,
      address,
      notes,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Farmer name is required",
      });
    }

    const farmer = await Farmer.create({
      name: name.trim(),
      mobile: mobile?.trim(),
      village: village?.trim(),
      taluka: taluka?.trim(),
      address: address?.trim(),
      notes: notes?.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Farmer created successfully",
      farmer,
    });
  } catch (error) {
    next(error);
  }
};

const getAllFarmers = async (req, res, next) => {
  try {
    const farmers = await Farmer.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: farmers.length,
      farmers,
    });
  } catch (error) {
    next(error);
  }
};

const getFarmerById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const farmer = await Farmer.findById(id);

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found",
      });
    }

    return res.status(200).json({
      success: true,
      farmer,
    });
  } catch (error) {
    next(error);
  }
};

const updateFarmer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      name,
      mobile,
      village,
      taluka,
      address,
      notes,
    } = req.body;

    const farmer = await Farmer.findById(id);

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found",
      });
    }

    if (name !== undefined) {
      farmer.name = name.trim();
    }

    if (mobile !== undefined) {
      farmer.mobile = mobile?.trim();
    }

    if (village !== undefined) {
      farmer.village = village?.trim();
    }

    if (taluka !== undefined) {
      farmer.taluka = taluka?.trim();
    }

    if (address !== undefined) {
      farmer.address = address?.trim();
    }

    if (notes !== undefined) {
      farmer.notes = notes?.trim();
    }

    await farmer.save();

    return res.status(200).json({
      success: true,
      message: "Farmer updated successfully",
      farmer,
    });
  } catch (error) {
    next(error);
  }
};

const deleteFarmer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const farmer = await Farmer.findById(id);

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found",
      });
    }

    await Farmer.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Farmer deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const toggleFarmerStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const farmer = await Farmer.findById(id);

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found",
      });
    }

    farmer.isActive = !farmer.isActive;

    await farmer.save();

    return res.status(200).json({
      success: true,
      message: `Farmer ${
        farmer.isActive ? "activated" : "deactivated"
      } successfully`,
      farmer,
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  createFarmer,
  getAllFarmers,
  getFarmerById,
  updateFarmer,
  deleteFarmer,
  toggleFarmerStatus,
};