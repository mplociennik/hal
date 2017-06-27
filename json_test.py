import json

dump = json.dumps({'event': 'message','data': {'message': 'Direction: {0}, State: {1}'.format("up", True)}})
print(dump)