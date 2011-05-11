require "fileutils"

module Capybara
  module EnvjsTrr
    class Browser
      def initialize
        runtime = Runtime.new
        @global = runtime.new_context()
        runtime.configure_context(runtime, @global)
        @global.load("envjs/rubyracer.js")
      end
    end
  end
end
