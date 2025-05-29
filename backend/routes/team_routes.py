from models.models import Team,GameTeam
from models.enums import HomeAway,GameStatuses
from flask import request, Blueprint
from flask_jwt_extended import  jwt_required
from models.models import db
from functions.functions import merge_dicts,id_in_list,get_stats

team_route_bp = Blueprint("team_routes",__name__)


@team_route_bp.route("/team",methods=['POST'])
@jwt_required()
def add_team():
    data = request.json
    if "name" not in data or "tlc" not in data or "address" not in data or "contact" not in data or "socialMedia" not in data or "manager" not in data or "headCoach" not in data or "image" not in data:
        return {"message":"Invalid data"},400
    new_team = Team(name=data['name'],tlc=data['tlc'],address=data['address'],contact=data['contact'],social_media=data['socialMedia'],manager=data['manager'],head_coach=data['headCoach'],image=data["image"])
    db.session.add(new_team)
    db.session.commit()
    return "Successfully added team",201

@team_route_bp.route("/teams",methods=['GET'])
def get_teams():
    teams = Team.query.all()
    res = [{
        'id':team.id,
        'name': team.name,
        "tlc":team.tlc,
        'address':team.address,
        "contact":team.contact,
        "socialMedia": team.social_media,
        "manager":team.manager,
        "headCoach":team.head_coach,
        "image":team.image
    } for team in teams]
    return res,200


@team_route_bp.route("/<int:team_id>",methods=['GET'])
def get_team_by_id(team_id):
    team = db.session.get(Team,team_id)
    if team == None:
        return {},400
    return {
        'id':team.id,
        'name': team.name,
        "tlc":team.tlc,
        'address':team.address,
        "contact":team.contact,
        "socialMedia": team.social_media,
        "manager":team.manager,
        "headCoach":team.head_coach,
        "image":team.image
    }


@team_route_bp.route("/<int:team_id>/tournaments/",methods=["GET"])
def get_team_tournaments(team_id):
    query = request.args.to_dict()
    year_ids = eval(str(query.get("year_ids")))
    team_ids = eval(str(query.get("team_ids")))
    team = db.session.get(Team, team_id)
    if team == None:
        return {},400
    res = []
    for team_tournament in team.tournaments:
        for gameTeam in team_tournament.games:
            gameTeamObject = GameTeam.query.filter_by(game_id = gameTeam.game_id,   home_away = HomeAway.AWAY if gameTeam.home_away == HomeAway.HOME else HomeAway.HOME).first()
            if (team_ids and gameTeamObject.team_tournament.team.id in team_ids or not team_ids) and id_in_list(team_tournament.tournament.id,res) == None:
                res.append({
                    'id':team_tournament.tournament.id,
                    'name': team_tournament.tournament.name,
                    })
        # if team_ids and team_tournament.team_tournament.tournament_id in team_ids or not team_ids:
    return res

@team_route_bp.route("/<int:team_id>/years/",methods=["GET"])
def get_team_years(team_id):
    query = request.args.to_dict()
    tournament_ids = eval(str(query.get("tournament_ids")))
    team_ids = eval(str(query.get("tournament_ids")))
    team = db.session.get(Team,team_id)
    if team == None:
        return {},400
    res = set()
    for team_tournament in team.tournaments:
        # if team_ids and team_tournament.team_tournament.tournament_id in team_ids or not team_ids:
        for gameTeam in team_tournament.games:
            res.add(gameTeam.game.start_time.year)
    return list(res)

@team_route_bp.route("/<int:team_id>/teams/",methods=["GET"])
def get_team_opponents(team_id):
    query = request.args.to_dict()
    tournament_ids = eval(str(query.get("tournament_ids")))
    year_ids = eval(str(query.get("year_ids")))
    team = db.session.get(Team,team_id)
    if team == None:
        return {},400
    res = []
    for team_tournament in team.tournaments:
        if tournament_ids and team_tournament.tournament_id in tournament_ids or not tournament_ids:
            for gameTeam in team_tournament.games:
                gameTeamObject = GameTeam.query.filter_by(game_id = gameTeam.game_id,home_away = HomeAway.AWAY if gameTeam.home_away == HomeAway.HOME else HomeAway.HOME).first()
                if id_in_list(gameTeamObject.team_tournament.team.id,res) == None:
                    res.append(
                        {"id":gameTeamObject.team_tournament.team.id,
                        "name":gameTeamObject.team_tournament.team.name
                        })
    
    return res


