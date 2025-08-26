import { ConvexError, v } from "convex/values";
import { action } from "../_generated/server";
import {
    guessMimeTypeFromContents,
    guessMimeTypeFromExtension
} from "@convex-dev/rag"
import { extractText } from "@convex-dev/agent";
import { extractTextContext } from "../lib/extractTextContext";

function guessMimeType(filename: string, bytes: ArrayBuffer): string {
    return (
        guessMimeTypeFromExtension(filename) ||
        guessMimeTypeFromContents(bytes) ||
        "application/octet-stream"
    )
}

export const addfile = action({
    args: {
        filename: v.string(),
        mimeType: v.string(),
        bytes: v.bytes(),
        category: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Identity not found",
            });
        }

        const orgId = identity.orgId as string;
        if (!orgId) {
            throw new ConvexError({
                code: "UNAUTHORIZED",
                message: "Organization not found",
            });
        }

        const { filename, bytes, category } = args;

        const mimeType = args.mimeType || guessMimeType(filename, bytes)
        const blob = new Blob([bytes], { type: mimeType });

        const storageId = await ctx.storage.store(blob);

        const text = await extractTextContext(ctx, {
            storageId, 
            filename,
            bytes,
            mimeType
        })

    }
})