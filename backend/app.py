from flask import Flask
from flask_cors import CORS

from flask_jwt_extended import  JWTManager
from models.models import db

from routes.auth_routes import auth_route_bp
from routes.game_routes import game_route_bp
from routes.player_routes import player_route_bp
from routes.schedule_routes import schedule_route_bp
from routes.team_routes import team_route_bp
from routes.tournament_routes import tournament_route_bp

from sqlalchemy import text
from datetime import timedelta
import uuid

import os
from dotenv import load_dotenv
load_dotenv()


app = Flask(__name__)

app.config['SECRET_KEY'] = uuid.uuid4().hex

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"


app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=int(os.getenv("JWT_EXPIRATION")))

CORS(app)

db.init_app(app)

app.register_blueprint(player_route_bp,url_prefix="/player")
app.register_blueprint(auth_route_bp,url_prefix="/auth")
app.register_blueprint(game_route_bp,url_prefix="/game")

app.register_blueprint(schedule_route_bp,url_prefix="/schedule")
app.register_blueprint(team_route_bp,url_prefix="/team")
app.register_blueprint(tournament_route_bp,url_prefix="/tournament")

jwt = JWTManager(app)

with app.app_context():
    db.create_all()
    

if __name__ == "__main__":
    app.run(host="localhost",port=6363,debug=True)
