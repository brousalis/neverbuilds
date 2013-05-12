FactoryGirl.define do
  factory :user do
    username  { SecureRandom.uuid }
    password  "hunter2"
  end

  factory :build do
    user

    name { SecureRandom.uuid }
    category "builds"
    character_class "trickster_rogue"
  end
  
end
