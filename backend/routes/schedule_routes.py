from models.models import Game, GameTeam
from flask import request, Blueprint

schedule_route_bp = Blueprint("schedule_routes",__name__)

@schedule_route_bp.route("/schedule/",methods=["GET"])
def get_games_by_date():
    query = request.args.to_dict()
    if "day" not in query or "month" not in query or "year" not in query:
        return {"message":"Invalid query parameters"},400
    day,month,year = query["day"],query["month"],query["year"]
    games = Game.query.all()
    res = []
    for game in games:
        if game.start_time.year == int(year) and game.start_time.month == int(month) and game.start_time.day == int(day):
            game_teams = GameTeam.query.filter_by(game_id = game.id).all();
            home_team = list(filter(lambda x: x.home_away.value == "home",game_teams))[0]
            away_team = list(filter(lambda x: x.home_away.value == "away",game_teams))[0]
            res.append({
            'id':game.id,
            'homeTeam': home_team.team_tournament.team.name,
            "awayTeam":away_team.team_tournament.team.name,
            "homeTeamImage": home_team.team_tournament.team.image,
            "awayTeamImage": away_team.team_tournament.team.image,
            "startTime": game.start_time,
            "status": game.status.value,
            "homeResult":home_team.result,
            "awayResult": away_team.result,
            "venue": game.venue,
            "venueLink": game.venue_link,
            "tournament":{
                "id":game.tournament_id,
                "name":game.tournament.name
            }
            })
        
    return res