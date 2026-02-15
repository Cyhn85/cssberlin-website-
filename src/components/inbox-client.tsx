"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, ChevronLeft, Send, Image as ImageIcon, Check, CheckCheck, MoreVertical } from "lucide-react";
import { createOffer } from "@/actions/offer-actions";
import { getMessages, sendMessage } from "@/actions/chat-actions"; // Bunları sonra yazacanğım

// Type definitions
type ChatUser = {
    id: string;
    name: string | null;
    avatar: string | null;
};

type Product = {
    id: string;
    title: string;
    price: number;
    image: string | null;
};

type Message = {
    id: string;
    senderId: string;
    content: string | null;
    createdAt: Date;
    isRead: boolean;
    isOffer: boolean;
    offerPrice: number | null; // Decimal to number conversion needed on server side
};

type Chat = {
    id: string;
    otherUser: ChatUser;
    product: Product | null;
    lastMessage: Message | null;
    unreadCount: number;
};

interface InboxClientProps {
    initialChats: Chat[];
    currentUserId: string;
}

export function InboxClient({ initialChats, currentUserId }: InboxClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialChatId = searchParams.get("chatId");

    const [selectedChatId, setSelectedChatId] = useState<string | null>(initialChatId);
    const [chats, setChats] = useState<Chat[]>(initialChats);
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageText, setMessageText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);

    // Filter chats by search
    const filteredChats = chats.filter(chat =>
        chat.otherUser.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.product?.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedChat = chats.find((c) => c.id === selectedChatId);

    // Load messages when chat is selected
    useEffect(() => {
        if (selectedChatId) {
            setIsLoadingMessages(true);
            // Call server action to get messages
            getMessages(selectedChatId)
                .then((data) => {
                    setMessages(data);
                    // Mark as read locally logic can be added here
                })
                .finally(() => setIsLoadingMessages(false));

            // URL'i güncelle ama sayfa yenilenmesin
            const params = new URLSearchParams(searchParams.toString());
            params.set("chatId", selectedChatId);
            window.history.pushState(null, "", `?${params.toString()}`);
        }
    }, [selectedChatId]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageText.trim() || !selectedChatId) return;

        const tempId = Math.random().toString();
        const newMessage: Message = {
            id: tempId,
            senderId: currentUserId,
            content: messageText,
            createdAt: new Date(),
            isRead: false,
            isOffer: false,
            offerPrice: null
        };

        // Optimistic update
        setMessages(prev => [...prev, newMessage]);
        setMessageText("");

        try {
            const result = await sendMessage(selectedChatId, messageText);
            if (!result.success) {
                // Revert on error
                setMessages(prev => prev.filter(m => m.id !== tempId));
                alert("Fehler beim Senden der Nachricht");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="page-container bg-[var(--css-cream)]">
            <div className="container px-4 md:px-6 py-6">
                <h1 className="text-2xl font-bold text-[var(--css-green)] mb-6">Postfach</h1>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden h-[calc(100vh-200px)] min-h-[500px]">
                    <div className="flex h-full">
                        {/* Chat List - Sidebar */}
                        <div className={`w-full md:w-80 border-r border-gray-100 flex flex-col ${selectedChatId ? "hidden md:flex" : "flex"}`}>
                            {/* Search */}
                            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Suchen..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--css-green)]"
                                    />
                                </div>
                            </div>

                            {/* Chat Items List */}
                            <div className="flex-1 overflow-y-auto">
                                {filteredChats.length > 0 ? (
                                    filteredChats.map((chat) => (
                                        <button
                                            key={chat.id}
                                            onClick={() => setSelectedChatId(chat.id)}
                                            className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-50 ${selectedChatId === chat.id ? "bg-green-50/50 border-l-4 border-l-[var(--css-green)]" : "border-l-4 border-l-transparent"
                                                }`}
                                        >
                                            <div className="relative flex-shrink-0">
                                                <Image
                                                    src={chat.otherUser.avatar || "/placeholder-user.jpg"}
                                                    alt={chat.otherUser.name || "User"}
                                                    width={48}
                                                    height={48}
                                                    className="rounded-full object-cover border border-gray-100"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0 text-left">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-semibold text-gray-900 truncate">
                                                        {chat.otherUser.name || "Benutzer"}
                                                    </span>
                                                    {chat.lastMessage && (
                                                        <span className="text-xs text-gray-400">
                                                            {new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    )}
                                                </div>
                                                {chat.product && (
                                                    <p className="text-xs text-[var(--css-green)] truncate mb-1">
                                                        {chat.product.title}
                                                    </p>
                                                )}
                                                <p className={`text-sm truncate ${chat.unreadCount > 0 ? "font-bold text-gray-900" : "text-gray-500"}`}>
                                                    {chat.lastMessage ? (
                                                        <>
                                                            {chat.lastMessage.senderId === currentUserId && "Du: "}
                                                            {chat.lastMessage.isOffer ? "Preisvorschlag gesendet" : chat.lastMessage.content}
                                                        </>
                                                    ) : (
                                                        "Keine Nachrichten"
                                                    )}
                                                </p>
                                            </div>
                                            {chat.unreadCount > 0 && (
                                                <span className="w-5 h-5 bg-[var(--css-orange)] text-white text-xs rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                                                    {chat.unreadCount}
                                                </span>
                                            )}
                                        </button>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-gray-500">
                                        Keine Unterhaltungen gefunden.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Chat Area - Main */}
                        <div className={`flex-1 flex flex-col bg-slate-50 ${selectedChatId ? "flex" : "hidden md:flex"}`}>
                            {selectedChat ? (
                                <>
                                    {/* Chat Header */}
                                    <div className="p-4 border-b border-gray-200 bg-white flex items-center gap-3 shadow-sm z-10">
                                        <button
                                            onClick={() => setSelectedChatId(null)}
                                            className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <Image
                                            src={selectedChat.otherUser.avatar || "/placeholder-user.jpg"}
                                            alt={selectedChat.otherUser.name || "User"}
                                            width={40}
                                            height={40}
                                            className="rounded-full object-cover border border-gray-200"
                                        />
                                        <div className="flex-1">
                                            <Link
                                                href={`/profile/${selectedChat.otherUser.id}`}
                                                className="font-bold text-gray-900 hover:text-[var(--css-green)]"
                                            >
                                                {selectedChat.otherUser.name}
                                            </Link>
                                        </div>
                                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Product Snippet */}
                                    {selectedChat.product && (
                                        <div className="bg-white border-b border-gray-100 p-3 shadow-sm z-0">
                                            <Link href={`/items/${selectedChat.product.id}`} className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                                                <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                                                    {selectedChat.product.image ? (
                                                        <Image src={selectedChat.product.image} alt="Product" fill className="object-cover" />
                                                    ) : (
                                                        <ImageIcon className="w-6 h-6 m-auto text-gray-300 transform translate-y-3" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-900">{selectedChat.product.title}</h3>
                                                    <p className="text-sm font-bold text-[var(--css-green)]">€{selectedChat.product.price.toFixed(2).replace('.', ',')}</p>
                                                </div>
                                            </Link>
                                        </div>
                                    )}

                                    {/* Messages Area */}
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#e5ddd5]/10">
                                        {isLoadingMessages ? (
                                            <div className="flex justify-center py-8">
                                                <div className="w-6 h-6 border-2 border-[var(--css-green)] border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                        ) : (
                                            messages.map((msg) => {
                                                const isOwn = msg.senderId === currentUserId;

                                                if (msg.isOffer) {
                                                    return (
                                                        <div key={msg.id} className="flex justify-center my-4">
                                                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-orange-100 text-center max-w-xs w-full">
                                                                <p className="text-xs font-bold text-[var(--css-orange)] uppercase tracking-wide mb-1">Preisvorschlag</p>
                                                                <p className="text-3xl font-bold text-gray-900 mb-4">€{msg.offerPrice?.toFixed(2).replace('.', ',')}</p>

                                                                {!isOwn && (
                                                                    <div className="grid grid-cols-2 gap-2">
                                                                        <button className="btn-secondary text-xs py-2 bg-red-50 text-red-600 border-red-200 hover:bg-red-100">
                                                                            Ablehnen
                                                                        </button>
                                                                        <button className="btn-primary text-xs py-2">
                                                                            Annehmen
                                                                        </button>
                                                                    </div>
                                                                )}
                                                                {isOwn && <p className="text-xs text-gray-400">Warte auf Antwort...</p>}
                                                            </div>
                                                        </div>
                                                    );
                                                }

                                                return (
                                                    <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                                                        <div
                                                            className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm relative ${isOwn
                                                                    ? "bg-[var(--css-green)] text-white rounded-br-none"
                                                                    : "bg-white text-gray-900 rounded-bl-none border border-gray-100"
                                                                }`}
                                                        >
                                                            <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                                            <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isOwn ? "text-white/70" : "text-gray-400"}`}>
                                                                <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                                {isOwn && (msg.isRead ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                        {messages.length === 0 && !isLoadingMessages && (
                                            <div className="text-center text-gray-400 py-10">
                                                <p>Schreib die erste Nachricht!</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Message Input */}
                                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white flex items-center gap-2">
                                        <button type="button" className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
                                            <ImageIcon className="w-5 h-5" />
                                        </button>
                                        <input
                                            type="text"
                                            value={messageText}
                                            onChange={(e) => setMessageText(e.target.value)}
                                            placeholder="Nachricht schreiben..."
                                            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-[var(--css-green)] focus:bg-white transition-all"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!messageText.trim()}
                                            className="p-2.5 bg-[var(--css-green)] text-white rounded-full hover:bg-berlin-green/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                                        >
                                            <Send className="w-5 h-5" />
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <Send className="w-10 h-10 text-gray-300" />
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-600 mb-1">Deine Nachrichten</h2>
                                    <p className="text-sm">Wähle eine Unterhaltung aus, um zu chatten.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
