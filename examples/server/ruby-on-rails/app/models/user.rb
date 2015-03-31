class User < ActiveRecord::Base
  validates_uniqueness_of :email

  has_secure_password

  def self.for_oauth oauth
    oauth.get_data
    data = oauth.data

    user = find_or_create_by(oauth.provider => oauth[:id], email: data[:email])
    user.update display_name: oauth.get_names.join(' ')

    user
  end

  def displayName= name
    self.display_name = name
  end
end
