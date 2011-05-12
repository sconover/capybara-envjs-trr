require 'rack/client'

module Capybara
  module EnvjsTrr
    class RackAppConnectionHandler
      def initialize(rack_app)
        @rack_client = Rack::Client::Simple.new(rack_app)
      end
  
      def connect(host, port)
        p 1
        p host
        # Net::HTTP.start(host, port)
        return "fake connection"
      end

      def request(httpMethod, path)
        p 2
        p path
        # case httpMethod
        # when "GET" then return Net::HTTP::Get.new(path) 
        # when "PUT" then return Net::HTTP::Put.new(path) 
        # when "POST" then return Net::HTTP::Post.new(path)
        # when "HEAD" then return Net::HTTP::Head.new(path)
        # when "DELETE" then return Net::HTTP::Delete.new(path)
        # else return nil
        # end
      end

      def go(connection, request, headers, data)
        p 3
        p request
        # headers.each{|key,value| request.add_field(key,value)}
        # response, body = connection.request(request, data)
        # respheaders = Hash.new
        # response.each_header do |name, value|
        #   respheaders.store(name, value)
        # end
        # response['body'] = body
        # [response, respheaders]
        [{"code" => 200, "message" => "ThisIsTheMessage", "body" => "<html>Hello ZZZ</html>"}, {}]
      end

      def finish(connection)
        p 4
        # connection.finish if connection.started?
      end
    end
  end
end

