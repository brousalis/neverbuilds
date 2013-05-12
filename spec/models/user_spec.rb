require 'spec_helper'

describe User do
  it "can be created with a username and password" do
    User.create(username: "test", password: "uhhh").should be_valid
  end
end
