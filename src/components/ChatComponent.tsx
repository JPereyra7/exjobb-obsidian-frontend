// src/components/ChatComponent.tsx
import { useEffect, useState } from "react";
import {
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Search,
} from "lucide-react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../supabaseClient";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../components/ui/avatar";
import { getAgents } from "../services/agentsService";
import { AgentsListProps, iAgent } from "../models/iAgent";

interface Message {
  id: number;
  senderName: string;
  senderEmail: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

const AGENT_EMAIL = "james@lillardco.com";

export const ChatComponent = ({ agents }: AgentsListProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [, setUserImage] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [, setLastName] = useState<string>("");
  const [, setOriginalFirstName] = useState<string>("");
  const [, setOriginalLastName] = useState<string>("");

  const [avatars, setAvatars] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) return;

      setUser(user);

      const { data } = await supabase
        .from("users")
        .select("userimage")
        .eq("id", user.id)
        .single();

      if (data?.userimage) {
        setAvatars((m) => ({ ...m, [user.email ?? user.id]: data.userimage }));
      }
    })();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user from Supabase", error);
        return;
      }
      if (user) {
        setUser(user);
        const { data, error } = await supabase
          .from("users")
          .select("userimage, firstname, surname")
          .eq("id", user.id)
          .single();
        if (error) {
          console.error("Error fetching user data:", error);
        } else {

          const timestamp = new Date().getTime();
          const userImageWithTimestamp = data.userimage
            ? `${data.userimage}?t=${timestamp}`
            : "";

          setUserImage(userImageWithTimestamp);
          setFirstName(data.firstname || "");
          setLastName(data.surname || "");
          setOriginalFirstName(data.firstname || "");
          setOriginalLastName(data.surname || "");
        }
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const data: iAgent[] = await getAgents(); // <-- samma som AgentsList.tsx
        const newMap: Record<string, string> = {};
        data.forEach((a) => {
          if (a.firstname && a.agentimage)
            newMap[a.firstname.toLowerCase()] = a.agentimage;
        });
        setAvatars((m) => ({ ...m, ...newMap }));
      } catch (err) {
        console.error("Error fetching agents:", err);
      }
    })();
  }, []);

  useEffect(() => {
    if (!user) return; // Wait for user to be loaded
    
    setMessages([
      {
        id: 1,
        senderName: "Agent",
        senderEmail: AGENT_EMAIL,
        content:
          `Hi ${firstName || 'there'}! I have a client interested in the Windermere property. Are you available for a showing this week?`,
        timestamp: "2:30 PM",
        isOwn: false,
      },
      {
        id: 2,
        senderName: "You",
        senderEmail: user?.email ?? "",
        content:
          "Absolutely! I can do Tuesday or Wednesday afternoon. What's your client's budget range?",
        timestamp: "2:32 PM",
        isOwn: true,
      },
      {
        id: 3,
        senderName: "Agent",
        senderEmail: AGENT_EMAIL,
        content:
          "Great! Their budget is around $1.5 million. They loved the photos and are eager to see it in person.",
        timestamp: "2:35 PM",
        isOwn: false,
      },
      {
        id: 4,
        senderName: "You",
        senderEmail: user?.email ?? "",
        content:
          "Perfect, I can show it Tuesday at 3 PM. Does that work for them?",
        timestamp: "2:37 PM",
        isOwn: true,
      },
      {
        id: 5,
        senderName: "Agent",
        senderEmail: AGENT_EMAIL,
        content:
          "Yes, that works! I'll confirm with them and send you the details.",
        timestamp: "2:40 PM",
        isOwn: false,
      },
    ]);
  }, [user, firstName]); // Add firstName as dependency

  const handleSendMessage = () => {
    if (!message.trim() || !user) return;

    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        senderName: "You",
        senderEmail: user.email ?? "",
        content: message,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isOwn: true,
      },
    ]);
    setMessage("");
  };

  return (
    <div className="flex flex-col h-[94vh] bg-slate-900 text-white">
      <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {agents
              .filter((agent) => agent.email?.toLowerCase() === AGENT_EMAIL.toLowerCase())
              .map((agent) => (
              <div key={agent.email} className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={agent.agentimage} alt="Agent avatar" />
                  <AvatarFallback className="bg-gradient-to-r from-teal-500 to-cyan-500">
                    {agent.firstname
                      ?.split(" ")
                      .map((s) => s[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase() ?? "AG"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{agent.firstname}</h3>
                  <p className="text-slate-400 text-sm flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                    Online
                  </p>
                </div>
              </div>
            ))}
            
            {agents.filter((agent) => agent.email?.toLowerCase() === AGENT_EMAIL.toLowerCase()).length === 0 && (
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gradient-to-r from-teal-500 to-cyan-500">
                    AG
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">Agent</h3>
                  <p className="text-slate-400 text-sm flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                    Online
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {[Phone, Video, Search, MoreVertical].map((Icon, i) => (
              <button key={i} className="p-2 hover:bg-slate-700/50 rounded-lg">
                <Icon className="w-5 h-5 text-slate-400" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
        {messages.map((msg) => {
          const avatarUrl = avatars[msg.senderEmail.toLowerCase()];
          const isOwn = msg.isOwn;
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${
                isOwn ? "justify-end" : "justify-start"
              }`}
            >
              {/* Vänster-avatar */}
              {!isOwn && (
                <Avatar className="w-8 h-8 flex-shrink-0">
                  {/* {agents ? ( */}
                  { agents.map((agent) => (
                    <AvatarImage src={agent.agentimage} alt="Avatar" />
                  ))}
                   : 
                   (
                     <AvatarFallback className="bg-gradient-to-r from-teal-500 to-cyan-500 text-xs font-semibold">
                     {msg.senderName
                      .split(" ")
                      .map((s) => s[0])
                      .join("")
                      .slice(0, 2)}
                      </AvatarFallback>
                  )
                </Avatar>
              )}

              {/* Bubblan */}
              <div
                className={`max-w-xs lg:max-w-md rounded-2xl p-4 ${
                  isOwn
                    ? "bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-tr-md"
                    : "bg-slate-800/60 backdrop-blur-sm border border-slate-700/30 text-white rounded-tl-md"
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <span
                  className={`text-xs mt-2 block ${
                    isOwn ? "text-teal-100" : "text-slate-400"
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {/* Höger-avatar */}
              {isOwn && (
                <Avatar className="w-8 h-8 flex-shrink-0">
                  {avatarUrl ? (
                    <AvatarImage src={avatarUrl} alt="Your avatar" />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-xs font-semibold">
                      {user?.email?.[0].toUpperCase() ?? "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
              )}
            </div>
          );
        })}
      </div>

      <div className="border-t border-slate-700/50 p-4 bg-slate-800/30 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <button className="p-2 hover:bg-slate-700/50 rounded-lg">
            <Paperclip className="w-5 h-5 text-slate-400" />
          </button>
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type your message…"
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 pr-12 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 backdrop-blur-sm resize-none"
              rows={1}
              style={{ minHeight: "44px", maxHeight: "120px" }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white p-3 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};