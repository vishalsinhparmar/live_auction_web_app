// send success message for successful request
const sendSuccessMessage = (res, message = "success", data, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    data,
    message,
  });
};

// send error message as response
const sendErrorMessage = (res, message = "failed", errOrStatusCode = null, statusCode = 400) => {
  const resolvedStatusCode =
    typeof errOrStatusCode === "number" && statusCode === 400 ? errOrStatusCode : statusCode;

  const resolvedError =
    typeof errOrStatusCode === "number" && statusCode === 400 ? undefined : errOrStatusCode;

  res.status(resolvedStatusCode).json({
    success: false,
    message,
    ...(resolvedError !== undefined ? { err: resolvedError } : {}),
  });
};

export { sendSuccessMessage, sendErrorMessage };