@team_route_bp.route("/<int:team_id>/stats/",methods=["GET"])
def get_team_stats(team_id):
    query = request.args.to_dict()
    team_ids = eval(str(query.get("team_ids")))
    tournament_ids = eval(str(query.get("tournament_ids")))
    game_id = query.get("game_id")
    years = eval(str(query.get("years")))

    team = db.session.get(Team,team_id)
    if team == None:
        return {},400
    res = {
        "W":0,
        "L":0
    }
    players_stats = []
    games_stats = []

    merge_dicts(get_stats([],None),res)
    for team_tournament in team.tournaments:
        #(team_ids and team_tournament.team_id in team_ids)
        if (tournament_ids and team_tournament.tournament_id in tournament_ids) or ( not tournament_ids):
            for player in team_tournament.players:
                player_stats = {
                    }
                merge_dicts(get_stats([],None),player_stats)
                for gameTeam in team_tournament.games:
                    gameTeamObject = GameTeam.query.filter_by(game_id = gameTeam.game_id,   home_away = HomeAway.AWAY if gameTeam.home_away == HomeAway.HOME else HomeAway.HOME).first()
                    game_stats = {
                    }
                    merge_dicts(get_stats([],None),game_stats)
                    if not years and game_id and gameTeam.game_id == game_id or not game_id and years and gameTeam.game.start_time.year in years or game_id and years and gameTeam.game_id == game_id and gameTeam.game.start_time.year in years or not game_id and not years : 
                        if team_ids and gameTeamObject.team_tournament.team_id in team_ids or not team_ids:
                            res_stats = get_stats(gameTeam.game.situations,player.player.id)
                            merge_dicts(res_stats,game_stats)
                            merge_dicts(res_stats,player_stats)
                            merge_dicts(res_stats,res)
                            game_index = id_in_list(gameTeam.game.id,games_stats)
                            if game_index == None:
                                games_stats.append({
                                    "id": gameTeam.game.id,
                                    "homeTeam": gameTeam.team_tournament.team.name if gameTeam.home_away == HomeAway.HOME else gameTeamObject.team_tournament.team.name,
                                    "awayTeam": gameTeamObject.team_tournament.team.name if gameTeam.home_away == HomeAway.HOME else gameTeam.team_tournament.team.name,
                                    "startTime":gameTeam.game.start_time,
                                    "stats":game_stats
                                })
                            else:
                                merge_dicts(game_stats,games_stats[game_index]["stats"])

                player_index = id_in_list(player.player.id,players_stats)
                if player_index == None:
                    players_stats.append({
                        "id": player.player.id,
                        "firstName": player.player.first_name,
                        "lastName":player.player.last_name,
                        "stats":player_stats
                    })
                else:
                    merge_dicts(player_stats,players_stats[player_index]["stats"])
    for team_tournament in team.tournaments:
        #(team_ids and team_tournament.team_id in team_ids)
        if (tournament_ids and team_tournament.tournament_id in tournament_ids) or ( not tournament_ids):
            for gameTeam in team_tournament.games:
                gameTeamObject = GameTeam.query.filter_by(game_id = gameTeam.game_id,   home_away = HomeAway.AWAY if gameTeam.home_away == HomeAway.HOME else HomeAway.HOME).first()
                if team_ids and gameTeamObject.team_tournament.team_id in team_ids or not team_ids:
                    if gameTeam.game.status == GameStatuses.ENDED:
                        if gameTeam.is_winner:
                            res["W"]+=1
                        else:
                            res["L"]+=1
                    
    res["AVG"] = res["H"]/res["AB"] if res["AB"] != 0 else 0
    res["OBP"] = (res["H"]+res["BB"]+res["HBP"])/res["PA"] if res["PA"] != 0 else 0
    res["SLG"] = (res["1B"] + 2*res["2B"] + 3*res["3B"] + 4*res["HR"])/res["AB"] if res["AB"] != 0 else 0
    res["OPS"] = (res["OBP"]+res["SLG"])/2
    res["FIP"] = (res["PO"]+res["A"])/res['TC'] if res["TC"] != 0 else 0
    for game in games_stats:
        game["stats"]["AVG"] = game["stats"]["H"]/game["stats"]["AB"] if game["stats"]["AB"] != 0 else 0
        game["stats"]["OBP"] = (game["stats"]["H"]+game["stats"]["BB"]+game["stats"]["HBP"])/game["stats"]["PA"] if game["stats"]["PA"] != 0 else 0
        game["stats"]["SLG"] = game["stats"]["TB"]/game["stats"]["AB"] if game["stats"]["AB"] != 0 else 0
        game["stats"]["OPS"] = (game["stats"]["OBP"]+game["stats"]["SLG"])/2
        game["stats"]["FIP"] = (game["stats"]["PO"]+game["stats"]["A"])/game["stats"]['TC'] if game["stats"]["TC"] != 0 else 0
    for player in players_stats:
        player["stats"]["AVG"] = player["stats"]["H"]/player["stats"]["AB"] if player["stats"]["AB"] != 0 else 0
        player["stats"]["OBP"] = (player["stats"]["H"]+player["stats"]["BB"]+player["stats"]["HBP"])/player["stats"]["PA"] if player["stats"]["PA"] != 0 else 0
        player["stats"]["SLG"] = player["stats"]["TB"]/player["stats"]["AB"] if player["stats"]["AB"] != 0 else 0 
        player["stats"]["OPS"] = (player["stats"]["OBP"]+player["stats"]["SLG"])/2
        player["stats"]["FIP"] = (player["stats"]["PO"]+player["stats"]["A"])/player["stats"]['TC'] if player["stats"]["TC"] != 0 else 0   
    
    return {"stats":res,"games_stats":games_stats,"players_stats":players_stats}
