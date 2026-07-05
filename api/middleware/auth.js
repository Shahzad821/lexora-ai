import { clerkClient, getAuth } from "@clerk/express";

export const auth = async (req, res, next) => {
  try {
    const { userId, has } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: No user ID found" });
    }

    req.userId = userId;

    const hasPremiumPlan = has({ plan: "premium" });

    if (!hasPremiumPlan) {
      const user = await clerkClient.users.getUser(userId);

      req.free_usage = user.privateMetadata.free_usage || 0;
      req.plan = "free";
    } else {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: 0,
        },
      });
      req.free_usage = 0;
      req.plan = "premium";
    }

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
