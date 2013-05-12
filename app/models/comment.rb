class Comment
  include Mongoid::Document

  belongs_to :user
  embedded_in :build
end
