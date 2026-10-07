const Material = require("../models/MaterialSchema");

// CREATE MATERIAL
const createMaterial = async (req, res, next) => {
  try {
    const {
      name,
      unit,
      rate,
      description,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Material name is required",
      });
    }

    if (rate === undefined || rate === null) {
      return res.status(400).json({
        success: false,
        message: "Material rate is required",
      });
    }

    const existingMaterial = await Material.findOne({
      name: name.trim(),
    });

    if (existingMaterial) {
      return res.status(409).json({
        success: false,
        message: "Material already exists",
      });
    }

    const material = await Material.create({
      name: name.trim(),
      unit: unit?.trim() || "Kg",
      rate,
      description: description?.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Material created successfully",
      material,
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL MATERIALS
const getAllMaterials = async (req, res, next) => {
  try {
    const materials = await Material.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: materials.length,
      materials,
    });
  } catch (error) {
    next(error);
  }
};

// GET MATERIAL BY ID
const getMaterialById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const material = await Material.findById(id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Material not found",
      });
    }

    return res.status(200).json({
      success: true,
      material,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE MATERIAL
const updateMaterial = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      name,
      unit,
      rate,
      description,
    } = req.body;

    const material = await Material.findById(id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Material not found",
      });
    }

    if (name !== undefined) {
      const duplicateMaterial = await Material.findOne({
        name: name.trim(),
        _id: { $ne: id },
      });

      if (duplicateMaterial) {
        return res.status(409).json({
          success: false,
          message: "Material name already exists",
        });
      }

      material.name = name.trim();
    }

    if (unit !== undefined) {
      material.unit = unit.trim();
    }

    if (rate !== undefined) {
      material.rate = rate;
    }

    if (description !== undefined) {
      material.description = description?.trim();
    }

    await material.save();

    return res.status(200).json({
      success: true,
      message: "Material updated successfully",
      material,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE MATERIAL
const deleteMaterial = async (req, res, next) => {
  try {
    const { id } = req.params;

    const material = await Material.findById(id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Material not found",
      });
    }

    await Material.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Material deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// TOGGLE MATERIAL STATUS
const toggleMaterialStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const material = await Material.findById(id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Material not found",
      });
    }

    material.isActive = !material.isActive;

    await material.save();

    return res.status(200).json({
      success: true,
      message: `Material ${
        material.isActive ? "activated" : "deactivated"
      } successfully`,
      material,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE MATERIAL RATE
const updateMaterialRate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rate } = req.body;

    if (rate === undefined || rate === null) {
      return res.status(400).json({
        success: false,
        message: "Material rate is required",
      });
    }

    const material = await Material.findById(id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Material not found",
      });
    }

    material.rate = rate;

    await material.save();

    return res.status(200).json({
      success: true,
      message: "Material rate updated successfully",
      material,
    });
  } catch (error) {
    next(error);
  }
};

// SEARCH MATERIALS
const searchMaterials = async (req, res, next) => {
  try {
    const { search } = req.query;

    if (!search || !search.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search term is required",
      });
    }

    const materials = await Material.find({
      $or: [
        {
          name: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          description: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ],
    }).sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: materials.length,
      materials,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMaterial,
  getAllMaterials,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
  toggleMaterialStatus,
  updateMaterialRate,
  searchMaterials,
};