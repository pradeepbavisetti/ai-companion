import time

class EmotionEngine:
    def __init__(self):
        self.valence = 0.0    # -1 (terrible) to +1 (amazing)
        self.arousal = 0.3    # 0 (calm) to 1 (intense)
        self.last_update = time.time()

    def process_message(self, message: str) -> dict:
        msg = message.lower()

        # Positive
        if any(w in msg for w in ['love', 'happy', 'great', 'awesome', 'yay', 'good', 'fun', 'gift', 'accepted']):
            self.valence = min(1.0, self.valence + 0.3)
            self.arousal = min(1.0, self.arousal + 0.2)

        # Negative
        if any(w in msg for w in ['sad', 'bad', 'hate', 'awful', 'terrible', 'cry', 'upset', 'depressed']):
            self.valence = max(-1.0, self.valence - 0.3)
            self.arousal = min(1.0, self.arousal + 0.1)

        # Excitement
        if any(w in msg for w in ['omg', 'wow', 'no way', '!!', 'yesss', 'excited']):
            self.arousal = min(1.0, self.arousal + 0.4)
            self.valence = min(1.0, self.valence + 0.2)

        # Rudeness (makes her angry)
        if any(w in msg for w in ['stupid', 'idiot', 'shut up', 'annoying', 'whatever', 'ugh']):
            self.valence = max(-1.0, self.valence - 0.4)
            self.arousal = min(1.0, self.arousal + 0.3)

        # Very short message (she gets a bit bored)
        if len(msg) < 5:
            self.arousal = max(0.1, self.arousal - 0.1)

        self.last_update = time.time()
        return self.get_emotion()

    def decay(self):
        """Emotions fade over time. Call this on every request."""
        elapsed = (time.time() - self.last_update) / 60  # minutes
        fade = min(1.0, elapsed * 0.05)  # 5% per minute
        self.valence *= (1 - fade)
        self.arousal = max(0.1, self.arousal * (1 - fade))

    def get_emotion(self) -> dict:
        if self.valence > 0.4 and self.arousal > 0.5 :
            return {"emotion": "excited", "description": "super excited and bouncy"}
        elif self.valence > 0.4:
            return {"emotion": "happy", "description": "feeling warm and happy"}
        elif self.valence < -0.5 and self.arousal > 0.5:
            return {"emotion": "angry", "description": "feeling annoyed and irritated"}
        elif self.valence < -0.3:
            return {"emotion": "sad", "description": "feeling a bit down and quiet"}
        elif self.arousal < 0.15:
            return {"emotion": "sleepy", "description": "feeling sleepy and a bit bored"}
        elif self.valence > 0.2 and self.arousal < 0.3:
            return {"emotion": "shy", "description": "feeling a little shy and soft"}
        elif self.arousal > 0.6:
            return {"emotion": "thinking", "description": "deep in thought, a bit intense"}
        else:
            return {"emotion": "neutral", "description": "just vibing, feeling okay"}

    def get_prompt_line(self) -> str:
        e = self.get_emotion()
        return f"CURRENT MOOD: {e['description']}"   