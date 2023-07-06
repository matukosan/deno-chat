import { Handler, HandlerContext, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { databaseLoader } from "@/communication/database.ts";
import Chat from "@/islands/Chat.tsx";
import type { MessageView, UserView } from "@/communication/types.ts";
import { Page } from "@/helpers/Page.tsx";

interface Data {
  messages: MessageView[];
  roomName: string;
  user: UserView;
}

export const handler: Handler<Data> = async (
  req: Request,
  ctx: HandlerContext<Data>,
): Promise<Response> => {
  const database = await databaseLoader.getInstance();
  if (isNaN(+ctx.params.room)) {
    return new Response("Invalid room id", { status: 400 });
  }

  const uuid = crypto.randomUUID();

  const user = {
    userName: "Anonymous#" + uuid.slice(0, 8),
  }

  const [messages, roomName] = await Promise.all([
    database.getRoomMessages(+ctx.params.room),
    database.getRoomName(+ctx.params.room),
  ]);
  return ctx.render({
    messages,
    roomName,
    user: {
      name: user.userName
    },
  });
};

export default function Room({ data, params }: PageProps<Data>) {
  return (
    <>
      <Head>
        <title>{data.roomName} | Deno Chat</title>
      </Head>
      <Page>
        <Chat
          roomId={+params.room}
          initialMessages={data.messages}
          roomName={data.roomName}
          user={data.user}
        />
      </Page>
    </>
  );
}
