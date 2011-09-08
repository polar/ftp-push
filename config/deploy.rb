#
# Settings for Capistrano
#
set :rails_env, "production"
set :application, "Venuespy"

# Deployment From Source Code Management (SCM)
set :scm, :git
set :scm_username, "polar"
set :repository,  "git@github.com:VenueSpy/ftppush-app.git"
set :git_enable_submodules, 1

# If we need a SSH Tunnel to get out or get to the remote server.
# Sadly, I think this applies to all out going connections.
#set :gateway, "polar@adiron.kicks-ass.net:922"

# Remote Server
# The app has its own user id.
set :deploy_to, "/home/ftppush"
set :use_sudo, false
set :user, "ftppush"


#role :web, "venuespy.com"                          # Your HTTP server, Apache/etc
#role :app, "venuespy.com"                          # This may be the same as your `Web` server
#role :db,  "localhost", :primary => true # This is where Rails migrations will run
#role :db,  "your slave db-server here"
server "ftppush@venuespy.com", :web, :app, :db, :primary => true

# if you're still using the script/reaper helper you will need
# these http://github.com/rails/irs_process_scripts

# If you are using Passenger mod_rails uncomment this:
# namespace :deploy do
#   task :start do ; end
#   task :stop do ; end
#   task :restart, :roles => :app, :except => { :no_release => true } do
#     run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
#   end
# end

set :unicorn_binary, "/usr/bin/unicorn"
set :unicorn_config, "#{current_path}/config/unicorn.rb"
set :unicorn_pid, "#{current_path}/tmp/pids/unicorn.pid"

namespace :deploy do
  task :start, :roles => :app, :except => { :no_release => true } do
    run "cd #{current_path} && #{try_sudo} #{unicorn_binary} -c #{unicorn_config} -E #{rails_env} -D"
  end
  task :stop, :roles => :app, :except => { :no_release => true } do
    run "#{try_sudo} kill `cat #{unicorn_pid}`"
  end
  task :graceful_stop, :roles => :app, :except => { :no_release => true } do
    run "#{try_sudo} kill -s QUIT `cat #{unicorn_pid}`"
  end
  task :reload, :roles => :app, :except => { :no_release => true } do
    run "#{try_sudo} kill -s USR2 `cat #{unicorn_pid}`"
  end
  task :restart, :roles => :app, :except => { :no_release => true } do
    stop
    start
  end
end                                                                                    53,1          Bot
                                                                               29,1          70%
