from app import app
from functions.functions import merge_dicts
import pytest

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

def test_missing_route(client):
    response = client.get("/ofjdfhsbdfsi")
    assert response.status_code  == 404

def test_merge_dicts():
    dict1 = {"a":1, "b":1,"c":0,"e":12}
    dict2 = {"a":3,"b":-1,"c":2,"d":11}
    merge_dicts(dict1,dict2)
    assert dict2 == {"a":4,"b":0,"c":2,"d":11,"e":12}

def test_get_players_status(client):
    response = client.get('/player/players')
    assert response.status_code == 200

def test_get_players_result(client):
    response = client.get('/player/players')
    assert isinstance(response.json, list)

def test_get_invalid_player_status(client):
    response = client.get("/player/0")
    assert response.status_code == 400

def test_unauthenticated_post_player_status(client):
    response = client.post("/player/player")
    assert response.status_code == 401

def test_get_invalid_player_result(client):
    response = client.get("/player/0")
    assert response.json == {"Error":"Invalid player id"}

def test_get_teams_status(client):
    response = client.get('/team/teams')
    assert response.status_code == 200

def test_get_teams_result(client):
    response = client.get('/team/teams')
    assert isinstance(response.json, list)

def test_unauthenticated_post_team_status(client):
    response = client.post("/team/team")
    assert response.status_code == 401

def test_get_invalid_team_status(client):
    response = client.get("/team/0")
    assert response.status_code == 400

def test_unauthenticated_post_tournament_status(client):
    response = client.post("/tournament/tournament")
    assert response.status_code == 401

def test_get_tournaments_status(client):
    response = client.get('/tournament/tournaments')
    assert response.status_code == 200

def test_get_tournaments_result(client):
    response = client.get('/tournament/tournaments')
    assert isinstance(response.json, list)

def test_unauthenticated_post_tournament_game_status(client):
    response = client.post("/tournament/tournament_game/")
    assert response.status_code == 401

def test_get_invalid_tournaments_games_status(client):
    response = client.get('/tournament/tournament_games/')
    assert response.status_code ==400

def test_get_invalid_tournaments_games_result(client):
    response = client.get('/tournament/tournament_games/')
    assert response.json == {"message":"Invalid query parameters"}

def test_unauthenticated_post_tournament_team_status(client):
    response = client.post("/tournament/tournament_teams/")
    assert response.status_code == 401

def test_get_invalid_tournaments_teams_status(client):
    response = client.get('/tournament/tournament_teams/')
    assert response.status_code ==400

def test_get_invalid_tournaments_teams_result(client):
    response = client.get('/tournament/tournament_teams/')
    assert response.json == {"message":"Invalid query parameters"}

def test_get_invalid_game_status(client):
    response = client.get('/game/0')
    assert response.status_code ==400

def test_unauthenticated_post_tournament_team_player_status(client):
    response = client.post("/tournament/team_tournament/player/")
    assert response.status_code == 401

def test_get_invalid_team_tournament_roster_status(client):
    response = client.get('/tournament/team_tournament/roster/')
    assert response.status_code ==400

def test_get_invalid_team_tournament_roster_result(client):
    response = client.get('/tournament/team_tournament/roster/')
    assert response.json == {"message":"Invalid query parameters"}

def test_get_invalid_tournament_taken_players_status(client):
    response = client.get('/tournament/taken_players/')
    assert response.status_code ==400

def test_get_invalid_tournament_taken_players_result(client):
    response = client.get('/tournament/taken_players/')
    assert response.json == {"message":"Invalid query parameters"}

def test_get_invalid_schedule_status(client):
    response = client.get('/schedule/schedule/')
    assert response.status_code ==400

def test_get_invalid_schedule_result(client):
    response = client.get('/schedule/schedule/')
    assert response.json == {"message":"Invalid query parameters"}

def test_get_invalid_game_team_players_status(client):
    response = client.get('/game/team/roster/')
    assert response.status_code ==400

def test_get_invalid_game_team_players_result(client):
    response = client.get('/game/team/roster/')
    assert response.json == {"message":"Invalid query parameters"}

def test_unauthenticated_post_game_team_player_status(client):
    response = client.post("/game/team/roster/player")
    assert response.status_code == 401

def test_unauthenticated_post_game_situation_status(client):
    response = client.post("/game/0/situation")
    assert response.status_code == 401

def test_get_invalid_game_situations_status(client):
    response = client.get('/game/0/situations')
    assert response.status_code ==400

def test_unauthenticated_post_game_change_inning_status(client):
    response = client.post("/game/0/change_inning")
    assert response.status_code == 401

def test_unauthenticated_post_game_team_change_score_status(client):
    response = client.post("/game/game_team/change_score/")
    assert response.status_code == 401

def test_unauthenticated_post_game_change_batting_turn_status(client):
    response = client.post("/game/0/change_batting_turn")
    assert response.status_code == 401

def test_unauthenticated_post_game_change_outs_status(client):
    response = client.post("/game/0/change_outs")
    assert response.status_code == 401

def test_unauthenticated_post_game_team_change_lob_status(client):
    response = client.post("/game/game_team/change_lob/")
    assert response.status_code == 401

def test_unauthenticated_post_game_team_change_hits_status(client):
    response = client.post("/game/game_team/change_hits/")
    assert response.status_code == 401

def test_unauthenticated_post_game_team_change_errors_status(client):
    response = client.post("/game/game_team/change_errors/")
    assert response.status_code == 401

def test_unauthenticated_post_game_change_points_by_inning_status(client):
    response = client.post("/game/0/change_points_by_inning")
    assert response.status_code == 401

def test_unauthenticated_post_game_start_status(client):
    response = client.post("/game/0/start")
    assert response.status_code == 401

def test_unauthenticated_post_game_change_runners_status(client):
    response = client.post("/game/0/change_runners")
    assert response.status_code == 401

def test_get_invalid_player_teams_status(client):
    response = client.get('/player/0/teams/')
    assert response.status_code ==400

def test_get_invalid_player_tournaments_status(client):
    response = client.get('/player/0/tournaments/')
    assert response.status_code ==400

def test_get_invalid_player_years_status(client):
    response = client.get('/player/0/years/')
    assert response.status_code ==400

def test_get_invalid_player_stats_status(client):
    response = client.get('/player/0/stats/')
    assert response.status_code ==400

def test_get_invalid_player_games_stats_status(client):
    response = client.get('/player/0/games_stats/')
    assert response.status_code ==400

def test_get_invalid_team_teams_status(client):
    response = client.get('/team/0/teams/')
    assert response.status_code ==400

def test_get_invalid_team_tournaments_status(client):
    response = client.get('/team/0/tournaments/')
    assert response.status_code ==400

def test_get_invalid_team_years_status(client):
    response = client.get('/team/0/years/')
    assert response.status_code ==400

def test_get_invalid_team_stats_status(client):
    response = client.get('/team/0/stats/')
    assert response.status_code ==400

def test_get_invalid_tournament_stats_status(client):
    response = client.get('/tournament/0/stats/')
    assert response.status_code ==400

def test_get_invalid_tournament_ranking_status(client):
    response = client.get('/tournament/0/ranking')
    assert response.status_code ==400


    