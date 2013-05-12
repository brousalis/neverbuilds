require 'spec_helper'

describe User do
  let(:username) { SecureRandom.uuid }
  let(:password) { SecureRandom.uuid }

  it "can be created with a username and password" do
    user = User.create(username: username, password: password)

    user.should be_valid
  end

  it "can also be created with an account, character and email" do
    user = User.create(username: username,
                password: password,
                account: "NEVERWINTERROX",
                character: "Leeroy Jenkins",
                email: "test@test.com")
     
    user.should be_valid

    user.account.should == "NEVERWINTERROX"
    user.character.should == "Leeroy Jenkins"
    user.email.should == "test@test.com"
  end

  it "returns nil for optional fields if not set" do
    user = User.create(username: username, password: password)


    user.account.should be_nil
    user.character.should be_nil 
    user.email.should be_nil 
  end
end
