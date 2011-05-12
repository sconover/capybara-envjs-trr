require File.expand_path('../spec_helper', File.dirname(__FILE__))

describe Capybara::Driver::EnvjsTrr do

  before(:all) do
    @driver = Capybara::Driver::EnvjsTrr.new(TestApp)
  end
  after do
    # @driver.browser.window.eval("window.location.href='about:blank'")
  end

  it_should_behave_like "driver"
  # it_should_behave_like "driver with header support"
  # it_should_behave_like "driver with status code support"
  # it_should_behave_like "driver with cookies support"
  # it_should_behave_like "driver with infinite redirect detection"
  # it_should_behave_like "driver with javascript support"
end
