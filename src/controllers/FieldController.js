const Field = require("../models/FieldSchema");
const Farmer = require("../models/FarmerSchema");

// CREATE FIELD
const createField = async (req, res, next) => {
  try {
    const {
      farmer,
      gatNumber,
      area,
      areaUnit,
      crop,
      season,
      village,
      notes,
    } = req.body;

    if (!farmer) {
      return res.status(400).json({
        success: false,
        message: "Farmer is required",
      });
    }

    if (!gatNumber) {
      return res.status(400).json({
        success: false,
        message: "Gat number is required",
      });
    }

    if (area === undefined || area === null) {
      return res.status(400).json({
        success: false,
        message: "Area is required",
      });
    }

    // Check farmer exists
    const farmerExists = await Farmer.findById(farmer);

    if (!farmerExists) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found",
      });
    }

    // Check duplicate Gat number for same farmer
    const existingField = await Field.findOne({
      farmer,
      gatNumber: gatNumber.trim(),
    });

    if (existingField) {
      return res.status(409).json({
        success: false,
        message: "Gat number already exists for this farmer",
      });
    }

    const field = await Field.create({
      farmer,
      gatNumber: gatNumber.trim(),
      area,
      areaUnit,
      crop: crop?.trim(),
      season: season?.trim(),
      village: village?.trim(),
      notes: notes?.trim(),
    });

    const populatedField = await Field.findById(field._id).populate(
      "farmer",
      "name mobile village"
    );

    return res.status(201).json({
      success: true,
      message: "Field created successfully",
      field: populatedField,
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL FIELDS
const getAllFields = async (req, res, next) => {
  try {
    const fields = await Field.find()
      .populate("farmer", "name mobile village")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: fields.length,
      fields,
    });
  } catch (error) {
    next(error);
  }
};

// GET FIELD BY ID
const getFieldById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const field = await Field.findById(id).populate(
      "farmer",
      "name mobile village"
    );

    if (!field) {
      return res.status(404).json({
        success: false,
        message: "Field not found",
      });
    }

    return res.status(200).json({
      success: true,
      field,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE FIELD
const updateField = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      farmer,
      gatNumber,
      area,
      areaUnit,
      crop,
      season,
      village,
      notes,
    } = req.body;

    const field = await Field.findById(id);

    if (!field) {
      return res.status(404).json({
        success: false,
        message: "Field not found",
      });
    }

    // If farmer is being changed, verify farmer exists
    if (farmer !== undefined) {
      const farmerExists = await Farmer.findById(farmer);

      if (!farmerExists) {
        return res.status(404).json({
          success: false,
          message: "Farmer not found",
        });
      }

      field.farmer = farmer;
    }

    if (gatNumber !== undefined) {
      field.gatNumber = gatNumber.trim();
    }

    if (area !== undefined) {
      field.area = area;
    }

    if (areaUnit !== undefined) {
      field.areaUnit = areaUnit;
    }

    if (crop !== undefined) {
      field.crop = crop?.trim();
    }

    if (season !== undefined) {
      field.season = season?.trim();
    }

    if (village !== undefined) {
      field.village = village?.trim();
    }

    if (notes !== undefined) {
      field.notes = notes?.trim();
    }

    // Check duplicate farmer + Gat number
    const duplicateField = await Field.findOne({
      farmer: field.farmer,
      gatNumber: field.gatNumber,
      _id: { $ne: id },
    });

    if (duplicateField) {
      return res.status(409).json({
        success: false,
        message: "Gat number already exists for this farmer",
      });
    }

    await field.save();

    const updatedField = await Field.findById(field._id).populate(
      "farmer",
      "name mobile village"
    );

    return res.status(200).json({
      success: true,
      message: "Field updated successfully",
      field: updatedField,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE FIELD
const deleteField = async (req, res, next) => {
  try {
    const { id } = req.params;

    const field = await Field.findById(id);

    if (!field) {
      return res.status(404).json({
        success: false,
        message: "Field not found",
      });
    }

    await Field.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Field deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// TOGGLE FIELD STATUS
const toggleFieldStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const field = await Field.findById(id);

    if (!field) {
      return res.status(404).json({
        success: false,
        message: "Field not found",
      });
    }

    field.isActive = !field.isActive;

    await field.save();

    return res.status(200).json({
      success: true,
      message: `Field ${
        field.isActive ? "activated" : "deactivated"
      } successfully`,
      field,
    });
  } catch (error) {
    next(error);
  }
};

// GET FIELDS BY FARMER
const getFieldsByFarmer = async (req, res, next) => {
  try {
    const { farmerId } = req.params;

    // Check farmer exists
    const farmer = await Farmer.findById(farmerId);

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found",
      });
    }

    const fields = await Field.find({
      farmer: farmerId,
    })
      .populate("farmer", "name mobile village")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: fields.length,
      fields,
    });
  } catch (error) {
    next(error);
  }
};

// CHECK GAT NUMBER AVAILABILITY
const checkGatNumberAvailability = async (req, res, next) => {
  try {
    const { farmerId, gatNumber } = req.query;

    if (!farmerId) {
      return res.status(400).json({
        success: false,
        message: "Farmer ID is required",
      });
    }

    if (!gatNumber) {
      return res.status(400).json({
        success: false,
        message: "Gat number is required",
      });
    }

    const farmer = await Farmer.findById(farmerId);

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found",
      });
    }

    const field = await Field.findOne({
      farmer: farmerId,
      gatNumber: gatNumber.trim(),
    });

    return res.status(200).json({
      success: true,
      available: !field,
      message: field
        ? "Gat number already exists for this farmer"
        : "Gat number is available",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createField,
  getAllFields,
  getFieldById,
  updateField,
  deleteField,
  toggleFieldStatus,
  getFieldsByFarmer,
  checkGatNumberAvailability,
};