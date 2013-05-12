require 'spec_helper'

describe Comment do
  let(:user) { FactoryGirl.create :user }
  let(:build) { FactoryGirl.create :build }

  it "can be created for a build by a user with text" do
    comment = Comment.create(user: user,
                             build: build,
                             text: "Your build sucks")

    comment.should be_valid
    comment.text.should == "Your build sucks"
  end
end
