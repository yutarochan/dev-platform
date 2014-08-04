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

	def __init__(self, host, port):
		asyncore.dispatcher.__init__(self)
		self.create_socket(socket.AF_INET, sokcet.SOCK_STREAM)
		self.bind((host, port))
		self.listen(5)
