import json

def getParams():
    return json.dumps({
        "p1":"float",
        "p2":"int",
        "success":"string",
    })

def modifyCityJSON(cityjsonFile, objectNames, paramVals):
    verts = cityjsonFile["vertices"]
    for objName in objectNames:
        obj = cityjsonFile["CityObjects"][objName]

        obj['test'] = paramVals['success']

        cityjsonFile["CityObjects"][objName] = obj
    return json.dumps(cityjsonFile)