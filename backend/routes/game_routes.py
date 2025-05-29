from models.models import  Game, User, UserGame, GameTeam,TeamTournamentPlayer,GameTeamTeamTournamentPlayer,Situation,TeamTournament
from models.enums import GameStatuses
from flask import request, Blueprint
from flask_jwt_extended import jwt_required
from functions.functions import merge_dicts,get_stats
from models.models import db

game_route_bp = Blueprint("game_routes",__name__)

@game_route_bp.route("/assign/", methods=["POST"])
@jwt_required()
def assign_game():
    query = request.args.to_dict()
    if "game_id" not in query or "username" not in query:
        return {"message":"Invalid query paramters"},400
    game = db.session.get(Game,query["game_id"])
    user = User.query.filter_by(username=query["username"]).first()
    if not user:
        return {"message":"There is no such user"}
    gameUser = UserGame.query.filter_by(game_id = query["game_id"],user_id = user.id).first()
    if gameUser:
        if not gameUser.is_assigned and not gameUser.is_to_do:
            gameUser.is_assigned =  True
            db.session.commit()
            return {"message":"Successfully assigned game"}
        elif gameUser.is_assigned:
            gameUser.is_assigned = False
            db.session.commit()
            return {"message":"Successfully unassigned game"}
        else:
            return {"message":"Game is already accepted by the user"}
    else:
        user_game_association = UserGame(game=game,user=user,is_assigned=True,assigner_id=query["assigner_id"])
        db.session.add(user_game_association)
        db.session.commit()
    return {"message":"Successfully assigned game"}

@game_route_bp.route("/assigned_games/",methods=["GET"])
def get_assigned_games():
    query = request.args.to_dict()
    if "user_id" not in query:
        return {"message":"Invalid query parameters"},400
    userGames = UserGame.query.filter_by(user_id = query["user_id"]).all()
    res=[]
    for userGame in userGames:
        if userGame.is_assigned:
            game_teams = GameTeam.query.filter_by(game_id = userGame.game.id).all();
            home_team = list(filter(lambda x: x.home_away.value == "home",game_teams))[0]
            away_team = list(filter(lambda x: x.home_away.value == "away",game_teams))[0]
            assigner = db.session.get(User,userGame.assigner_id)
            res.append({
            'id':userGame.game.id,
            'homeTeam': home_team.team_tournament.team.name,
            "awayTeam":away_team.team_tournament.team.name,
            "homeTeamImage": home_team.team_tournament.team.image,
            "awayTeamImage": away_team.team_tournament.team.image,
            "startTime": userGame.game.start_time,
            "status": userGame.game.status.value,
            "homeResult":home_team.result,
            "awayResult": away_team.result,
            "venue": userGame.game.venue,
            "venueLink": userGame.game.venue_link,
            "assigner": assigner.first_name+" "+ assigner.last_name
            })
    return res,200

@game_route_bp.route("/to_do/", methods=["POST"])
@jwt_required()
def to_do_game():
    query = request.args.to_dict()
    if "user_id" not in query or "game_id" not in query:
        return {"message":"Invalid query parameters"},400
    game = db.session.get(Game,query["game_id"])
    user = db.session.get(User,query["user_id"])
    gameUser = UserGame.query.filter_by(game_id = query["game_id"],user_id = query["user_id"]).first()
    if gameUser:
        gameUser.is_to_do =  not gameUser.is_to_do
        gameUser.is_assigned = False
        db.session.commit()
    else:
        user_game_association = UserGame(game=game,user=user,is_assigned=True)
        db.session.add(user_game_association)
        db.session.commit()
    return ""

