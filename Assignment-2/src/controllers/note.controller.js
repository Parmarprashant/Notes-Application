const mongoose = require("mongoose");
const Note = require("../models/note.model");

const allowedCategories = ["work", "personal", "study"];
const allowedSortFields = ["title", "createdAt", "updatedAt", "category"];

const sendSuccess = (res, statusCode, message, data, extra = {}) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    ...extra,
  });
};

const sendError = (res, statusCode, message) => {
  res.status(statusCode).json({
    success: false,
    message,
    data: null,
  });
};

const handleServerError = (res, error) => {
  res.status(500).json({
    success: false,
    message: error.message || "Internal server error",
    data: null,
  });
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const parsePinnedValue = (value) => {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return null;
};

const isAllowedCategory = (category) => allowedCategories.includes(category);

const getPaginationValues = (query) => {
  const page = Number.parseInt(query.page, 10) || 1;
  const limit = Number.parseInt(query.limit, 10) || 10;
  const safePage = page > 0 ? page : 1;
  const safeLimit = limit > 0 ? limit : 10;

  return {
    page: safePage,
    limit: safeLimit,
    skip: (safePage - 1) * safeLimit,
  };
};

const getPaginationData = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit) || 1;

  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

const getSortConfig = (query) => {
  const sortBy = query.sortBy || "createdAt";
  const order = query.order === "asc" ? 1 : -1;
  const orderLabel = order === 1 ? "ascending" : "descending";

  return {
    sortBy,
    order,
    orderLabel,
  };
};

const createNote = async (req, res) => {
  try {
    const { title, content, category, isPinned } = req.body;

    if (!title || !content) {
      return sendError(res, 400, "Title and content are required");
    }

    const note = await Note.create({
      title,
      content,
      category,
      isPinned,
    });

    return sendSuccess(res, 201, "Note created successfully", note);
  } catch (error) {
    return handleServerError(res, error);
  }
};

const createBulkNotes = async (req, res) => {
  try {
    const { notes } = req.body;

    if (!Array.isArray(notes) || notes.length === 0) {
      return sendError(res, 400, "notes array is required and cannot be empty");
    }

    const createdNotes = await Note.insertMany(notes);

    return sendSuccess(
      res,
      201,
      `${createdNotes.length} notes created successfully`,
      createdNotes
    );
  } catch (error) {
    return handleServerError(res, error);
  }
};

const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find();

    return sendSuccess(res, 200, "Notes fetched successfully", notes, {
      count: notes.length,
    });
  } catch (error) {
    return handleServerError(res, error);
  }
};

const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return sendError(res, 400, "Invalid note ID");
    }

    const note = await Note.findById(id);

    if (!note) {
      return sendError(res, 404, "Note not found");
    }

    return sendSuccess(res, 200, "Note fetched successfully", note);
  } catch (error) {
    return handleServerError(res, error);
  }
};

const replaceNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, isPinned } = req.body;

    if (!isValidObjectId(id)) {
      return sendError(res, 400, "Invalid note ID");
    }

    if (!title || !content) {
      return sendError(res, 400, "Title and content are required");
    }

    const replacedNote = await Note.findOneAndReplace(
      { _id: id },
      {
        title,
        content,
        category: category || "personal",
        isPinned: typeof isPinned === "boolean" ? isPinned : false,
      },
      { new: true, runValidators: true }
    );

    if (!replacedNote) {
      return sendError(res, 404, "Note not found");
    }

    return sendSuccess(res, 200, "Note replaced successfully", replacedNote);
  } catch (error) {
    return handleServerError(res, error);
  }
};

const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!isValidObjectId(id)) {
      return sendError(res, 400, "Invalid note ID");
    }

    if (Object.keys(updates).length === 0) {
      return sendError(res, 400, "No fields provided to update");
    }

    const updatedNote = await Note.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedNote) {
      return sendError(res, 404, "Note not found");
    }

    return sendSuccess(res, 200, "Note updated successfully", updatedNote);
  } catch (error) {
    return handleServerError(res, error);
  }
};

const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return sendError(res, 400, "Invalid note ID");
    }

    const deletedNote = await Note.findByIdAndDelete(id);

    if (!deletedNote) {
      return sendError(res, 404, "Note not found");
    }

    return sendSuccess(res, 200, "Note deleted successfully", null);
  } catch (error) {
    return handleServerError(res, error);
  }
};

const deleteBulkNotes = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return sendError(res, 400, "ids array is required and cannot be empty");
    }

    const result = await Note.deleteMany({
      _id: { $in: ids },
    });

    return sendSuccess(
      res,
      200,
      `${result.deletedCount} notes deleted successfully`,
      null
    );
  } catch (error) {
    return handleServerError(res, error);
  }
};

const getNotesByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!isAllowedCategory(category)) {
      return sendError(
        res,
        400,
        "Invalid category. Allowed: work, personal, study"
      );
    }

    const notes = await Note.find({ category });

    if (notes.length === 0) {
      return sendError(res, 404, `No notes found for category: ${category}`);
    }

    return sendSuccess(
      res,
      200,
      `Notes fetched for category: ${category}`,
      notes,
      { count: notes.length }
    );
  } catch (error) {
    return handleServerError(res, error);
  }
};

const getNotesByStatus = async (req, res) => {
  try {
    const pinned = parsePinnedValue(req.params.isPinned);

    if (pinned === null) {
      return sendError(res, 400, "isPinned must be true or false");
    }

    const notes = await Note.find({ isPinned: pinned });
    const statusLabel = pinned ? "pinned" : "unpinned";

    return sendSuccess(
      res,
      200,
      `Fetched all ${statusLabel} notes`,
      notes,
      { count: notes.length }
    );
  } catch (error) {
    return handleServerError(res, error);
  }
};

