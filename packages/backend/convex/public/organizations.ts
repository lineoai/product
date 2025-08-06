import { v } from "convex/values";
import { action } from "../_generated/server";
import { createClerkClient } from "@clerk/backend";


export const validate = action({
    args: {
        organizationId: v.string(),
    },
    handler: async (_, args) => {
        const secretKey = process.env.CLERK_SECRET_KEY!!;

        if (!secretKey) {
            return {
                valid: false,
                reason: "Missing Clerk secret key",
            };
        }


        const clerkClient = createClerkClient({
            secretKey: secretKey,
        });

        try {
            const organization = await clerkClient.organizations.getOrganization({
                organizationId: args.organizationId,
            });

            if (organization) {
                return {
                    valid: true,
                };
            } else {
                return {
                    valid: false,
                    reason: "Organization not found",
                };
            }
        } catch (error) {
            return {
                valid: false,
                reason: "Failed to validate organization",
            };
        }
    },
});
