from flask import Flask, request

app = Flask(__name__)

@app.route('/', defaults={'path': ''}, methods=['POST', 'GET', 'PATCH'])
@app.route('/<path:path>', methods=['POST', 'GET', 'PATCH'])
def catch_all(path):
    print('path: %s' % path)
    print('request.data: %s' % request.data)
    print('request.headers: %s' % request.headers)
    print('=============================================================================')
    return ''

if __name__ == '__main__':
    app.run(host = 'localhost', port = 3005, debug=True)

