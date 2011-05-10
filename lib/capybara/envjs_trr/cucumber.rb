require 'capybara/cucumber'

Before('@envjs') do
  Capybara.current_driver = :envjs_trr
end
