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
  res.status(501).json({
    success: false,
    message: "Not implemented yet",
    data: null,
  });
};

const getNotesByCategory = async (req, res) => {
  res.status(501).json({
    success: false,
    message: "Not implemented yet",
    data: null,
  });
};

const getNotesByStatus = async (req, res) => {
  res.status(501).json({
    success: false,
    message: "Not implemented yet",
    data: null,
  });
};

const getNoteSummary = async (req, res) => {
  res.status(501).json({
    success: false,
    message: "Not implemented yet",
    data: null,
  });
};

const filterNotes = async (req, res) => {
  res.status(501).json({
    success: false,
    message: "Not implemented yet",
    data: null,
  });
};

const getPinnedNotes = async (req, res) => {
  res.status(501).json({
    success: false,
    message: "Not implemented yet",
    data: null,
  });
};

const filterByCategory = async (req, res) => {
  res.status(501).json({
    success: false,
    message: "Not implemented yet",
    data: null,
  });
};

const filterByDateRange = async (req, res) => {
  res.status(501).json({
    success: false,
    message: "Not implemented yet",
    data: null,
  });
};

const paginateNotes = async (req, res) => {
  res.status(501).json({
    success: false,
    message: "Not implemented yet",
    data: null,
  });
};

const paginateByCategory = async (req, res) => {
  res.status(501).json({
    success: false,
    message: "Not implemented yet",
    data: null,
  });
};

const sortNotes = async (req, res) => {
  res.status(501).json({
    success: false,
    message: "Not implemented yet",
    data: null,
  });
};

const sortPinnedNotes = async (req, res) => {
  res.status(501).json({
    success: false,
    message: "Not implemented yet",
    data: null,
  });
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
