from pydantic import BaseModel, EmailStr
from typing import Union, Literal
from datetime import datetime

class UserInCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr     
    password: str
    category: Literal["Medical Student", "Medical Professional", "Common People"]
    phone_number: Union[str, None] = None


class UserOutput(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    category: str
    phone_number: Union[str, None] = None
    created_at: datetime


class UserInUpdate(BaseModel):
    id: int
    first_name: Union[str, None] = None
    last_name: Union[str, None] = None              
    email: Union[EmailStr, None] = None
    password: Union[str, None] = None
    category: Union[Literal["Medical Student", "Medical Professional", "Common People"], None] = None
    phone_number: Union[str, None] = None


class UserInLogin(BaseModel):
    email: Union[EmailStr, None] = None
    phone_number: Union[str, None] = None
    password: str


class UserWithToken(BaseModel):
    token: str


