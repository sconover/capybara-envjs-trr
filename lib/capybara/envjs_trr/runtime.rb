require 'v8'
require 'net/http'
require 'uri'
require 'thread'

require 'capybara/envjs_trr/rack_app_connection_handler'
require 'nokogiri'

module Capybara
  module EnvjsTrr
    
    
    
    lock  = Mutex.new
    class Runtime
      include Config
      def initialize(rack_app)
        @rack_app = rack_app
      end
      
      def new_context
        V8::Context.new
      end
      
      def configure_context(runtime, context)
        #see https://github.com/cowboyd/therubyracer/issues/68#issuecomment-1099958
        ruby = context.eval('Ruby = new Object()')
        

        Module.included_modules.each{|m| 
          #puts "adding module #{m}"
          ruby[m.to_s] = m
        }
        Module.constants.each{|c| 
          #puts "adding constant #{c}"
          ruby[c.to_s] = Kernel.eval(c)
        }
        Kernel.global_variables.each{|g| 
          #puts "adding global variable #{g}"
          ruby[g.to_s] = Kernel.eval(g)
        }
        Kernel.methods.each{|m| 
          #puts "adding global method #{m}"
          ruby[m.to_s] = Kernel.method(m)
        }
        ruby['CONFIG'] = CONFIG
        ruby['gc'] = lambda{ GC.start() }
        
        context['Ruby']  = ruby
    
        context['__this__']  = context
        context['File']      = File
        #context['sync']      = lambda{|fn| Proc.new{|*args|lock.synchronize {fn.call(*args)}} }
        context['sync']      = lambda{|fn| Proc.new{|*args| fn.call(*args) }}
        #context['spawn']     = lambda{|fn| Thread.new {fn.call}}
        context['spawn']     = lambda{|fn| fn.call}
        context['print']     = lambda{|msg| puts msg}
        context['fopen']     = lambda{|name, mode| File.open(name, mode)}
        context['runtime']   = runtime
        context['new_context']   = lambda{
          rt = Capybara::EnvjsTrr::Runtime.new
          ct = rt.new_context()
          rt.configure_context(rt, ct)
          ct['_eval'] = lambda{|script| ct.eval(script)}
          ct.eval('var t = new Function(); t._eval = __this__._eval;t;') 
        }
        context['HTTPConnection'] = Capybara::EnvjsTrr::RackAppConnectionHandler.new(@rack_app)
      end
    end
  end
end



