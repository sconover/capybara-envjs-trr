require 'rubygems'
require 'bundler/setup'
require 'capybara/envjs_trr'
require 'capybara/envjs_trr/envjs_rubyracer'
require 'capybara/envjs_trr/browser'
 
# spec_dir = nil
# $:.detect do |dir|
#   puts dir
#   if File.exists? File.join(dir, "capybara.rb")
#     spec_dir = File.expand_path(File.join(dir,"..","spec"))
#     $:.unshift( spec_dir )
#   end
# end

spec_dir = "../capybara/spec"
$:.unshift( spec_dir )
require File.join(spec_dir,"spec_helper")

RSpec.configure do |c|
  # c.filter_run :focus => true
end
