from http.server import HTTPServer, BaseHTTPRequestHandler

class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        self.wfile.write(b"Hello World from Python! \xf0\x9f\x90\x8d")

httpd = HTTPServer(('0.0.0.0', 8000), SimpleHTTPRequestHandler)
print("Listening on port 8000...")
httpd.serve_forever()
