# -*- mode: ruby; encoding: utf-8 -*-
lib = File.expand_path('../lib/', __FILE__)
$:.unshift lib unless $:.include?(lib)

require 'capybara/envjs_trr/version'

Gem::Specification.new do |s|
  s.name = "capybara-envjs-trr"
  s.rubyforge_project = "capybara-envjs-trr"
  s.version = Capybara::EnvjsTrr::VERSION

  s.authors = ["Steve Conover"]
  s.email = ["sconover@gmail.com"]
  s.description = "A Capybara driver for the envjs, making use of therubyracer (ruby+v8) js support. Based on Steven Parkes's capybara-envjs gem."

  s.files = Dir.glob("{lib,spec}/**/*") + %w(README.rdoc CHANGELOG.rdoc)
  s.extra_rdoc_files = ["README.rdoc"]

  s.homepage = "http://github.com/sconover/capybara-envjs-trr"
  s.rdoc_options = ["--main", "README.rdoc"]
  s.require_paths = ["lib"]
  s.rubygems_version = "1.3.6"
  s.summary = "Capybara driver for envjs + therubyracer"

  s.add_runtime_dependency("capybara", "~> 0.4.0")
  s.add_runtime_dependency("therubyracer", ">= 0.8.1")
  s.add_runtime_dependency("nokogiri", ">= 1.4.4")

  s.add_development_dependency("bundler", "~> 1.0")
  s.add_development_dependency("rspec", "~> 2.0")
  s.add_development_dependency("rack-client", ">= 0.3.0")
  s.add_development_dependency("sinatra", "~> 1.0")
end
