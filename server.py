from http.server import HTTPServer, BaseHTTPRequestHandler
from bs4 import BeautifulSoup as Soup
from python.get_router import get_router
from python.functions import isImage
import base64
import json
import hyperlink



class Serv(BaseHTTPRequestHandler):
    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
    
    def openHTML(self, htmlFile, cssFile, jsFile = ''):
        file_to_open = open('component/header.html').read()
        # Add Style with file name
        header_elements = '''</title>
        <link rel="stylesheet" href="./css/global.css">
        <link rel="stylesheet" href="{0}">
        <script src="{1}"></script>
        '''
        file_to_open = file_to_open.replace('</title>', header_elements.format(cssFile, jsFile))
        # open file based on path.
        file_to_open += open( htmlFile ).read()
        # file_to_open += echo(self)
        file_to_open += open('component/footer.html').read()
        return file_to_open
    
    def openResource(self, File ):
        image_prop = isImage(self)
        if image_prop['isImage']:
            file_to_open = open( File, 'rb' ).read()
        else:
            file_to_open = open( File ).read()
        return file_to_open
    
    # open endpoint to retrieve data.
    # def getData(self):
    #     file_to_open = open( File ).read()

    # @overwrite
    def do_GET(self):
        file_to_open = get_router(self)
        # self.end_headers()
        image_prop = isImage(self)
        if image_prop['isImage']:
            self.send_header('Content-type', image_prop['contentType'] )
            self.end_headers()
            self.wfile.write(file_to_open)
        else:
            self.end_headers()
            self.wfile.write(bytes(file_to_open,'utf-8'))
    # @overwrite
    def do_POST(self):
        # ""database"" part
        with open('data/database.json') as json_file:
            data = json.load(json_file)
            for key in data:
                print('Name: ' + data[key]['data'])
        data['math']['this'] = "sdlfhdflkkls"
        with open('data/database.json', 'w') as outfile:
            json.dump(data, outfile, indent=2)
        # # file_to_open = self.routing()
        # content_len = int(self.headers.get('Content-Length'))
        # print(self.rfile.read(content_len))
        # # json_string = json.dumps("""
        # # {
        # #     data: "sdfdsf",
        # #     ede: "sdfsdfs"
        # # }
        
        # # """)
        # # read the message and convert it into a python dictionary
        # length = int(self.headers.get('content-length'))
        # message = json.loads(self.rfile.read(length))
        
        # # add a property to the object, just to mess with data
        # message['received'] = 'ok'
        
        # # send the message back
        # self._set_headers()
        # # Begin the response
        # print(message)
        # # self.wfile.write(json.dumps(message))
        # # self.wfile.write(bytes(file_to_open,'utf-8'))
        # self.wfile.write(json.dumps({'hello': 'world', 'received': 'ok'}))
        self._set_headers()
        self.wfile.write(bytes(json.dumps({'hello': 'world', 'received': 'ok'}),'utf-8'))

class bcolors:
    OK = '\033[92m' #GREEN
    RESET = '\033[0m' #RESET COLOR

# Set server settings
host = '10.0.0.13'
port = 3000

# Set terminal message for developer
url = hyperlink.parse(u'http://'+ host )
better_url = url.replace(scheme=u'http', port=port)
org_url = better_url.click(u'.')

print( 'The Server Started on: '+ bcolors.OK + org_url.to_text() + bcolors.RESET )

# Initialize server
httpd = HTTPServer(( host, port ),Serv)
httpd.serve_forever()