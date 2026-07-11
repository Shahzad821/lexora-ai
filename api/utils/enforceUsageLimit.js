const freeLimit = 10;

const enforceUsageLimit = (req, res) => {
  if (req.plan !== "premium" && req.free_usage >= freeLimit) {
    res.status(403).json({
      error: "Free usage limit exceeded. Please upgrade to premium.",
    });
    return false;
  }

  return true;
};
export default enforceUsageLimit;
