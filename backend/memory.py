import json
import os

MEMORY_FILE = "memory.json"

def load_memory(user_id):
    if os.path.exists(MEMORY_FILE):
        with open(MEMORY_FILE) as f:
            data = json.load(f)
        return data.get(user_id, {"facts": [], "events": []})
    return {"facts": [], "events": []}

def save_memory(user_id, memory):
    data = {}
    if os.path.exists(MEMORY_FILE):
        with open(MEMORY_FILE) as f:
            data = json.load(f)
    data[user_id] = memory
    with open(MEMORY_FILE, "w") as f:
        json.dump(data, f, indent=2)

def extract_memory(user_id, message):
    memory = load_memory(user_id)
    msg = message.lower()

    # Name
    if "my name is" in msg:
        name = msg.split("my name is")[-1].strip().split()[0]
        memory["facts"].append(f"User's name is {name.title()}")

    # Location
    if "i live in" in msg:
        place = msg.split("i live in")[-1].strip()
        memory["facts"].append(f"User lives in {place.title()}")
    if "i'm from" in msg:
        place = msg.split("i'm from")[-1].strip()
        memory["facts"].append(f"User is from {place.title()}")

    # Age
    if "i'm " in msg and "years old" in msg:
        age = msg.split("i'm ")[-1].split(" years old")[0].strip()
        memory["facts"].append(f"User is {age} years old")

    # Job/school
    if "i study" in msg or "i work at" in msg or "i'm a " in msg:
        memory["events"].append(f"User mentioned: {message[:80]}")

    # Emotional events
    if any(w in msg for w in ["fight", "argued", "broke up", "fired", "failed", "rejected"]):
        memory["events"].append(f"User was upset about: {message[:80]}")

    # Keep last 15 of each
    memory["facts"] = memory["facts"][-15:]
    memory["events"] = memory["events"][-15:]

    save_memory(user_id, memory)
    return memory

def get_memory_context(user_id):
    memory = load_memory(user_id)
    if not memory["facts"] and not memory["events"]:
        return "I don't know much about them yet."

    context = ""
    if memory["facts"]:
        context += "What I know: " + "; ".join(memory["facts"][-5:]) + ". "
    if memory["events"]:
        context += "Things they told me: " + "; ".join(memory["events"][-3:]) + ". "
    return context   