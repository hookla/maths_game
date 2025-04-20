#!/usr/bin/env python3
import os
from http.server import HTTPServer, SimpleHTTPRequestHandler

class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def main():
    port = int(os.environ.get('PORT', '8000'))
    print(f"Serving 11+ Maths Quest at http://localhost:{port} (no cache)")
    HTTPServer(('', port), NoCacheHandler).serve_forever()

if __name__ == '__main__':
    main()