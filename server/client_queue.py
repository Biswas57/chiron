# Client queue
# array of dict:
# {
#     sid: string,
# }
client_queue = []
# Internal functions
# Internal functions
from flask_socketio import SocketIO, emit

def refresh_queue_to_all():
    for i, client_state in enumerate(client_queue):
        sid = client_state["sid"]
        emit("queue", {"queue_pos": i + 1}, to=sid)

def dequeue():
    if len(client_queue) == 0:
        pass
    elif len(client_queue) == 1:
        client_queue = []
    else:
        client_queue = client_queue[1:]
        refresh_queue_to_all()