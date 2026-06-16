import "server-only";
import { prisma } from "./prisma";
import { stringifyJson } from "./json";

export async function audit(opts: {
  organizationId?: string | null;
  userId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  oldValue?: unknown;
  newValue?: unknown;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        organizationId: opts.organizationId ?? null,
        userId: opts.userId ?? null,
        action: opts.action,
        entityType: opts.entityType,
        entityId: opts.entityId ?? null,
        oldValue: stringifyJson(opts.oldValue),
        newValue: stringifyJson(opts.newValue),
      },
    });
  } catch (e) {
    console.error("audit log failed", e);
  }
}
