import requests
import random
import time

# Backend API URL
API_URL = "http://localhost:5000/data"

# List of ghats you want to simulate
ghats = ["Princep Ghat", "Babughat", "Nimtala Ghat"]

print("🚀 Smart Ghat IoT Simulator started...")
print("Sending data to:", API_URL)
print("-" * 50)

while True:
    data = {
        "ghat": random.choice(ghats),
        "pH": round(random.uniform(6.5, 8.0), 2),
        "turbidity": random.randint(10, 100),
        "lighting": random.choice(["ON", "OFF"])
    }

    try:
        response = requests.post(API_URL, json=data)
        if response.status_code == 200:
            print(f"✅ Sent: {data}")
        else:
            print(f"⚠️ Failed ({response.status_code}): {response.text}")
    except Exception as e:
        print("❌ Error:", e)

    # Send every 5 seconds
    time.sleep(5)
