from models.models import TeamTournament, Tournament, Game, GameTeam,Team,Player,TeamTournamentPlayer
from models.enums import HomeAway, GameStatuses
from flask import request, Blueprint
from flask_jwt_extended import jwt_required
from datetime import date,datetime,timezone
from models.models import db
from functions.functions import merge_dicts,get_stats

tournament_route_bp = Blueprint("tournament_routes",__name__)


@tournament_route_bp.route("/tournament",methods=['POST'])
@jwt_required()
def add_tournament():
    data = request.json
    if "name" not in data or "place" not in data or "startDate" not in data or "endDate" not in data or "image" not in data:
        return {"message":"Invalid data"},400
    new_tournament = Tournament(name=data['name'],place=data['place'],start_date=date(data['startDate']['year'], data['startDate']['month'],data['startDate']['date'] ),end_date=date(data['endDate']['year'],data['endDate']['month'],data['endDate']['date']),image=data['image'])
    db.session.add(new_tournament)
    db.session.commit()
    return "Successfully added tournament",201


@tournament_route_bp.route("/tournaments",methods=['GET'])
def get_tournaments():
    tournaments = Tournament.query.all()
    res = [{
        'id':tournament.id,
        'name': tournament.name,
        "startDate":tournament.start_date,
        'endDate': tournament.end_date,
        "place": tournament.place,
        "image":tournament.image
    } for tournament in tournaments]
    return res,200


@tournament_route_bp.route("/<int:tournament_id>",methods=['GET'])
def get_tournament_by_id(tournament_id):
    tournament = db.session.get(Tournament,tournament_id)
    if tournament == None:
        return {},400
    return {
        'id':tournament.id,
        'name': tournament.name,
        "startDate":tournament.start_date,
        'endDate': tournament.end_date,
        "place": tournament.place,
        "image":tournament.image
    } 


@tournament_route_bp.route("/tournament_game/",methods=['POST'])
@jwt_required()
def add_game_to_tournament():
    query = request.args.to_dict()
    data = request.json

    if "tournament_id" not in query or "startTime" not in data or "homeTeam" not in data or "awayTeam" not in data or "venue" not in data or "venueLink" not in data:
        return {"message":"Invalid data or query parameters"},400
    
    tournament = db.session.get(Tournament,query["tournament_id"])
    new_game = Game(start_time = datetime(year=data['startTime']["year"],month=data['startTime']["month"],day=data['startTime']["day"],hour=data['startTime']["hour"],minute=data['startTime']["minutes"],tzinfo=timezone.utc),tournament_id = int(query["tournament_id"]),venue=data["venue"],venue_link=data['venueLink'])
    db.session.add(new_game)
    tournament.games.append(new_game)
    home_game_association = GameTeam(game=new_game,team_tournament= TeamTournament.query.filter_by(team_id = data["homeTeam"]["id"],tournament_id = tournament.id).first(),home_away = HomeAway.HOME)
    db.session.add(home_game_association)
    db.session.commit()

    away_game_association = GameTeam(game=new_game,team_tournament= TeamTournament.query.filter_by(team_id = data["awayTeam"]["id"],tournament_id = tournament.id).first(),home_away = HomeAway.AWAY)
    db.session.add(away_game_association)
    db.session.commit()
    return "Successfully added game",201

@tournament_route_bp.route("/tournament_games/",methods=['GET'])
def get_games_by_tournament():
    query = request.args.to_dict()
    if "tournament_id" not in query:
        return {"message":"Invalid query parameters"},400
    tournament = db.session.get(Tournament,query["tournament_id"])
    if tournament == None:
        return {},400
    res = []
    for game in tournament.games:
        game_teams = GameTeam.query.filter_by(game_id = game.id).all();
        home_team = list(filter(lambda x: x.home_away.value == "home",game_teams))[0]
        away_team = list(filter(lambda x: x.home_away.value == "away",game_teams))[0]
        res.append({
        'id':game.id,
        'homeTeam': home_team.team_tournament.team.name,
        "awayTeam":away_team.team_tournament.team.name,
        "startTime": game.start_time,
        "awayTeamImage":away_team.team_tournament.team.image,
        "homeTeamImage":home_team.team_tournament.team.image,
        "status": game.status.value,
        "homeResult":home_team.result,
        "awayResult": away_team.result,
        "venue": game.venue,
        "venueLink": game.venue_link
        })
    return res,200


@tournament_route_bp.route("/tournament_teams/",methods=["POST"])
@jwt_required()
def add_team_to_tournament():
    query = request.args.to_dict()
    if "team_id" not in query or "tournament_id" not in query:
        return {"message":"Invalid query params"},400
    team = db.session.get(Team,query["team_id"])
    tournament = db.session.get(Tournament,query["tournament_id"])

    team_tournament_association = TeamTournament(team=team,tournament=tournament)
    db.session.add(team_tournament_association)
    db.session.commit()
    return "",201


