import asyncore
import logging
import socket

# Logging Parameters - TODO: Implement this properly later on for testing.
logging.basicConfig(level = logging.DEBUG, format = "%(created)-15s %(msecs)d %(levelname)8s %(thread)d %(name)s %(message)s")
log = logging.getLogger(__name__)
BACKLOG = 5
SIZE = 1024

class EchoHanlder(asyncore.dispatcher):
	
	def __init__(self, conn_sock, client_address, server):
		self.server = server
		self.client_address = client_address
		self.buffer = ""

		self.is_readable = True
		self.is_writable = False

		asyncore(dispatcher.__init__(self, conn_sock))
		# log.debug("Established Handler. Pending loop sequence...")
		
	def readable(self):
		return self.is_readable

	def writable(self):
		return self.is_writable
	
	def handle_read(self):
		# log.debug("[handle_read]")
		data = self.recv(SIZE)
		if data:
			# log.debug("Data recieved")
			self.buffer += data
			self.isWritable = True
		# else:
			# log.debug("NULL data recieved")

	def handle_write(self):
		# log.debug("[handle_write]")
		if self.buffer:
			sent = self.send(self.buffer)
			# log.debug("Sent Data")
			self.buffer = self.buffer[sent:]
		# else:
			# log.debug("Sent Nothing")
		
		if len(self.buffer) == 0:
			self.is_writable = False

	def handle_close(self):
		# log.debug("[handle_close]")
		# log.info("conn_closed: client_address=%s:%s" % (self.client_address[0], self.client_address[1]))
		self.close()

class EchoServer(asyncore.dispatcher):
 
    allow_reuse_address = False
    request_queue_size = 5
    address_family = socket.AF_INET
    socket_type = socket.SOCK_STREAM
 
    def __init__(self, address, handlerClass=EchoHandler):
        self.address            = address
        self.handlerClass       = handlerClass
 
        asyncore.dispatcher.__init__(self)
        self.create_socket(self.address_family,
                               self.socket_type)
 
        if self.allow_reuse_address:
            self.set_reuse_addr()
 
        self.server_bind()
        self.server_activate()
 
    def server_bind(self):
        self.bind(self.address)
        log.debug("Bind: Address=%s:%s" % (self.address[0], self.address[1]))
 
    def server_activate(self):
        self.listen(self.request_queue_size)
        log.debug("Listen: Backlog=%d" % self.request_queue_size)
 
    def fileno(self):
        return self.socket.fileno()
 
    def serve_forever(self):
        asyncore.loop()
 
    # TODO: Implement a proper request handler using handle_request()
 
    def handle_accept(self):
        (conn_sock, client_address) = self.accept()
        if self.verify_request(conn_sock, client_address):
            self.process_request(conn_sock, client_address)
 
    def verify_request(self, conn_sock, client_address):
        return True
 
    def process_request(self, conn_sock, client_address):
        log.info("conn_made: client_address=%s:%s" % \
                     (client_address[0],
                      client_address[1]))
        self.handlerClass(conn_sock, client_address, self)
 
    def handle_close(self):
        self.close()