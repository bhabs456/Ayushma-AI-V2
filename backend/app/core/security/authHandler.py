import time

import jwt
from decouple import config

JWT_SECRET_KEY = config("JWT_SECRET_KEY")
JWT_ALGORITHM = config("JWT_ALGORITHM", default="HS256")

class AuthHandler:

    @staticmethod
    def sign_jwt(user_id: int):
        payload = {
            "user_id": user_id,
            "expires": time.time() + 900
        }


        token = jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
        return token

    @staticmethod
    def decode_jwt(token: str) -> dict:
        try:
            decoded_token = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
            return decoded_token if decoded_token["expires"] >= time.time() else None

        except:  # noqa: E722
            print("Unable to decode JWT token.")
            return None