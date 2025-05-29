from models.models import Player,GameTeam
from flask import request, Blueprint
from flask_jwt_extended import  jwt_required
from functions.functions import id_in_list,merge_dicts,get_stats
from datetime import date
from models.models import db

player_route_bp = Blueprint("player_routes",__name__)


@player_route_bp.route("/player",methods=['POST'])
@jwt_required()
def add_player():
    data = request.json

    if "firstName" not in data or "lastName" not in data or  "dateOfBirth" not in data or "height" not in data or "weigth" not in data or "throwingArm" not in data or"battingSide" not in data or "gender" not in data or "country" not in data or "image" not in data:
        return {"message":"Invalid data type"},400
    
    new_player = Player(first_name=data['firstName'],last_name=data['lastName'],date_of_birth= date(int(data['dateOfBirth']["year"]),int(data['dateOfBirth']["month"]),int(data['dateOfBirth']["day"])), height=data['height'],weigth = data['weigth'], throwing_arm = data['throwingArm'], batting_side=data["battingSide"], gender=data['gender'],country=data['country'],image=data['image'])
    db.session.add(new_player)
    db.session.commit()
    return "Successfully added player",201

@player_route_bp.route("/<int:player_id>",methods=["PATCH"])
@jwt_required()
def edit_player(player_id):
    data = request.json
    player = db.session.get(Player,player_id)
    player.country = data["country"]
    db.session.commit()

    return "Successfully edited player"


@player_route_bp.route("/players",methods=['GET'])
def get_players():
    players = Player.query.all()
    res = [{
        'id':player.id,
        'firstName': player.first_name,
        'lastName': player.last_name,
        'dateOfBirth': player.date_of_birth,
        'height': player.height,
        'weigth': player.weigth,
        'throwingArm':player.throwing_arm.value if player.throwing_arm else "",
        'battingSide':player.batting_side.value if player.batting_side else "",
        "gender":player.gender.value if player.gender else "",
        "country":player.country,
        "image":player.image
    } for player in players]
    return res,200

@player_route_bp.route("/<int:player_id>",methods=['GET'])
def get_player_by_id(player_id):
    player = db.session.get(Player,player_id)
    if player == None:
        return {"Error":"Invalid player id"},400
    return {
        'id':player.id,
        'firstName': player.first_name,
        'lastName': player.last_name,
        'dateOfBirth': player.date_of_birth,
        'height': player.height,
        'weigth': player.weigth,
        'throwingArm':player.throwing_arm.value if player.throwing_arm else "",
        'battingSide':player.batting_side.value if player.batting_side else "",
        "gender":player.gender.value if player.gender else "",
        "country":player.country,
        "image":player.image
    }


@player_route_bp.route("/<int:player_id>/teams/",methods=["GET"])
def get_player_teams(player_id):
    query = request.args.to_dict()
    year_ids = eval(str(query.get("year_ids")))
    tournament_ids = eval(str(query.get("tournament_ids")))
    player = db.session.get(Player,player_id)
    if player == None:
        return {},400
    res = []
    for team_tournament in player.teams_tournaments:
        if tournament_ids and team_tournament.team_tournament.tournament_id in tournament_ids or not tournament_ids:
            if id_in_list(team_tournament.team_tournament.team.id,res) == None:
                res.append({
                'id':team_tournament.team_tournament.team.id,
                'name': team_tournament.team_tournament.team.name,
                })
    return res

@player_route_bp.route("/<int:player_id>/tournaments/",methods=["GET"])
def get_player_tournaments(player_id):
    query = request.args.to_dict()
    year_ids = eval(str(query.get("year_ids")))
    team_ids = eval(str(query.get("team_ids")))
    player = db.session.get(Player,player_id)
    if player == None:
        return {},400
    res = []
    for team_tournament in player.teams_tournaments:
         if team_ids and team_tournament.team_tournament.team_id in team_ids or not team_ids:
            res.append({
            'id':team_tournament.team_tournament.tournament.id,
            'name': team_tournament.team_tournament.tournament.name,
            })
    return res

@player_route_bp.route("/<int:player_id>/years/",methods=["GET"])
def get_player_years(player_id):
    query = request.args.to_dict()
    team_ids = eval(str(query.get("team_ids")))
    tournament_ids = eval(str(query.get("tournament_ids")))
    player = db.session.get(Player,player_id)
    if player == None:
        return {},400
    res = set()
    for team_tournament in player.teams_tournaments:
        if (team_ids and team_tournament.team_tournament.team_id in team_ids) or (tournament_ids and team_tournament.team_tournament.tournament_id in tournament_ids) or (not team_ids and not tournament_ids):

            for gameTeam in team_tournament.team_tournament.games:
                res.add(gameTeam.game.start_time.year)
    return list(res)

