import { HandlerContext } from "$fresh/server.ts";
import { emojify } from "emojify";
import { databaseLoader } from "@/communication/database.ts";
import { RoomChannel } from "@/communication/channel.ts";
import { badWordsCleanerLoader } from "@/helpers/bad_words.ts";
import { ApiSendMessage } from "@/communication/types.ts";

export async function handler(
  req: Request,
  _ctx: HandlerContext,
): Promise<Response> {
  const database = await databaseLoader.getInstance();

  // const user = await database.getUserByAccessTokenOrThrow(accessToken);
  const data = (await req.json()) as ApiSendMessage;
  const channel = new RoomChannel(data.roomId);

  let user = await database.getUserByName(data.user.name);
  if (!user ) {
    await database.insertUser(data.user.name);
    user = await database.getUserByName(data.user.name);
  }
  if (!user) {
    return new Response("User not found", { status: 404 })
  }

  const from = {
    name: data.user.name,
  };

  if (data.kind === "isTyping") {
    // Send `is typing...` indicator.
    channel.sendIsTyping(from);
    channel.close();
    return new Response("OK");
  }

  const badWordsCleaner = await badWordsCleanerLoader.getInstance();
  const message = emojify(badWordsCleaner.clean(data.message));

  channel.sendText({
    message: message,
    from,
    createdAt: new Date().toISOString(),
  });
  channel.close();

  await database.insertMessage({
    text: message,
    roomId: data.roomId,
    userId: user.userId,
  });

  return new Response("OK");
}
