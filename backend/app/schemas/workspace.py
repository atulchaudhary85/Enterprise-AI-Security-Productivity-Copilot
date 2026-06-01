from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class WorkspaceCreate(BaseModel):
    name: str

class WorkspaceUpdate(BaseModel):
    name: Optional[str] = None
    plan: Optional[str] = None

class WorkspaceResponse(BaseModel):
    id: int
    name: str
    slug: str
    owner_id: int
    plan: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class WorkspaceMemberInvite(BaseModel):
    email: str
    role: str = "employee"

class WorkspaceMemberResponse(BaseModel):
    id: int
    workspace_id: int
    user_id: int
    role: str
    status: str
    joined_at: datetime
    
    class Config:
        from_attributes = True
