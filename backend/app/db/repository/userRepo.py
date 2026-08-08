from .base import BaseRepository
from app.db.schema.user import UserInCreate
from app.db.models.user import User


class UserRepository(BaseRepository):
    def create_user(self, user_data: UserInCreate):
        newUser = User(**user_data.model_dump(exclude_none=True))
        self.session.add(instance=newUser)
        self.session.commit()
        self.session.refresh(instance=newUser)
        return newUser


    def user_exist_by_email(self, email: str) -> bool:
        user = self.session.query(User).filter_by(email=email).first()
        return bool(user)

    def user_get_by_email(self, email: str) -> User:
        user = self.session.query(User).filter_by(email=email).first()
        return user

    def user_exist_by_phone(self, phone_number: str) -> bool:
        user = self.session.query(User).filter_by(phone_number=phone_number).first()
        return bool(user)

    def user_get_by_phone(self, phone_number: str) -> User:
        user = self.session.query(User).filter_by(phone_number=phone_number).first()
        return user

    def user_get_by_id(self, user_id: int) -> User:
        user = self.session.query(User).filter_by(id=user_id).first()
        return user