@tournament_route_bp.route("/tournament_teams/",methods=["GET"])
def get_teams_by_tournament():
    query = request.args.to_dict()
    if "tournament_id" not in query:
        return {"message":"Invalid query parameters"},400
    tournament = db.session.get(Tournament,query["tournament_id"])
    return [ {
        'id':association.team.id,
        'name': association.team.name,
        "tlc":association.team.tlc,
        'image': association.team.image,
        'address':association.team.address,
        "contact":association.team.contact,
        "socialMedia": association.team.social_media,
        "manager":association.team.manager,
        "headCoach":association.team.head_coach
    } for association in tournament.teams]




@tournament_route_bp.route("/team_tournament/player/",methods=["POST"])
@jwt_required()
def add_player_to_team_tournament():
    query = request.args.to_dict()
    data =request.json
    if "team_id" not in query or "tournament_id" not in query:
        return {"message":"Invalid query parameters"},400
    if "uniformNumber" not in data:
        return {"message":"Invalid data"},400
    teamTournament = TeamTournament.query.filter_by(team_id = query["team_id"],tournament_id = query["tournament_id"]).first()
    player = db.session.get(Player,query["player_id"])

    teamTournamentPlayerAssociation = TeamTournamentPlayer(team_tournament=teamTournament, player=player, uniform_number = int(data["uniformNumber"]))
    db.session.add(teamTournamentPlayerAssociation)
    db.session.commit()
    return "",201

@tournament_route_bp.route("/team_tournament/roster/",methods=["GET"])
def get_players_by_team_tournament():
    query = request.args.to_dict()
    if "team_id" not in query or "tournament_id" not in query:
        return {"message":"Invalid query parameters"},400
    teamTournament = TeamTournament.query.filter_by(team_id = query["team_id"],tournament_id = query["tournament_id"]).first()
    res = []
    for association in teamTournament.players:
        player = association.player
        res.append({
            "id": player.id,
            "firstName":player.first_name,
            "lastName": player.last_name,
            "uniformNumber": association.uniform_number,
            "dateOfBirth": player.date_of_birth,
            "country":player.country,
            "image":player.image
        })
    return res

@tournament_route_bp.route("/taken_players/",methods=["GET"])
def get_taken_players():
    query = request.args.to_dict()
    if "tournament_id" not in query:
        return {"message":"Invalid query parameters"},400
    teams_tournament = TeamTournament.query.filter_by(tournament_id = query["tournament_id"]).all()
    res = []
    for teams in teams_tournament:
        for player_association in teams.players:
            res.append(player_association.player.id)
    return res


@tournament_route_bp.route("/<int:tournament_id>/stats/",methods=["GET"])
def get_tournament_stats(tournament_id):
    query = request.args.to_dict()
    game_id = query.get("game_id")
    years = eval(str(query.get("years")))
    tournament = db.session.get(Tournament,tournament_id)
    if tournament == None:
        return {},400
    res = []
    for team_tournament in tournament.teams:
        #(team_ids and team_tournament.team_id in team_ids)
            for player in team_tournament.players:
                player_stats  = {
                    }
                merge_dicts(get_stats([],None),player_stats)
                for gameTeam in team_tournament.games:
                    if game_id and gameTeam.game_id == game_id and not years or years and gameTeam.game.start_time.year in years and not game_id or years and gameTeam.game.start_time.year in years and game_id and gameTeam.game_id == game_id or not game_id and not years:
                        merge_dicts(get_stats(gameTeam.game.situations,player.player.id),player_stats)
                player_stats["AVG"] = player_stats["H"]/player_stats["AB"] if player_stats["AB"] != 0 else 0
                player_stats["OBP"] = (player_stats["H"]+player_stats["BB"]+player_stats["HBP"])/player_stats["PA"] if player_stats["PA"] != 0 else 0
                player_stats["SLG"] = (player_stats["1B"] + 2*player_stats["2B"] + 3*player_stats["3B"] + 4*player_stats["HR"])/player_stats["AB"] if player_stats["AB"] != 0 else 0
                player_stats["FIP"] = (player_stats["PO"]+player_stats["A"])/player_stats['TC'] if player_stats["TC"] != 0 else 0
                res.append({
                    "id":player.id,
                    "teamName": team_tournament.team.name,
                    "teamImage":team_tournament.team.image,
                    "firstName":player.player.first_name,
                    "lastName":player.player.last_name,
                    "stats":player_stats})
                                
                    
    

    return res


@tournament_route_bp.route("/<int:tournament_id>/ranking",methods=["GET"])
def get_tournament_ranking(tournament_id):
    tournament = db.session.get(Tournament,tournament_id)
    if tournament == None:
        return {},400
    res = []
    for team_tournament in tournament.teams:
        #(team_ids and team_tournament.team_id in team_ids)
        team_stats={
            "W":0,
            "L":0
        }

        for gameTeam in team_tournament.games:
            if gameTeam.game.status == GameStatuses.ENDED:
                if gameTeam.is_winner:
                    team_stats["W"]+=1
                else:
                    team_stats["L"]+=1
        res.append({
            "id":team_tournament.team.id,
            "teamName": team_tournament.team.name,
            "teamImage":team_tournament.team.image,
            "stats":team_stats})
                                
    return res