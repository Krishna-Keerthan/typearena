import { jwtVerify } from "jose";
import type { SocketUser } from "./types.js";

const secret = process.env.SOCKET_TOKEN_SECRET ?? process.env.NEXTAUTH_SECRET;
const key = secret ? new TextEncoder().encode(secret) : null;

export async function verifySocketToken(token: string): Promise<SocketUser | null> {
  if (!key) return null;

  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    const id = typeof payload.id === "string" ? payload.id : payload.sub;

    if (!id) {
      return null;
    }

    const rawName =
      typeof payload.name === "string" && payload.name.trim()
        ? payload.name.trim()
        : typeof payload.email === "string" && payload.email.includes("@")
          ? payload.email.split("@")[0]
          : "Player";

    return {
      id,
      name: rawName,
      email: typeof payload.email === "string" ? payload.email : undefined,
      image: typeof payload.picture === "string" ? payload.picture : undefined,
    };
  } catch {
    return null;
  }
}