@game_route_bp.route("/to_do_games/",methods=["GET"])
def get_to_do_games():
    query = request.args.to_dict()
    if "user_id" not in query:
        return {"message":"Invalid query parameters"},400
    userGames = UserGame.query.filter_by(user_id = query["user_id"]).all()
    res=[]
    for userGame in userGames:
        if userGame.is_to_do:
            game_teams = GameTeam.query.filter_by(game_id = userGame.game.id).all();
            home_team = list(filter(lambda x: x.home_away.value == "home",game_teams))[0]
            away_team = list(filter(lambda x: x.home_away.value == "away",game_teams))[0]
            res.append({
            'id':userGame.game.id,
            'homeTeam': home_team.team_tournament.team.name,
            "awayTeam":away_team.team_tournament.team.name,
            "homeTeamImage": home_team.team_tournament.team.image,
            "awayTeamImage": away_team.team_tournament.team.image,
            "startTime": userGame.game.start_time,
            "status": userGame.game.status.value,
            "homeResult":home_team.result,
            "awayResult": away_team.result,
            "venue": userGame.game.venue,
            "venueLink": userGame.game.venue_link
            })
    return res,200

@game_route_bp.route("/like/",methods=["POST"])
@jwt_required()
def like_game():
    query = request.args.to_dict()
    if "game_id" not in query or "user_id" not in query:
        return {"message":"Invalid query parameters"},400
    game = db.session.get(Game,query["game_id"])
    user = db.session.get(User,query["user_id"])
    gameUser = UserGame.query.filter_by(game_id = query["game_id"],user_id = query["user_id"]).first()
    if gameUser:
        gameUser.is_liked =  not gameUser.is_liked
        db.session.commit()
    else:
        user_game_association = UserGame(game=game,user=user,is_liked=True)
        db.session.add(user_game_association)
        db.session.commit()
    return "Succefully liked/disliked game"

@game_route_bp.route("/liked_games/",methods=["GET"])
def get_liked_games():
    query = request.args.to_dict()
    if "user_id" not in query:
        return {"message":"Invalid query parameters"},400
    userGames = UserGame.query.filter_by(user_id = query["user_id"]).all()
    res=[]
    for userGame in userGames:
        if userGame.is_liked:
            game_teams = GameTeam.query.filter_by(game_id = userGame.game.id).all();
            home_team = list(filter(lambda x: x.home_away.value == "home",game_teams))[0]
            away_team = list(filter(lambda x: x.home_away.value == "away",game_teams))[0]
            res.append({
            'id':userGame.game.id,
            'homeTeam': home_team.team_tournament.team.name,
            "awayTeam":away_team.team_tournament.team.name,
            "homeTeamImage": home_team.team_tournament.team.image,
            "awayTeamImage": away_team.team_tournament.team.image,
            "startTime": userGame.game.start_time,
            "status": userGame.game.status.value,
            "homeResult":home_team.result,
            "awayResult": away_team.result,
            "venue": userGame.game.venue,
            "venueLink": userGame.game.venue_link
            })
    return res,200

@game_route_bp.route("/liked/", methods=["GET"])
def is_game_liked():
    query = request.args.to_dict()
    if "user_id" not in query or "game_id" not in query:
        return {"message":"Invalid query parameters"},400
    liked_game = UserGame.query.filter_by(game_id = query["game_id"],user_id = query["user_id"]).first()
    return {"isLiked": liked_game.is_liked  if liked_game else False}

@game_route_bp.route("/<int:game_id>",methods=["GET"])
def get_game_by_id(game_id):
    game = db.session.get(Game,game_id)
    if game == None:
        return {},400
    game_teams = GameTeam.query.filter_by(game_id = game.id).all();
    home_team = list(filter(lambda x: x.home_away.value == "home",game_teams))[0]
    away_team = list(filter(lambda x: x.home_away.value == "away",game_teams))[0]
    return {
        'id':game.id,
        'homeTeam': {
            "id": home_team.team_tournament.team.id,
            "name":home_team.team_tournament.team.name,
            "tlc": home_team.team_tournament.team.tlc,
            "image": home_team.team_tournament.team.image,
            "hits":home_team.hits,
            "errors":home_team.errors,
            "lob":home_team.lob},
        "awayTeam":{
            "id": away_team.team_tournament.team.id,
            "name":away_team.team_tournament.team.name,
                    "tlc":away_team.team_tournament.team.tlc,
                    "image": away_team.team_tournament.team.image,
                    "hits":away_team.hits,
            "errors":away_team.errors,
            "lob":away_team.lob},
        "startTime": game.start_time,
        "status": game.status.value,
        "homeResult":home_team.result,
        "awayResult": away_team.result,
        "venue": game.venue,
        "venueLink": game.venue_link,
        "tournament":{
                "id":game.tournament_id,
                "name":game.tournament.name
            },
        "inning": game.inning,
        "inningHalf": game.inning_half,
        "homeBattingTurn":game.home_batting_order,
        "awayBattingTurn":game.away_batting_order,
        "outs": game.outs,
        "runners":game.runners,
        "pointsByInning":game.pointsByInning
    }

