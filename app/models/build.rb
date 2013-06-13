class Build
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Tracking

  belongs_to :user

  field :name, type: String
  field :type, type: String
  field :race, type: String
  field :video, type: String
  field :body, type: String
  field :character_class, type: String

  validates_presence_of :user 
  validates_presence_of :name
  validates_presence_of :race
  validates_presence_of :type
  validates_presence_of :body
  validates_presence_of :character_class
  validates_uniqueness_of :name

  track :visits

  def is_featured?
    true if self.type == "featured"
  end

  def add_activity
    Activity.add(self.user, Activity::POSTED_GUIDE, self)
  end  

  def all_comments
    self.comments.collect { |c| [c] + c.comments }.flatten
  end

  def more_from_type
    Build.find_all_by_type(self.type, :limit => 4, :conditions => ["id != ?", self.id])
  end

  def self.all_categories
    Build.select(:type).group(:type).collect { |g| g.type}
  end
end
