// send success message for successful request
// Supports both call styles:
// 1) sendSuccessMessage(res, message, data, statusCode)
// 2) sendSuccessMessage(res, message, statusCode)
const sendSuccessMessage = (res, message = "success", dataOrStatusCode, statusCode = 200) => {
  const isLegacyStatusOnly =
    typeof dataOrStatusCode === "number" && typeof statusCode !== "number";

  const resolvedStatusCode =
    typeof dataOrStatusCode === "number" && statusCode === 200
      ? dataOrStatusCode
      : isLegacyStatusOnly
        ? dataOrStatusCode
        : statusCode;

  const resolvedData =
    typeof dataOrStatusCode === "number" && statusCode === 200 ? null : dataOrStatusCode;

  return res.status(resolvedStatusCode).json({
    success: true,
    data: resolvedData,
    message,
  });
};

// send error message as response
// Supports both call styles:
// 1) sendErrorMessage(res, message, err, statusCode)
// 2) sendErrorMessage(res, message, statusCode)
const sendErrorMessage = (res, message = "failed", errOrStatusCode = null, statusCode = 400) => {
  const resolvedStatusCode =
    typeof errOrStatusCode === "number" && statusCode === 400 ? errOrStatusCode : statusCode;

  const resolvedError =
    typeof errOrStatusCode === "number" && statusCode === 400 ? undefined : errOrStatusCode;

  return res.status(resolvedStatusCode).json({
    success: false,
    message,
    ...(resolvedError !== undefined ? { err: resolvedError } : {}),
  });
};

export { sendSuccessMessage, sendErrorMessage };
