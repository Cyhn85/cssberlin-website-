import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { InboxClient } from "@/components/inbox-client";
import { getChats } from "@/actions/chat-actions";

export default async function InboxPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const chats = await getChats();

    return <InboxClient initialChats={chats} currentUserId={userId} />;
}
