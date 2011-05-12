require 'rack/client'

module Capybara
  module EnvjsTrr
    class RackAppConnectionHandler
      def initialize(rack_app)
        @rack_client = Rack::Client::Simple.new(rack_app)
      end
  
      def connect(host, port)
        # Net::HTTP.start(host, port)
        return "fake connection"
      end

      def request(httpMethod, path)
        # case httpMethod
        # when "GET" then return Net::HTTP::Get.new(path) 
        # when "PUT" then return Net::HTTP::Put.new(path) 
        # when "POST" then return Net::HTTP::Post.new(path)
        # when "HEAD" then return Net::HTTP::Head.new(path)
        # when "DELETE" then return Net::HTTP::Delete.new(path)
        # else return nil
        # end
        return {"method" => httpMethod, "path" => path}
      end

      def go(connection, request, headers, data)
        # headers.each{|key,value| request.add_field(key,value)}
        # response, body = connection.request(request, data)
        # respheaders = Hash.new
        # response.each_header do |name, value|
        #   respheaders.store(name, value)
        # end
        # response['body'] = body
        # [response, respheaders]
        response = @rack_client.get(request["path"])
        body = response.body.join
        body = "<html>#{body}</html>" if response.headers["Content-Type"].include?("html") && !body.include?("<html")
        [{"code" => response.status, 
          "message" => "", 
          "body" => body}, response.headers]
      end

      def finish(connection)
        # connection.finish if connection.started?
      end
    end
  end
end

