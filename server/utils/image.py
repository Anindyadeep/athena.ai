import base64
import requests


def text_to_image(prompt):

    response = requests.post(
        "https://api.stability.ai/v1/generation/stable-diffusion-v1-5/text-to-image",
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Bearer sk-HqppqkuKYv1kJvCvdeGbwKtTXGzBxCBdbkEZxlSw9TL53JX0"
        },
        json={
            "text_prompts": [
                {
                    "text": prompt
                }
            ]
            },
    )
    if response.status_code != 200:
        return "err"

    try:
        data = response.json()
        with open(f"./img.png", "wb") as f:
            f.write(base64.b64decode(data["artifacts"][0]["base64"]))
        return "./img.png"
    except:
        return "err1"

print(text_to_image("A simple illustration of french revolution"))