import json
import re

def read_features(filename):
    with open(filename) as file:
        geojson = json.load(file)
    return geojson['features']

def get_path(feature):
    props = feature.get('properties', {})
    path = []
    for level in range(10):
        key = 'admin%dName' % level
        if key in props:
            path.append(props[key])
        else:
            break
    return path

def get_paths(features, **filters):
    paths = []
    for feature in features:
        path = get_path(feature)
        include = True
        for key, value in filters.items():
            match = re.match(r'^admin(\d+)', key)
            if match:
                level = int(match.group(1))
                if path[level] != value:
                    include = False
        if include:
            paths.append(path)
    return paths
