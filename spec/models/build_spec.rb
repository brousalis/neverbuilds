require 'spec_helper'

describe Build do
  let(:user) {
    User.create(username: SecureRandom.uuid, password: SecureRandom.uuid)
  }

  it "can be created for a user" do
    Build.create( :user => user, 
                  :name => "My build",
                  :category => "Random",
                  :character_class => "Ranger").should be_valid
  end
end
