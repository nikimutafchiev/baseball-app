from models.models import User
from flask import request, Blueprint
from flask_jwt_extended import  create_access_token
from models.models import db
import bcrypt

auth_route_bp = Blueprint("auth_routes",__name__)

@auth_route_bp.route("/signup", methods=["POST"])
def signup():
    data = request.json    
    if "password" not in data or "username" not in data or "firstName" not in data or "lastName" not in data or "role" not in data:
        return {"message":"Invalid data"},400
    bytes = data["password"].encode('utf-8') 
    salt = bcrypt.gensalt() 
    hash = bcrypt.hashpw(bytes, salt) 

    if User.query.filter_by(username=data['username']).first():
        return "This username is taken",400
    new_user = User(username=data['username'],password=hash,first_name=data['firstName'], last_name= data['lastName'], role=data['role'])
    db.session.add(new_user)
    db.session.commit()
    return "",201

@auth_route_bp.route("/login",methods=["POST"])
def login():
    data = request.json
    if "username" not in data or "password" not in data:
        return {"message":"Invalid data"},400
    username = data['username']
    password = data['password']

    user = User.query.filter_by(username=username).first()
    
    if user and bcrypt.checkpw(password.encode('utf-8'),user.password):
        access_token = create_access_token(
            identity=str(user.id),
            additional_claims={"user":
                               {"id":user.id
                                ,"username":user.username,
                                "firstName":user.first_name,
                                "lastName":user.last_name
                                ,"role":user.role.value}})
        return {'access_token': access_token}
    else:
        return {},400
    

