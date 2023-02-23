"""from browser import window, document, alert

document <= "BRYTHON"

def print_something():
    print("Tada!")

window.print_something = print_something"""
import json

def func():
    return 5+7

class Plugin:
    def __init__(self, cityjson):
        self.cityjson = cityjson

    def apply(self):
        # modify the cityjson object here
        pass

    def save(self, filepath):
        # save the modified cityjson object to a file
        pass
    
  class RemoveBuildingPlugin(Plugin):
    def __init__(self, cityjson, building_id):
        super().__init__(cityjson)
        self.building_id = building_id

    def apply(self):
        # remove the building with the specified id
        self.cityjson["CityObjects"].pop(self.building_id)

with open("input.json", "r") as f:
    cityjson = json.load(f)

plugin = RemoveBuildingPlugin(cityjson, "b1")
plugin.apply()

with open("output.json", "w") as f:
    json.dump(cityjson, f)