const getNoteSummary = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return sendError(res, 400, "Invalid note ID");
    }

    const note = await Note.findById(id).select("title category isPinned createdAt");

    if (!note) {
      return sendError(res, 404, "Note not found");
    }

    return sendSuccess(res, 200, "Note summary fetched successfully", note);
  } catch (error) {
    return handleServerError(res, error);
  }
};

const filterNotes = async (req, res) => {
  try {
    const filter = {};

    if (req.query.category) {
      if (!isAllowedCategory(req.query.category)) {
        return sendError(
          res,
          400,
          "Invalid category. Allowed: work, personal, study"
        );
      }

      filter.category = req.query.category;
    }

    if (req.query.isPinned !== undefined) {
      const pinned = parsePinnedValue(req.query.isPinned);

      if (pinned === null) {
        return sendError(res, 400, "isPinned must be true or false");
      }

      filter.isPinned = pinned;
    }

    const notes = await Note.find(filter);

    return sendSuccess(res, 200, "Notes fetched successfully", notes, {
      count: notes.length,
    });
  } catch (error) {
    return handleServerError(res, error);
  }
};

const getPinnedNotes = async (req, res) => {
  try {
    const filter = { isPinned: true };

    if (req.query.category) {
      if (!isAllowedCategory(req.query.category)) {
        return sendError(
          res,
          400,
          "Invalid category. Allowed: work, personal, study"
        );
      }

      filter.category = req.query.category;
    }

    const notes = await Note.find(filter);

    return sendSuccess(res, 200, "Pinned notes fetched successfully", notes, {
      count: notes.length,
    });
  } catch (error) {
    return handleServerError(res, error);
  }
};

const filterByCategory = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return sendError(res, 400, "Query param 'name' is required");
    }

    if (!isAllowedCategory(name)) {
      return sendError(
        res,
        400,
        "Invalid category. Allowed: work, personal, study"
      );
    }

    const notes = await Note.find({ category: name });

    return sendSuccess(
      res,
      200,
      `Notes filtered by category: ${name}`,
      notes,
      { count: notes.length }
    );
  } catch (error) {
    return handleServerError(res, error);
  }
};

const filterByDateRange = async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return sendError(
        res,
        400,
        "Both 'from' and 'to' query params are required"
      );
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) {
      return sendError(res, 400, "Invalid date range");
    }

    const notes = await Note.find({
      createdAt: {
        $gte: fromDate,
        $lte: toDate,
      },
    });

    return sendSuccess(
      res,
      200,
      `Notes fetched between ${from} and ${to}`,
      notes,
      { count: notes.length }
    );
  } catch (error) {
    return handleServerError(res, error);
  }
};

const paginateNotes = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationValues(req.query);
    const total = await Note.countDocuments();
    const notes = await Note.find().skip(skip).limit(limit);

    return sendSuccess(res, 200, "Notes fetched successfully", notes, {
      pagination: getPaginationData(total, page, limit),
    });
  } catch (error) {
    return handleServerError(res, error);
  }
};

const paginateByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (!isAllowedCategory(category)) {
      return sendError(
        res,
        400,
        "Invalid category. Allowed: work, personal, study"
      );
    }

    const { page, limit, skip } = getPaginationValues(req.query);
    const filter = { category };
    const total = await Note.countDocuments(filter);
    const notes = await Note.find(filter).skip(skip).limit(limit);

    return sendSuccess(res, 200, `Notes fetched for category: ${category}`, notes, {
      pagination: getPaginationData(total, page, limit),
    });
  } catch (error) {
    return handleServerError(res, error);
  }
};

const sortNotes = async (req, res) => {
  try {
    const { sortBy, order, orderLabel } = getSortConfig(req.query);

    if (!allowedSortFields.includes(sortBy)) {
      return sendError(
        res,
        400,
        "Invalid sortBy. Allowed: title, createdAt, updatedAt, category"
      );
    }

    const notes = await Note.find().sort({ [sortBy]: order });

    return sendSuccess(
      res,
      200,
      `Notes sorted by ${sortBy} in ${orderLabel} order`,
      notes,
      { count: notes.length }
    );
  } catch (error) {
    return handleServerError(res, error);
  }
};

const sortPinnedNotes = async (req, res) => {
  try {
    const { sortBy, order, orderLabel } = getSortConfig(req.query);

    if (!allowedSortFields.includes(sortBy)) {
      return sendError(
        res,
        400,
        "Invalid sortBy. Allowed: title, createdAt, updatedAt, category"
      );
    }

    const notes = await Note.find({ isPinned: true }).sort({ [sortBy]: order });

    return sendSuccess(
      res,
      200,
      `Pinned notes sorted by ${sortBy} in ${orderLabel} order`,
      notes,
      { count: notes.length }
    );
  } catch (error) {
    return handleServerError(res, error);
  }
};

module.exports = {
  allowedCategories,
  allowedSortFields,
  sendSuccess,
  sendError,
  handleServerError,
  isValidObjectId,
  parsePinnedValue,
  isAllowedCategory,
  getPaginationValues,
  getPaginationData,
  getSortConfig,
  createNote,
  createBulkNotes,
  getAllNotes,
  getNoteById,
  replaceNote,
  updateNote,
  deleteNote,
  deleteBulkNotes,
  getNotesByCategory,
  getNotesByStatus,
  getNoteSummary,
  filterNotes,
  getPinnedNotes,
  filterByCategory,
  filterByDateRange,
  paginateNotes,
  paginateByCategory,
  sortNotes,
  sortPinnedNotes,
};
