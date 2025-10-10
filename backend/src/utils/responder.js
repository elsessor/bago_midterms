export function successResponse(res, data = null, message = "OK", status = 200) {
  return res.status(status).json({ success: true, message, data });
}

export function errorResponse(res, message = "Error", status = 400, code = "BAD_REQUEST", details = null) {
  return res.status(status).json({ success: false, error: { code, message, details } });
}


