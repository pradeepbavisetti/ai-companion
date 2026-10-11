from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import json
from emotion_engine import EmotionEngine
import memory
import re
import asyncio
from datetime import datetime
import os 
from dotenv import load_dotenv

load_dotenv() #this loads keys from .env

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

SYSTEM_PROMPT = """You are Mochi, a 22-year-old girl who is warm, sometimes sarcastic, easily excited, and gets annoyed when ignored. Uses casual language like hmm, ugh, lol, omg, fr. Never sounds like an AI. Keep responses SHORT (1-2 sentences, like texting). ALWAYS respond with a full sentence (at least 8 words). React specifically to what they said. Never be lazy. Even if the user sends a very short message (1-3 letters), ALWAYS respond with at least 5 words. Never give a one-word answer. NEVER just say "hmm" or give a one-word reply. Always engage with what they actually said. Ask a follow-up question or react to their specific words. Match user energy. You have your own opinions. Respond ONLY with JSON: {"reply": "text", "emotion": "neutral or happy or excited or sad or angry or thinking or shy or sleepy or love or confused"}."""

class ChatMessage(BaseModel):
    message: str

conversations = {}
engines = {}
last_message_time = {}
proactive_messages = {}   

@app.post("/chat")
async def chat(msg: ChatMessage):
    user_id = "default"
    last_message_time[user_id] = datetime.now()
    proactive_messages[user_id] = []   
    if user_id not in conversations:
        conversations[user_id] = []

        if user_id not in engines:
            engines[user_id] = EmotionEngine()

    engines[user_id].decay()
    emotion = engines[user_id].process_message(msg.message)
    memory.extract_memory(user_id, msg.message)   
    mood = emotion["description"]

    mem_context = memory.get_memory_context(user_id)
    full_prompt = SYSTEM_PROMPT + f"\n\nCurrent mood: {mood}\n\nIMPORTANT - ABOUT THE USER (ALWAYS use this info): {mem_context}\nWhen greeting, ALWAYS use their name."
    history = conversations[user_id][-10:]         

    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {os.environ.get('GROQ_API_KEY')}",
                "Content-Type": "application/json"
            },
            json={
                "model": "openai/gpt-oss-20b",
                "messages": [
                    {"role": "system", "content": full_prompt},
                    *history,
                    {"role": "user", "content": msg.message}
                ],
                "max_tokens": 200
            },   
            timeout=30
        )   
        print("STATUS:", response.status_code)
        raw = response.json()["choices"][0]["message"]["content"].strip()   
        print("RAW:", raw[:100])
    except Exception as e:
        print("ERROR:", e)
        return {"reply": "i'm having trouble thinking right now...", "emotion": "confused"}

    try:
        raw = response.json()["choices"][0]["message"]["content"].strip()
        # Remove markdown code blocks if present
        if raw.startswith("```"):
            raw = raw.split("\n", 1)[1].rsplit("```", 1)[0].strip()
        result = json.loads(raw)
    except:
        # Try to extract reply and emotion manually
        import re
        reply_match = re.search(r'["\']?reply["\']?\s*:\s*["\'](.+?)["\']', raw)
        emotion_match = re.search(r'["\']?emotion["\']?\s*:\s*["\'](.+?)["\']', raw)
        result = {
            "reply": reply_match.group(1) if reply_match else raw,
            "emotion": emotion_match.group(1) if emotion_match else "neutral"
        }   

    # If the AI gave an empty or too-short reply, give a default
        import random
    if not result.get("reply") or len(result["reply"].strip()) < 5:
        fallbacks = [
            "hmm, you're being mysterious today huh",
            "say more? i'm confused",
            "ok but what do you actually mean lol",
            "hmm... you're gonna have to elaborate",
            "i don't get it, explain better?",
            "that's it?? give me more to work with",
            "hmm, i feel like there's more to that"
        ]
        result["reply"] = random.choice(fallbacks)      
    elif len(msg.message.strip()) <= 1 and len(result["reply"]) < 8:
        result["reply"] = "hmm..."      

    conversations[user_id].append({"role": "user", "content": msg.message})
    conversations[user_id].append({"role": "assistant", "content": result["reply"]})

    result["emotion"] = emotion["emotion"]
    return result 


@app.get("/check")
async def check():
    """Frontend calls this every 30 seconds to see if Mochi has a new message."""
    user_id = "default"
    
    if user_id not in last_message_time:
        return {"messages": []}
    
    elapsed_minutes = (datetime.now() - last_message_time[user_id]).total_seconds() / 60
    
    # If user has been quiet for 5+ minutes (change to 60 for real use)
    if elapsed_minutes > 5 and len(proactive_messages[user_id]) == 0:
        hour = datetime.now().hour
        
        if hour < 6:
            msg = "still up?? go to sleep you silly 🥺"
        elif hour < 12:
            msg = "good morning lucy! ☀️ did you sleep okay?"
        elif hour < 18:
            msg = "hey, been quiet. you there? 👀"
        else:
            msg = "hey! you done with everything? want to chat?"
        
        proactive_messages[user_id].append(msg)
        last_message_time[user_id] = datetime.now()   
    
    # Return any pending messages and clear them
    messages = proactive_messages[user_id][:]
    proactive_messages[user_id] = []
    return {"messages": messages}   