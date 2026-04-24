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
  res.status(501).json({
    success: false,
    message: "Not implemented yet",
    data: null,
  });
};

const createBulkNotes = async (req, res) => {
  res.status(501).json({
    success: false,
    message: "Not implemented yet",
    data: null,
  });
};

const getAllNotes = async (req, res) => {
  res.status(501).json({
    success: false,
    message: "Not implemented yet",
    data: null,
  });
};

const getNoteById = async (req, res) => {
  res.status(501).json({
    success: false,
    message: "Not implemented yet",
    data: null,
  });
};

const replaceNote = async (req, res) => {
  res.status(501).json({
    success: false,
    message: "Not implemented yet",
    data: null,
  });
};

const updateNote = async (req, res) => {
  res.status(501).json({
    success: false,
    message: "Not implemented yet",
    data: null,
  });
};

const deleteNote = async (req, res) => {
  res.status(501).json({
    success: false,
    message: "Not implemented yet",
    data: null,
  });
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
