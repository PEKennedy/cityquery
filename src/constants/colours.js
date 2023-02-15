/*
Defines the default colours for different "semantics" objects within a cityjson geometry
TODO: Potentially support extension types?
*/

const common = {
    "red":[1,0,0],
    "orange":[1,0.25,0],
    "yellow":[0.5,0.5,0],
    "yellow-green":[0.5,1,0],
    "green":[0,1,0],
    "turquoise":[0,0.5,0.5],
    "blue":[0,0,1],
    "purple":[0.5,0,0.5],
    "black":[0,0,0],
    "grey":[0.5,0.5,0.5],
    "white":[1,1,1]
}

export const colours = {
    semantics:{
        primary:{
            "RoofSurface":          common['red'],
            "GroundSurface":        common['grey'],
            "WallSurface":          common['orange'],
            "ClosureSurface":       common['grey'],
            "OuterCeilingSurface":  common['grey'],
            "OuterFloorSurface":    common['grey'],
            "Window":               common['grey'],
            "Door":                 common['grey'],
            "InteriorWallSurface":  common['grey'],
            "CeilingSurface":       common['grey'],
            "FloorSurface":         common['grey'],
            "WaterSurface":         common['blue'],
            "WaterGroundSurface":   common['blue'],
            "WaterClosureSurface":  common['blue'],
            "TrafficArea":          common['grey'],
            "AuxiliaryTrafficArea": common['grey'],
            "TransportationMarking":common['grey'],
            "TransportationHole":   common['grey']
        },
        selected:{
            "RoofSurface":          common['red'],
            "GroundSurface":        common['grey'],
            "WallSurface":          common['orange'],
            "ClosureSurface":       common['grey'],
            "OuterCeilingSurface":  common['grey'],
            "OuterFloorSurface":    common['grey'],
            "Window":               common['grey'],
            "Door":                 common['grey'],
            "InteriorWallSurface":  common['grey'],
            "CeilingSurface":       common['grey'],
            "FloorSurface":         common['grey'],
            "WaterSurface":         common['blue'],
            "WaterGroundSurface":   common['blue'],
            "WaterClosureSurface":  common['blue'],
            "TrafficArea":          common['grey'],
            "AuxiliaryTrafficArea": common['grey'],
            "TransportationMarking":common['grey'],
            "TransportationHole":   common['grey']
        }
    },
    default: [0.5,0.7,0.7]
};
