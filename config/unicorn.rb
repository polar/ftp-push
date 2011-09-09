##
# Unicorn config
##

# What ports/sockets to listen on, and what options for them.
listen "/tmp/ftppush.sock", :tcp_nodelay => true, :backlog => 1000

pid '/home/ftppush/current/tmp/pids/unicorn.pid'

working_directory '/home/ftppush/current'

# What the timeout for killing busy workers is, in seconds
timeout 60

# Whether the app should be pre-loaded
preload_app false

# How many worker processes
worker_processes 2

# What to do before we fork a worker
before_fork do |server, worker|
  ENV["PATH"]="/usr/local/bin:#{ENV['PATH']}"
  sleep 1
end

