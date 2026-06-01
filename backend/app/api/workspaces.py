from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List
from app.database import get_db
from app.models.workspace import Workspace, WorkspaceMember
from app.models.user import User
from app.schemas.workspace import WorkspaceCreate, WorkspaceResponse, WorkspaceMemberInvite, WorkspaceMemberResponse

router = APIRouter(prefix="/workspaces", tags=["workspaces"])

@router.post("", response_model=WorkspaceResponse, status_code=status.HTTP_201_CREATED)
def create_workspace(request: WorkspaceCreate, db: Session = Depends(get_db)):
    existing = db.query(Workspace).filter(Workspace.slug == request.name.lower().replace(" ", "-")).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Workspace name already exists")
    
    workspace = Workspace(
        name=request.name,
        slug=request.name.lower().replace(" ", "-"),
        owner_id=1,
        plan="free",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.add(workspace)
    db.commit()
    db.refresh(workspace)
    
    return WorkspaceResponse.model_validate(workspace)

@router.get("", response_model=List[WorkspaceResponse])
def list_workspaces(db: Session = Depends(get_db)):
    workspaces = db.query(Workspace).all()
    return [WorkspaceResponse.model_validate(ws) for ws in workspaces]

@router.get("/{workspace_id}", response_model=WorkspaceResponse)
def get_workspace(workspace_id: int, db: Session = Depends(get_db)):
    workspace = db.query(Workspace).filter(Workspace.id == workspace_id).first()
    if not workspace:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workspace not found")
    return WorkspaceResponse.model_validate(workspace)

@router.get("/{workspace_id}/members", response_model=List[WorkspaceMemberResponse])
def list_members(workspace_id: int, db: Session = Depends(get_db)):
    members = db.query(WorkspaceMember).filter(
        WorkspaceMember.workspace_id == workspace_id,
        WorkspaceMember.status == "active"
    ).all()
    return [WorkspaceMemberResponse.model_validate(m) for m in members]

@router.post("/{workspace_id}/invite", status_code=status.HTTP_201_CREATED)
def invite_member(workspace_id: int, request: WorkspaceMemberInvite, db: Session = Depends(get_db)):
    workspace = db.query(Workspace).filter(Workspace.id == workspace_id).first()
    if not workspace:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workspace not found")
    
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    existing = db.query(WorkspaceMember).filter(
        WorkspaceMember.workspace_id == workspace_id,
        WorkspaceMember.user_id == user.id
    ).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="User already a member")
    
    member = WorkspaceMember(
        workspace_id=workspace_id,
        user_id=user.id,
        role=request.role,
        status="active",
        joined_at=datetime.utcnow()
    )
    db.add(member)
    db.commit()
    
    return {"message": "Member invited successfully"}
