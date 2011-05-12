require "fileutils"
require 'capybara/envjs_trr/runtime'

module Capybara
  module EnvjsTrr
    class Browser
      attr_reader :window
      def initialize(rack_app)
        runtime = Capybara::EnvjsTrr::Runtime.new(rack_app)
        @global = runtime.new_context
        runtime.configure_context(runtime, @global)
        @global.load("envjs/rubyracer.js")
        @window = @global.eval("new Window()")
      end
      
      def tick
        @global.eval("Envjs.tick()")
      end
    end
  end
end