@player_route_bp.route("/<int:player_id>/stats/",methods=["GET"])
def get_player_stats(player_id):
    query = request.args.to_dict()
    team_ids = eval(str(query.get("team_ids")))
    tournament_ids = eval(str(query.get("tournament_ids")))
    game_id = query.get("game_id")
    years = eval(str(query.get("years")))
    player = db.session.get(Player,player_id)
    if player == None:
        return {},400
    res = {}
    merge_dicts(get_stats([],None),res)
    for team_tournament in player.teams_tournaments:
        if (team_ids and team_tournament.team_tournament.team_id in team_ids and not tournament_ids) or (tournament_ids and team_tournament.team_tournament.tournament_id in tournament_ids and not team_ids) or (tournament_ids and team_tournament.team_tournament.tournament_id in tournament_ids and team_ids and team_tournament.team_tournament.team_id in team_ids)or (not team_ids and not tournament_ids):
           for gameTeam in team_tournament.team_tournament.games:
                if game_id and gameTeam.game_id == game_id or not game_id or years and gameTeam.game.start_time.year in years:
                    res["G"]+=1
                    merge_dicts(get_stats(gameTeam.game.situations,player.id),res)
                             
                    
    res["AVG"] = res["H"]/res["AB"] if res["AB"] != 0 else 0
    res["OBP"] = (res["H"]+res["BB"]+res["HBP"])/res["PA"] if res["PA"] != 0 else 0
    res["SLG"] = res["TB"]/res["AB"] if res["AB"] != 0 else 0
    res["OPS"] = (res["OBP"]+res["SLG"])/2
    res["FIP"] = (res["PO"]+res["A"])/res['TC'] if res["TC"] != 0 else 0
    res["BABIP"] = (res["H"] - res["HR"])/(res["AB"] - res["SO"] - res["HR"] + res["SF"]) if res["AB"] - res["SO"] - res["HR"] + res["SF"] != 0 else 0
    res["RC"] = res["TB"]*(res["H"] + res["BB"]) / (res["AB"] + res["BB"]) if res["AB"] + res["BB"] != 0 else 0
    return res



@player_route_bp.route("/<int:player_id>/games_stats/",methods=["GET"])
def get_player_games_stats(player_id):
    query = request.args.to_dict()
    team_ids = eval(str(query.get("team_ids")))
    tournament_ids = eval(str(query.get("tournament_ids")))
    years = eval(str(query.get("years")))
    player = db.session.get(Player,player_id)
    if player == None:
        return {},400
    res = []
    for team_tournament in player.teams_tournaments:
        if (team_ids and team_tournament.team_tournament.team_id in team_ids and not tournament_ids) or (tournament_ids and team_tournament.team_tournament.tournament_id in tournament_ids and not team_ids) or (tournament_ids and team_tournament.team_tournament.tournament_id in tournament_ids and team_ids and team_tournament.team_tournament.team_id in team_ids)or (not team_ids and not tournament_ids):
            for gameTeam in team_tournament.team_tournament.games:
                if years and gameTeam.game.start_time.year in years or not years:
                    game_stats = {
                    }
                    merge_dicts(get_stats(gameTeam.game.situations,player_id),game_stats)
                    game_stats["AVG"] = game_stats["H"]/game_stats["AB"] if game_stats["AB"] != 0 else 0
                    game_stats["OBP"] = (game_stats["H"]+game_stats["BB"]+game_stats["HBP"])/game_stats["PA"] if game_stats["PA"] != 0 else 0
                    game_stats["SLG"] = (game_stats["1B"] + 2*game_stats["2B"] + 3*game_stats["3B"] + 4*game_stats["HR"])/game_stats["AB"] if game_stats["AB"] != 0 else 0
                    game_teams = GameTeam.query.filter_by(game_id = gameTeam.game.id).all();
                    home_team = list(filter(lambda x: x.home_away.value == "home",game_teams))[0]
                    away_team = list(filter(lambda x: x.home_away.value == "away",game_teams))[0]
                    res.append({
                        "id":gameTeam.game.id,
                        "homeTeam":home_team.team_tournament.team.name,
                        "awayTeam":away_team.team_tournament.team.name,
                        "startTime":gameTeam.game.start_time,
                        "stats":game_stats
                        })
                            
    return res