class User
  include Mongoid::Document

  field :password_salt, type: String
  field :password_hash, type: String
  field :username,      type: String
  field :email,         type: String
  field :account,       type: String
  field :character,     type: String

  attr_accessor :password
  before_save :encrypt_password
  
  validates_confirmation_of :password
  validates_presence_of :password, :on => :create
  validates_presence_of :username, :on => :create
  validates_uniqueness_of :username

  has_many :builds
  #has_many :comments

  def authenticate(username, password)
    user = User.find_by_username(username)
    if user && user.password_hash == BCrypt::Engine.hash_secret(password, user.password_salt)
      user
    else
      nil
    end
  end

  def builds_count
    attributes['builds_count']
  end
  
  def encrypt_password
    if password.present?
      self.password_salt = BCrypt::Engine.generate_salt
      self.password_hash = BCrypt::Engine.hash_secret(password, password_salt)
    end
  end
end
