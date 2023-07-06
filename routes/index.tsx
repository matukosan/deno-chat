import { HandlerContext, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import twas from "twas";
import { databaseLoader } from "@/communication/database.ts";
import { Footer } from "@/helpers/Footer.tsx";
import type { RoomView } from "@/communication/types.ts";

export async function handler(
  req: Request,
  ctx: HandlerContext,
): Promise<Response> {
  // Get cookie from request header and parse it
  const database = await databaseLoader.getInstance();
  return ctx.render({ rooms: await database.getRooms() });
}

export default function Main({ url, data }: PageProps<{ rooms: RoomView[] }>) {
  return (
    <>
      <Head>
        <title>Deno Chat</title>
      </Head>
      <img
        src="/background.png"
        alt="bg"
        class="absolute top-0 left-0 w-full min-h-screen -z-10 bg-gray-900 object-cover"
      />
      <div class="flex justify-center items-center h-screen text-gray-600">
        <div>
          <div class="mb-16 mx-8 text-center">
            <img
              class="h-24 mx-auto mb-6"
              src="/logo.svg"
              alt="Deno Logo"
            />
            <span class="block text-3xl font-bold text-black mb-3">
              Deno Chat
            </span>
            <span class="block text-lg -mb-1.5">
              A minimal chat platform template.
            </span>
            <span class="block text-lg">
              It uses{" "}
              <a
                class="font-bold underline"
                href="https://fresh.deno.dev"
                rel="noopener noreferrer"
                target="_blank"
              >
                Fresh
              </a>
              {" + "}
              <a
                class="font-bold underline"
                href="https://supabase.com"
                rel="noopener noreferrer"
                target="_blank"
              >
                Supabase
              </a>
              {" + "}
              <a
                class="font-bold underline"
                href="https://twind.dev/"
                rel="noopener noreferrer"
                target="_blank"
              >
                twind
              </a>
              {" + "}
              <a
                class="font-bold underline"
                href="https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API"
                rel="noopener noreferrer"
                target="_blank"
              >
                Broadcast Channel API
              </a>{" "}
              on Deno Deploy.
            </span>
          </div>
          {data
            && (
              <ul
                role="list"
                class="max-h-[21.375rem] mx-2 md:mx-0 overflow-y-scroll space-y-4.5"
              >
                <li>
                  <a
                    href="/new"
                    class="flex justify-center items-center bg-white rounded-full h-18 border-2 border-gray-300 transition-colors hover:(bg-green-100 border-green-400) group"
                  >
                    <div class="w-8 h-8 flex justify-center items-center mr-2.5">
                      <img src="/plus.svg" alt="Plus" />
                    </div>
                    <span class="text-xl font-bold text-gray-900 group-hover:underline group-focus:underline">
                      New Room
                    </span>
                  </a>
                </li>

                {data.rooms.map((room) => {
                  return (
                    <li key={room.roomId}>
                      <a
                        href={new URL(room.roomId.toString(), url).href}
                        class="grid grid-cols-3 items-center bg-white rounded-full h-18 border-2 border-gray-300 transition-colors hover:(bg-gray-100 border-gray-400) group"
                      >
                        <div
                          class="w-12 h-12 bg-cover rounded-3xl ml-3"
                          style={`background-image: url(${
                            "https://deno-avatar.deno.dev/avatar/" + room.roomId
                          })`}
                        />
                        <p class="text-xl font-bold text-gray-900 justify-self-center group-hover:underline group-focus:underline">
                          {room.name}
                        </p>
                        <p class="font-medium text-gray-400 mr-8 justify-self-end">
                          {room.lastMessageAt
                            ? twas(new Date(room.lastMessageAt).getTime())
                            : "No messages"}
                        </p>
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          <Footer />
        </div>
      </div>
    </>
  );
}
