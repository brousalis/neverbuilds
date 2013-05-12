class Build
  include Mongoid::Document

  belongs_to :user
  #has_many :comments, :dependent => :destroy

  field :name,      type: String
  field :category,  type: String
  field :character_class,     type: String

  validates_presence_of :user 
  validates_presence_of :name
  validates_presence_of :category
  validates_presence_of :character_class
  validates_uniqueness_of :name

  #opinio_subjectum

  def is_featured?
    true if self.type == "featured"
  end

  def add_activity
    Activity.add(self.user, Activity::POSTED_GUIDE, self)
  end  

  def all_comments
    self.comments.collect { |c| [c] + c.comments }.flatten
  end

  def more_from_category
    Build.find_all_by_category(self.category, :limit => 4, :conditions => ["id != ?", self.id])
  end

  def self.all_categories
    Build.select(:category).group(:category).collect { |g| g.category }
  end
end
