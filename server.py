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
        <link rel="stylesheet" href="{0}">
        '''
        file_to_open = file_to_open.replace('</title>', header_elements.format(cssFile))
        # open file based on path.
        file_to_open += open( htmlFile ).read()
        # file_to_open += echo(self)
        footer_elements = '''
        <script src="{0}"></script>
        </body>
        '''
        file_to_open += open('component/footer.html').read()
        file_to_open = file_to_open.replace('</body>', footer_elements.format(jsFile))
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
        router_path = self.path

        if router_path.endswith('curriculum'):
            with open('data/curriculum.json') as json_file:
                data = json.load(json_file)
            self._set_headers()
            self.wfile.write(bytes(json.dumps(data),'utf-8'))
        if router_path.endswith('search'):
            length = int(self.headers.get('content-length'))
            postData = json.loads(self.rfile.read(length))

            with open('data/courses.json') as json_file:
                data = json.load(json_file)
            if not postData['data']:
                filtered_data = data
            else:
                filtered_data = {}
                # For loop the keys in a json object
                for key in data:
                    matched = False
                    # Loop through post data body {array} to see if one of the string matches the concentration or the ID
                    for value in postData['data']:
                        matched = False
                        # print(index + key)
                        if value.lower() in data[key]['concentration'].lower():
                            print("sdfsdfsdf")
                            matched = True
                        if value in str(data[key]['ID']):
                            matched = True
                    # If matched return the object that matched.
                    if matched:
                        filtered_data[key] = data[key]
            self._set_headers()
            self.wfile.write(bytes(json.dumps(filtered_data),'utf-8'))
        if router_path.endswith('getAuthData'):
            with open('data/auth.json') as json_file:
                data = json.load(json_file)
                filtered_data = {}
                for item in data:
                    if "PEPE" in item['username']:
                        filtered_data = item['CIIC']
                        break
            self._set_headers()
            self.wfile.write(bytes(json.dumps(filtered_data),'utf-8'))
        if router_path.endswith('postApproved'):
            length = int(self.headers.get('content-length'))
            postData = json.loads(self.rfile.read(length))
            with open('data/auth.json') as json_file:
                data = json.load(json_file)
                print(postData['data'])
                for item in data:
                    if "PEPE" in item['username']:
                        item['CIIC']['courses'][postData['data']['id']] = postData['data']['approve']
            with open('data/auth.json', 'w') as outfile:
                json.dump(data, outfile, indent=2)
            self._set_headers()
            self.wfile.write(bytes(json.dumps({}),'utf-8'))
         

          
       
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