@game_route_bp.route("/team/roster/",methods=["GET"])
def get_game_team_roster():
    query = request.args.to_dict()
    if "game_id" not in query or "home_away" not in query:
        return {"message":"Invalid query parameters"},400
    game_team = GameTeam.query.filter_by(game_id=query["game_id"],home_away=query["home_away"]).first()
    res=[]
    for player in game_team.players:
        stats = {
        }
        merge_dicts(get_stats(game_team.game.situations,player.team_tournament_player.player.id),stats)
                        
        stats["AVG"] = stats["H"]/stats["AB"] if stats["AB"] != 0 else 0
        stats["OBP"] = (stats["H"]+stats["BB"]+stats["HBP"])/stats["PA"] if stats["PA"] != 0 else 0
        stats["SLG"] = (stats["1B"] + 2*stats["2B"] + 3*stats["3B"] + 4*stats["HR"])/stats["AB"] if stats["AB"] != 0 else 0
        res.append({
            "battingOrder": player.batting_order,
            "position": player.position,
            "uniformNumber":player.team_tournament_player.uniform_number,
            "player":{
                "id":player.team_tournament_player.player.id,
                "firstName":player.team_tournament_player.player.first_name,
                "lastName":player.team_tournament_player.player.last_name,
                
            },"stats":stats
        })

    return res

@game_route_bp.route("/team/roster/player", methods=["POST"])
@jwt_required()
def add_player_to_game_roster():
    data = request.json
    if "game_id" not in data or "tournament_id" not in data or "team_id" not in data or "home_away" not in data or"position" not in data or "battingOrder" not in data:
        return {"message":"Invalid data"},400
    gameTeam = GameTeam.query.filter_by(game_id=data["game_id"],home_away=data["home_away"]).first()
    teamTournament = TeamTournament.query.filter_by(team_id=data["team_id"],tournament_id = data["tournament_id"]).first()
    teamTournamentPlayer = TeamTournamentPlayer.query.filter_by(team_tournament_id = teamTournament.id, player_id = data["player_id"]).first()

    association = GameTeamTeamTournamentPlayer(game_team = gameTeam, team_tournament_player = teamTournamentPlayer,position = data["position"],batting_order=int(data['battingOrder']))
    db.session.add(association)
    db.session.commit()

    return "",201

@game_route_bp.route("/<int:game_id>/situation",methods=["POST"])
@jwt_required()
def add_game_situation(game_id):
    data = request.json
    print(data)
    if "data" not in data:
        return {"message":"Invalid data"},400
    situation = Situation(data = data["data"],game_id = game_id)
    db.session.add(situation)
    db.session.commit()

    return "Succefully added situation",201

@game_route_bp.route("/<int:game_id>/situations", methods=["GET"])
def get_game_situations(game_id):
    game = db.session.get(Game,game_id)
    if game == None:
        return {},400
    res = []
    for situation in game.situations:
        res.append({
            "id":situation.id,
            "data":situation.data
            })
    return res

@game_route_bp.route("/<int:game_id>/change_inning", methods=["POST"])
@jwt_required()
def change_inning(game_id):
    game = db.session.get(Game,game_id)
    if game.inning_half == "UP":
        game.inning_half = "DOWN"
    elif game.inning < 9:
        game.inning_half = "UP"
        game.inning += 1
    else:
        game.status = GameStatuses.ENDED
        game_teams = GameTeam.query.filter_by(game_id = game_id).all();
        home_team = list(filter(lambda x: x.home_away.value == "home",game_teams))[0]
        away_team = list(filter(lambda x: x.home_away.value == "away",game_teams))[0]   
        if home_team.result > away_team.result:
            home_team.is_winner = True
        elif home_team.result < away_team.result:
            away_team.is_winner = True
    db.session.commit()
    return ""


