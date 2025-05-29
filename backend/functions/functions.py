def merge_dicts(srcDict:dict,destDict:dict):
    for key in srcDict:
        if key in destDict:
            destDict[key] = destDict[key] + srcDict[key]
        else:
            destDict.update({key: srcDict[key]})

def get_stats(situations_list:list,player_id:int):
    res = {
        "PA":0,
        "H":0,
        "AB":0,
        "SO":0,
        "BB":0,
        "HBP":0,
        "AVG":0,
        "SLG":0,
        "1B":0,
        "2B":0,
        "3B":0,
        "HR":0,
        "R":0,
        "RBI":0,
        "IBB":0,
        "OPS":0,
        "TB":0,
        "XBH":0,
        "ROE":0,
        "PO":0,
        "A":0,
        "E":0,
        "TC":0,
        "FIP":0,
        "SB":0,
        "SF":0,
        "CS":0,
        "BABIP":0,
        "RC":0,
        "G":0
    }
    for situation in situations_list:
        if situation.data["batter"]["player"]["id"] == player_id :
            
            if situation.data["situationCategory"] != "":
                res["PA"] += 1
            if situation.data["situationCategory"] == "hit":
                res["H"] += 1
                if situation.data["situation"] == "Single":
                    res["1B"] +=1
                elif situation.data["situation"] == "Double":
                    res["2B"] +=1
                elif situation.data["situation"] == "Triple":
                    res["3B"] +=1
                elif situation.data["situation"] == "Homerun":
                    res["HR"] +=1
            if situation.data["situationCategory"] == "walk":
                res["BB"] +=1
                if situation.data["situation"] == "Intentional walk":
                    res["IBB"]+=1
            if situation.data["situationCategory"] == "hit by pitch":
                res["HBP"] +=1
            if situation.data["situationCategory"] == "strikeout":
                res["SO"] +=1
            if situation.data["situationCategory"] in ["hit","fielder's choice","error","strikeout","groundout","flyout"]:
                res["AB"] +=1
            if situation.data["situationCategory"] == "error":
                res["ROE"] +=1
            if situation.data["situationCategory"] == "sacrifice flyout":
                res["SF"]+=1 
            for runner_situation in situation.data["runners"]:
                if runner_situation["finalBase"] == "Home":
                    res["RBI"] += 1
        for runner_situation in situation.data["runners"]:
            if runner_situation["player"]["player"]["id"] == player_id:
                if runner_situation["finalBase"] == "Home":
                    res["R"] += 1
                if runner_situation["situationCategory"] == 'stolen base':
                    res["SB"] +=1
                if runner_situation["situationCategory"] == 'caught stealing':
                    res["CS"]+=1
            if runner_situation.get("outs"):
                for out in runner_situation["outs"]:
                    if player_id == out["player"]["id"]:
                        res["PO"]+=1
            if runner_situation.get("assists"):
                for assist in situation.data["assists"]:
                    if player_id == assist["player"]["id"]:
                        res["A"]+=1
            if runner_situation.get("errors"):
                for error in situation.data["errors"]:
                    if player_id == error["player"]["id"]:
                        res["E"]+=1
        for out in situation.data["defense"]["outs"]:
            if player_id == out["player"]["id"]:
                res["PO"]+=1
        for assist in situation.data["defense"]["assists"]:
            if player_id == assist["player"]["id"]:
                res["A"]+=1
        for error in situation.data["defense"]["errors"]:
            if player_id == error["player"]["id"]:
                res["E"]+=1
    res["XBH"] += res["2B"]+res["3B"]+res["HR"]
    res["TB"] += res["1B"]+2*res["2B"]+3*res['3B']+4*res["HR"]
    res["TC"] += res["PO"]+res["A"]+res["E"]
    return res                    

def id_in_list(id,list):
    for i in range(0,len(list)):
        if list[i]["id"] == id:
            return i
    return None