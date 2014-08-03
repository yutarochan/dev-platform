import simplejson
import json
import tornado.ioloop
import tornado.web
import tornado.websocket
import tornado.template

class MainHandler(tornado.web.RequestHandler):
  def get(self):
    loader = tornado.template.Loader(".")
    self.write(loader.load("index.html").generate())

class WSHandler(tornado.websocket.WebSocketHandler):
  def check_origin(self, origin):
    return True  
  def open(self):
    print 'connection opened...'
    self.write_message("connection accepted")

  def on_message(self, message):
    print 'received:', message
    if message == 'get_feed':
        test(self,message)

  def on_close(self):
    print 'connection closed'

def test(server, request):
   
##Load static depth matrix from file
   
    with open('data/depth.json','r') as f:
        string = f.read()
    f.close()
    dataList = json.loads(string)
    jsonOut = simplejson.dumps(dataList)
    server.write_message(jsonOut)

#    cam = Kinect()

##Write depth matrix to file

#    depth = cam.getDepthMatrix()
#    json = simplejson.dumps(depth.tolist())
#    f=open('depth.json','w')
#    f.write(json)

##For live streaming

#    while True:
#        depth = cam.getDepthMatrix()
#        json = simplejson.dumps(depth.tolist())
#        server.write_message(json)

application = tornado.web.Application([
  (r'/ws', WSHandler),
  (r'/', MainHandler),
  (r"/(.*)", tornado.web.StaticFileHandler, {"path": "./resources"}),
])

if __name__ == "__main__":
  application.listen(9090)
  tornado.ioloop.IOLoop.instance().start()
