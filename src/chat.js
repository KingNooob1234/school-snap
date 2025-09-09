import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cugckaisotunlwnqgodx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1Z2NrYWlzb3R1bmx3bnFnb2R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MDE4OTUsImV4cCI6MjA3Mjk3Nzg5NX0.wK3HiKNOr69_vYN4OEbIqf-6fSiany3_8ags3B44dQE';

const supabase = createClient(supabaseUrl, supabaseKey);

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) {
        console.error('Error loading messages:', error);
      } else {
        setMessages(data);
      }
    };

    loadMessages();

    const channel = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const { error } = await supabase.from('messages').insert([{ text: input }]);
    if (error) {
      console.error('Error sending message:', error);
    } else {
      setInput('');
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: '40px auto',
        padding: 0,
        fontFamily: 'Segoe UI, Arial, sans-serif',
        background: 'linear-gradient(180deg, #FFFC00 0%, #FFD600 100%)',
        borderRadius: 24,
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        border: '2px solid #FFFC00',
        minHeight: 500,
        position: 'relative',
      }}
    >
      <div
        style={{
          background: '#FFFC00',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: '24px 0 8px 0',
          textAlign: 'center',
          borderBottom: '2px solid #FFD600',
        }}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/en/thumb/c/c4/Snapchat_logo.svg/1200px-Snapchat_logo.svg.png"
          alt="Snapchat"
          style={{ width: 48, height: 48, marginBottom: 8 }}
        />
        <h2 style={{ margin: 0, fontWeight: 700, fontSize: 28, color: '#222' }}>SchoolSnap</h2>
      </div>
      <ul
        style={{
          maxHeight: 320,
          overflowY: 'auto',
          padding: '16px',
          margin: 0,
          listStyle: 'none',
          background: 'rgba(255,255,255,0.85)',
          borderRadius: 16,
          marginLeft: 16,
          marginRight: 16,
          marginTop: 16,
          marginBottom: 0,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}
      >
        {messages.map((msg) => (
          <li
            key={msg.id}
            style={{
              marginBottom: 12,
              padding: '10px 16px',
              background: '#fff',
              borderRadius: 18,
              boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
              fontSize: 16,
              color: '#222',
              alignSelf: 'flex-start',
              maxWidth: '80%',
              wordBreak: 'break-word',
            }}
          >
            {msg.text}
          </li>
        ))}
      </ul>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          padding: '18px 24px',
          background: 'rgba(255,255,255,0.95)',
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          borderTop: '2px solid #FFD600',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <input
          type="text"
          placeholder="Type a message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') sendMessage();
          }}
          style={{
            flex: 1,
            padding: '10px 16px',
            fontSize: 16,
            borderRadius: 18,
            border: '1px solid #FFD600',
            outline: 'none',
            marginRight: 12,
            background: '#FFF',
            boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: '10px 24px',
            fontSize: 16,
            borderRadius: 18,
            background: '#FFFC00',
            color: '#222',
            fontWeight: 700,
            border: '2px solid #FFD600',
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

