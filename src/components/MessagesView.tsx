import React, { useState } from 'react';
import { ArrowLeft, MessageSquare, Send, CheckCheck } from 'lucide-react';
import type { User } from '../types';

interface MessagesViewProps {
  currentUser: User;
  onBack: () => void;
  onUserClick: (userId: number) => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  currentUser,
  onBack,
  onUserClick,
}) => {
  const [conversations, setConversations] = useState([
    {
      id: 1,
      userId: 2,
      name: 'Michael Williams',
      handle: '@michaelw',
      avatar: 'https://dummyjson.com/icon/michaelw/128',
      lastMessage: 'Hey Emily, loved the new Figma layout implementation!',
      time: '12m ago',
      unread: true,
      messages: [
        { sender: 'other', text: 'Hey Emily, how is the Chirp project coming along?', time: '10:30 AM' },
        { sender: 'me', text: 'Hey Michael! Going super smooth. Tailwind and infinite scrolling are locked in.', time: '10:32 AM' },
        { sender: 'other', text: 'Hey Emily, loved the new Figma layout implementation!', time: '10:35 AM' },
      ],
    },
    {
      id: 2,
      userId: 3,
      name: 'Sophia Brown',
      handle: '@sophiab',
      avatar: 'https://dummyjson.com/icon/sophiab/128',
      lastMessage: 'Let’s sync on the responsive drawer styles tomorrow.',
      time: '1h ago',
      unread: false,
      messages: [
        { sender: 'other', text: 'Let’s sync on the responsive drawer styles tomorrow.', time: '9:15 AM' },
      ],
    },
  ]);

  const [activeConvId, setActiveConvId] = useState(1);
  const [inputText, setInputText] = useState('');

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConvId) {
          return {
            ...c,
            lastMessage: inputText,
            time: 'Just now',
            messages: [
              ...c.messages,
              { sender: 'me', text: inputText, time: 'Just now' },
            ],
          };
        }
        return c;
      })
    );
    setInputText('');
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-card border border-gray-100 dark:border-slate-700/60">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-2 py-1 text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-[#00B59C]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="h-4 w-px bg-gray-200 dark:bg-slate-700" />
          <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#00B59C]" />
            <span>Direct Messages</span>
          </h2>
        </div>
        <span className="text-xs text-gray-400">
          Chatting as @{currentUser.username}
        </span>
      </div>

      {/* Main Messaging Interface */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-card border border-gray-100 dark:border-slate-700/60 overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[480px]">
        {/* Conversations List */}
        <div className="border-r border-gray-100 dark:border-slate-700/60 divide-y divide-gray-100 dark:divide-slate-700/60">
          <div className="p-3 bg-gray-50/60 dark:bg-slate-700/30 text-xs font-bold uppercase tracking-wider text-gray-400">
            Inbox
          </div>
          {conversations.map((c) => (
            <div
              key={c.id}
              onClick={() => setActiveConvId(c.id)}
              className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                c.id === activeConvId
                  ? 'bg-[#00B59C]/10 border-l-4 border-[#00B59C]'
                  : 'hover:bg-gray-50 dark:hover:bg-slate-700/40'
              }`}
            >
              <img
                src={c.avatar}
                alt={c.name}
                className="w-10 h-10 rounded-full bg-gray-100 object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                    {c.name}
                  </h4>
                  <span className="text-[10px] text-gray-400">{c.time}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                  {c.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Active Chat Conversation */}
        <div className="md:col-span-2 flex flex-col justify-between h-[480px] bg-gray-50/40 dark:bg-slate-800/40">
          {/* Active Chat Header */}
          <div className="p-3.5 border-b border-gray-100 dark:border-slate-700/60 bg-white dark:bg-slate-800 flex items-center justify-between">
            <div
              onClick={() => onUserClick(activeConv.userId)}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <img
                src={activeConv.avatar}
                alt={activeConv.name}
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                  {activeConv.name}
                </h4>
                <p className="text-xs text-gray-400">{activeConv.handle} • Active now</p>
              </div>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="p-4 space-y-3 overflow-y-auto flex-1">
            {activeConv.messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  m.sender === 'me' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-xs sm:max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    m.sender === 'me'
                      ? 'bg-[#00B59C] text-white rounded-br-none shadow-sm'
                      : 'bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-100 rounded-bl-none shadow-sm border border-gray-100 dark:border-slate-600/60'
                  }`}
                >
                  {m.text}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1 px-1">
                  <span>{m.time}</span>
                  {m.sender === 'me' && <CheckCheck className="w-3 h-3 text-[#00B59C]" />}
                </div>
              </div>
            ))}
          </div>

          {/* Send Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700/60 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Write a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600/60 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B59C]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-[#00B59C] hover:bg-[#009d87] text-white disabled:opacity-40 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