@game_route_bp.route("/game_team/change_score/", methods=["POST"])
@jwt_required()
def change_score():
    data = request.json
    query = request.args.to_dict()
    if "game_id" not in query or "home_away" not in query:
        return {"message":"Invalid query parameters"},400
    if "points" not in data:
        return {"message":"Invalid data"},400
    game_team = GameTeam.query.filter_by(game_id=query["game_id"],home_away=query["home_away"]).first()
    game_team.result += data["points"]
    db.session.commit()
    return ""

@game_route_bp.route("/<int:game_id>/change_batting_turn",methods=["POST"])
@jwt_required()
def change_batting_order(game_id):
    data = request.json
    if  "homeAway" not in data or "battingTurn" not in data:
        return {"message":"Invalid data"},400
    home_away = data["homeAway"]
    game = db.session.get(Game,game_id)
    if home_away == "HOME":
        game.home_batting_order = data["battingTurn"]
    else:
        game.away_batting_order = data["battingTurn"]
    db.session.commit()
    return ""

@game_route_bp.route("/<int:game_id>/change_outs", methods=["POST"])
@jwt_required()
def change_outs(game_id):
    data = request.json
    if "outs" not in data:
        return {"message":"Invalid data"},400
    game = db.session.get(Game,game_id)
    
    game.outs = data["outs"]
    db.session.commit()
    return ""

@game_route_bp.route("/game_team/change_lob/", methods=["POST"])
@jwt_required()
def change_lob():
    data = request.json
    query = request.args.to_dict()
    if "game_id" not in query or "home_away" not in query:
        return {"message":"Invalid query parameters"},400
    if "lob" not in data:
        return {"message":"Invalid data"},400
    game_team = GameTeam.query.filter_by(game_id=query["game_id"],home_away=query["home_away"]).first()
    game_team.lob = data["lob"]

    db.session.commit()
    return ""

@game_route_bp.route("/game_team/change_hits/", methods=["POST"])
@jwt_required()
def change_hits():
    data = request.json
    query = request.args.to_dict()
    if "game_id" not in query or "home_away" not in query:
        return {"message":"Invalid query parameters"},400
    if "hits" not in data:
         return {"message":"Invalid data"},400
    game_team = GameTeam.query.filter_by(game_id=query["game_id"],home_away=query["home_away"]).first()
    game_team.hits = data["hits"]

    db.session.commit()
    return ""

@game_route_bp.route("/game_team/change_errors/", methods=["POST"])
@jwt_required()
def change_errors():
    data = request.json
    query = request.args.to_dict()
    if "game_id" not in query or "home_away" not in query:
         return {"message":"Invalid query parameters"},400
    if "errors" not in data:
         return {"message":"Invalid data"},400
    game_team = GameTeam.query.filter_by(game_id=query["game_id"],home_away=query["home_away"]).first()
    game_team.errors = data["errors"]

    db.session.commit()
    return ""

@game_route_bp.route("/<int:game_id>/change_points_by_inning", methods=["POST"])
@jwt_required()
def change_points_by_inning(game_id):
    data = request.json
    if "points" not in data:
         return {"message":"Invalid data"},400
    game = db.session.get(Game,game_id)
    game.pointsByInning = data["points"]
    db.session.commit()
    return ""

@game_route_bp.route("/<int:game_id>/start",methods=["POST"])
@jwt_required()
def start_game(game_id):
    game = db.session.get(Game,game_id)
    game.status = GameStatuses.LIVE
    db.session.commit()
    return ""
    
@game_route_bp.route("/<int:game_id>/change_runners", methods=["POST"])
@jwt_required()
def change_runners(game_id):
    data = request.json
    if "runners" not in data:
         return {"message":"Invalid data"},400
    game = db.session.get(Game,game_id)
    game.runners = data["runners"]
    db.session.commit()
    return ""